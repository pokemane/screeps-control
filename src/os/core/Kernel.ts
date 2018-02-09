import { Process } from "os/core/Process";
/**
 * Kernel for the screeps controller.
 * The kernel is responsible for:
 *  - Maintaining a list of all processes to run
 *  - Scheduling the process list by priority
 *  - Tracking and managing CPU usage of the system
 *  - (De)Serializing process information for storage between ticks or when a process is slept or suspended
 * The kernel will use a priority-based scheduler.  Other strategies may be employed if the need arises.
 */

interface ProcessTable {
  [name: string]: Process;
}

export class Kernel {

  /**
   * @constructor
   */
  constructor() {
    // todo
  }

  // all processes to run this tick
  private ProcessTable: ProcessTable;

  public boot() {
    // todo
    // probably will be taken over as part of the constructor
  }

  public shutdown() {
    // todo
  }

  public runNextProcess() {
    // todo
  }

  public getHighestPrioProcess() {
    // todo
  }

  public addProcess() {
    // todo
  }

}
