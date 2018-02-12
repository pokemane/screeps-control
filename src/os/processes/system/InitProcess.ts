import { LogMsgType, Priority, SCRIPT_VERSION } from "os/core/Constants";
import { Process } from "os/core/Process";

export class InitProcess extends Process {
  public metaData: any;
  public type = "init";

  public run() {
    // ---------------------------------------- sys processes
    const kernel = this.kernel;
    if (!kernel.hasProcess("memoryManager")) {
      this.kernel.addProcess(
        "memoryManager",
        "memoryManager",
        Priority.HIGHEST,
        {}
      );
    }
    if (!kernel.hasProcess("statsManager")) {
      this.kernel.addProcess(
        "statsManager",
        "statsManager",
        Priority.HIGH,
        {}
      );
    }
    if (!kernel.hasProcess("suspension")) {
      this.kernel.addProcess(
        "suspension",
        "suspension",
        Priority.LAST,
        {}
      );
    }
    // ---------------------------------------- room management processes
  }
}
