
import { LogLevel, Priority } from "os/core/Constants";
import { IProcess, ISerializedProcess } from "os/core/Process";
import { RoomEnergyManager } from "os/processes/room/EnergyManagerProcess";
import { RoomManagerProcess } from "os/processes/room/RoomControllerProcess";
import { SpawnManagerProcess } from "os/processes/room/SpawnManagerProcess";
import { RoomStaticDataManager } from "os/processes/room/StaticDataManagerProcess";
import { InitProcess } from "os/processes/system/InitProcess";
import { MemoryManagerProcess } from "os/processes/system/MemoryManagerProcess";
import { StatsManagerProcess } from "os/processes/system/StatsManagerProcess";
import { SuspensionProcess } from "os/processes/system/SuspensionProcess";

const processTypes = {
init: InitProcess,
memoryManager: MemoryManagerProcess,
roomEnergyManager: RoomEnergyManager,
roomManager: RoomManagerProcess,
roomSpawnManager: SpawnManagerProcess,
roomStaticDataManager: RoomStaticDataManager,
statsManager: StatsManagerProcess,
suspension: SuspensionProcess
} as {[name: string]: any};

interface ISysLogItem {
  processName: string;
  message: string;
  msgType: LogLevel;
  cpu: number;
}

export interface IProcessTable {
  [name: string]: IProcess;
}

export interface IKernel {
  processTable: IProcessTable;
  shutdown(): void;
  runNextProcess(): void;
  getProcessByName(name: string): any;
  addProcess<T extends ProcessTypes>(processType: T, name: string, priority: number, meta: any, parent?: string): void;
  hasProcess(name: string): boolean;
  log(processName: string, message: string, msgType: number): void;
}

/**
 * Kernel for the screeps controller.
 * The kernel is responsible for:
 *  - Maintaining a list of all processes to run
 *  - Scheduling the process list by priority
 *  - Tracking and managing CPU usage of the system
 *  - (De)Serializing process information for storage between ticks or when a process is slept or suspended
 *
 * The kernel will use a priority-based scheduler.  Other strategies may be employed if the need arises.
 */
export class KernelSG implements IKernel {

  private cpuLimit: number;
  public processTable: IProcessTable = {};
  private sortedProcesses: string[] = [];
  private sysLog: ISysLogItem[] = [];

  /**
   * @constructor
   */
  constructor() {
    if (!Memory.os) {
      Memory.os = {};
    }
    this.log("kernel init:", "running kernel setup");
    this.cpuLimit = this.defineCpuLimit();

    this.boot();
  }

  /**
   * perform startup actions
   */
  protected boot() {
    this.loadProcessTable();
    // init process needs no metadata
    this.addProcess("init", "init", Priority.FIRST, {});
    // todo other stuff
  }

  /**
   * perform shutdown functions
   */
  public shutdown() {
    const numProcsRunThisTick = this.saveProcessTable();

    this.log("shutdown", "Processes count: " + numProcsRunThisTick, LogLevel.info);
    this.log("shutdown", "Total CPU used: " + Game.cpu.getUsed(), LogLevel.info);
    console.log(this.buildSysLog());
  }

  protected loadProcessTable() {
    // tslint:disable-next-line:prefer-const
    let kernel = this;
    _.forEach(Memory.os.processTable, (entry: any) => {
      if (processTypes[entry.type]) {
        kernel.processTable[entry.name] = new processTypes[entry.type](entry, kernel);
      } else {
        kernel.log("Load process table", "Tried loading process with invalid type: " + entry.name, LogLevel.error);
      }
    });
  }

  protected saveProcessTable(): number {
    const processList: ISerializedProcess[] = [];
    _.forEach(this.processTable, (entry: IProcess) => {
      if (!entry.completed) {
        processList.push(entry.serialize());
      }
    });
    Memory.os.processTable = processList;
    return processList.length;
  }

  public runNextProcess() {
    const processToRun = this.getHighestPrioProcess();
    if (processToRun.suspend === false) {
      try {
        processToRun.run();
      } catch (e) {
        this.log(processToRun.name, "Error: " + e, LogLevel.error);
      }
    }
    this.log("scheduler", "next process => " + processToRun.name, LogLevel.trace);
    processToRun.hasAlreadyRun = true;
  }

