import { LogLevel, SCRIPT_VERSION } from "os/core/Constants";
import { BaseProcess } from "os/core/Process";

export class MemoryManagerProcess extends BaseProcess {
  public metaData: any;

  public type = "memoryManager";

  public run() {

    if (!Memory.os.version) {
      Memory.os.version = SCRIPT_VERSION;
    } else if (Memory.os.version !== SCRIPT_VERSION) {
      // probably do some kind of version parsing to do memory format migrations,
      // or just dump all running/cached processes and start new :^)
    }

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
      }
    }

    this.suspend = 4;
  }
}
