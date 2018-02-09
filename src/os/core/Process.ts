import { Kernel } from "os/core/Kernel";
/**
 * Process prototype
 *
 */
export abstract class Process {
  public name: string;
  public priority: number;
  public completed: boolean = false;
  public abstract metaData: any;
  public abstract type: ProcessType;
  public parent: Process | undefined;

  // number is used for # of ticks to suspend, decremented each tick
  // string is used to denote which process this process should wait on
  public suspend: boolean | number | string = false;

  /**
   * rebuild the process from serialized data
   */
  constructor() {
    // todo
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
   * serialize the process and its metadata to be stored until the next tick
   */
  public serialize() {
    // todo
  }

  /**
   * spawnChildProcess
   */
  // tslint:disable-next-line:max-line-length
  public spawnChildProcess<T extends ProcessTypes>(processType: T, name: string, priority: number, meta: any, suspendParent: boolean = false) {
    // todo
  }
}
