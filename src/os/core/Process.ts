
import { LogLevel } from "os/core/Constants";
import { IKernel } from "os/core/Kernel";

export interface IProcess {
  name: string;
  priority: number;
  completed: boolean;
  type: string;
  parent: IProcess | undefined;
  suspend: boolean | number | string;
  hasAlreadyRun: boolean;
  run(): void;
  serialize(): ISerializedProcess;
  resumeProcess(): void;
  resumeParent(): void;
}

export interface ISerializedProcess {
  name: string;
  priority: number;
  metadata: object;
  suspend: boolean | number | string;
  parent: string;
}
/**
 * Process prototype
 * TODO: use templating and mapped types and stuff to better define the metadata and stuff.
 * eg BaseProcess<M in keyof MetaData>
 *   metaData: M
 *
 * @export
 * @abstract
 * @class BaseProcess
 * @implements {Process}
 */
export abstract class BaseProcess implements IProcess {

  protected kernel: IKernel;
  public name: string;
  public priority: number;
  public completed: boolean = false;
  protected abstract metaData: any;
  public abstract type: string;
  public parent: IProcess | undefined;
  public hasAlreadyRun: boolean;

  // number is used for # of ticks to suspend, decremented each tick
  // string is used to denote which process this process should wait on
  public suspend: boolean | number | string = false;

  /**
   * rebuild the process from serialized data
   */
  constructor(entry: ISerializedProcess, kernel: IKernel) {
    this.kernel = kernel;
    this.name = entry.name;
    this.priority = entry.priority;
    this.suspend = entry.suspend;
    this.hasAlreadyRun = false;
    // the default metadata assignment for Processes that don't take care of it themselves
    this.setMetaData(entry.metadata);
    if (entry.parent !== "") {
      this.parent = this.kernel.getProcessByName(entry.parent);
    }
  }

  public abstract run(): void;

  /**
   * resume
   */
  public resumeProcess() {
    this.suspend = false;
  }

  /**
   * resume parent
   */
  public resumeParent() {
    if (this.parent) {
      this.parent.resumeProcess();
    }
  }

  /**
   * serialize the process and its metadata to be stored until
   * the scheduler deterimines that the process should run again
   * @returns {ISerializedProcess} the serialized process
   */
  public serialize(): ISerializedProcess {
    let parentProcess = "";

    if (this.parent) {
      parentProcess = this.parent.name;
    }

    return {
      metadata: this.metaData,
      name: this.name,
      parent: parentProcess,
      priority: this.priority,
      suspend: this.suspend,
      type: this.type
      } as ISerializedProcess;
  }

  /**
   * spawnChildProcess
   * @param processType the process type to spawn
   * @param name the name of the new child process
   * @param priority the priority of the child process
   * @param meta the metadata to be associated with the child process
   * @param suspendParent whether to suspend the parent during the execution of the child process
   */
  // tslint:disable-next-line:max-line-length
  protected spawnChildProcess<T extends ProcessTypes>(processType: T, name: string, priority: number, meta: any, suspendParent: boolean = false) {
    this.kernel.addProcess(processType, name, priority, meta, this.name);

    if (suspendParent) {
      // block on child process?
      this.suspend = name;
    }
  }

  protected log(message: string, msgType: LogLevel = LogLevel.debug, processName: string = this.name) {
    this.kernel.log(processName, message, msgType);
  }

  protected setMetaData(meta: object) {
    this.metaData = meta;
  }

}