  protected getHighestPrioProcess() {
    if (!this.sortedProcesses.length) {
      // if we haven't scheduled anything since a process was added
      // or the kernel was last started
      const toRunProcesses = _.filter(this.processTable, (proc: IProcess) => {
        return (!proc.hasAlreadyRun && proc.suspend === false);
      });
      const sorted = _.sortBy(toRunProcesses, "priority").reverse();
      this.sortedProcesses = _.map(sorted, "name");
    }
    const name = this.sortedProcesses.shift()!;
    return this.processTable[name!];
  }

  public hasProcess(name: string) {
    return (!!this.getProcessByName(name));
  }

  public getProcessByName(name: string): any {
    return this.processTable[name];
  }

  /**
   * Defines the CPU limit for the kernel
   */
  protected defineCpuLimit() {

    // Simulator has no limit
    if (Game.cpu.limit === undefined) {
        return  1000;
    }
    return Game.cpu.tickLimit * 0.95;
  }

  /**
   * Are we still able to do some stuff this tick?
   */
  public stillUnderCpuLimit() {
    return (Game.cpu.getUsed() < this.cpuLimit);
  }

  /**
   * add a process to the process table
   * @param {T} processType type of process to add
   * @param {string} name name of process to add
   * @param {number} priority priority of new process
   * @param {*} meta metadata of new process
   * @param {string} [parent] optional parent of new process
   */
  // tslint:disable-next-line:max-line-length
  public addProcess<T extends ProcessTypes>(processType: T, name: string, priority: number, meta: any, parent?: string) {
    this.processTable[name] = new processTypes[processType]({
      metadata: meta,
      name,
      parent,
      priority,
      suspend: false
    }, this);
    this.sortedProcesses = [];
  }

  /**
   * do we have any processes left to run?
   */
  public anyProcessesLeftToRun() {
    return _.filter(this.processTable, (proc: IProcess) => {
      return (!proc.hasAlreadyRun && proc.suspend === false);
    }).length > 0;
  }

  /**
   * add message to 'syslog'
   * @param processName the name of the process doing the loggging
   * @param message the message to log
   * @param msgType debug, warning, etc
   */
  public log(processName: string, message: string, msgType: LogLevel = LogLevel.debug) {
    this.sysLog.push({
      cpu: Game.cpu.getUsed(),
      message,
      msgType,
      processName
    });
  }

  private buildSysLog(): string {
    let output: string = "";

    output += "<table cellpadding='4'>";

    output +=
      "<tr>" +
      "   <th>Tick</th>" +
      "   <th>Process</th>" +
      "   <th>Message</th>" +
      "   <th>CPU</th>" +
      "</tr>";

    _.forEach(this.sysLog, (msg: ISysLogItem) => {
      /**
       * if we have a logging level explicitly defined
       * AND
       * the message type is lower than the selected level,
       * skip the message.
       * The goal is to always show errors and general info,
       * but to selectively show warn/debug/trace.
       */
      if ("loggingLevel" in Memory.os && msg.msgType < Memory.os.loggingLevel) {
        return;
      }

      let color = "";
      switch (msg.msgType) {
        case LogLevel.info:
          color = "green";
          break;
        case LogLevel.trace:
          color = "#00edff";
          break;
        case LogLevel.debug:
          color = "#e4e4e4";
          break;
        case LogLevel.warn:
          color = "#ffbb00";
          break;
        case LogLevel.error:
          color = "#ff4500";
          break;
        default:
          color = "#fffff";
          break;
      }

      output +=
        "<tr style='color: " + color + ";'>" +
        "   <td> " + Game.time + " </td>" +
        "   <td> " + msg.processName + " </td>" +
        "   <td> " + msg.message + " </td>" +
        "   <td> " + msg.cpu + " </td>" +
        "</tr>";
    });

    output += "</table>";
    this.sysLog = [];
    return output;
  }

}
