import { Kernel } from "os/core/Kernel";
/**
 * Process prototype
 *
 */
export abstract class Process {

  public kernel: Kernel;
  public name: string;
  public priority: number;
  public completed: boolean = false;
  public abstract metaData: any;
  public abstract type: ProcessType;
  public parent: Process | undefined;
  public hasAlreadyRun: boolean;

  // number is used for # of ticks to suspend, decremented each tick
  // string is used to denote which process this process should wait on
  public suspend: boolean | number | string = false;

  /**
   * rebuild the process from serialized data
   */
  constructor(entry: SerializedProcess, kernel: Kernel) {
    this.kernel = kernel;
    this.name = entry.name;
    this.priority = entry.priority;
    this.suspend = entry.suspend;
    this.hasAlreadyRun = false;

    this.setMetaData(entry.metadata);
  }

  public run() {
    // todo
  }

  /**
   * resume
   */
  public resumeProcess() {
    // todo
  }

  /**
   * suspend
   */
  public suspendProcess() {
    // todo
  }

  /**
   * serialize the process and its metadata to be stored until
   * the scheduler deterimines that the process should run again
   * @returns {SerializedProcess} the serialized process
   */
  public serialize(): SerializedProcess {
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
    } as SerializedProcess;
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
  public spawnChildProcess<T extends ProcessType>(processType: T, name: string, priority: number, meta: any, suspendParent: boolean = false) {
    this.kernel.addProcess(processType, name, priority, meta, this.name);

    if (suspendParent) {
      // who's blocking me?
      this.suspend = name;
    }
  }

  protected setMetaData(meta: object) {
    this.metaData = meta;
  }
}
