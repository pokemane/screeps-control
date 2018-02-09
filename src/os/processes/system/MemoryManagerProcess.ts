import { SCRIPT_VERSION } from "os/core/Constants";
import { Process } from "os/core/Process";

export class MemoryManagerProcess extends Process {
  public metaData: any;

  public type = ProcessType.memoryManager;

  public run() {

    if (!Memory.spacebot.version) {
      Memory.spacebot.version = SCRIPT_VERSION;
    } else if (Memory.spacebot.version !== SCRIPT_VERSION) {
      // probably do some kind of version parsing to do memory format migrations,
      // or just dump all running/cached processes and start new :^)
    }

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
      }
    }

    this.suspend = 100;
  }
}
