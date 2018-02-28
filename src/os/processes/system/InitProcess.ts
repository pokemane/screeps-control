
import { LogLevel, Priority, SCRIPT_VERSION } from "os/core/Constants";
import { BaseProcess } from "os/core/Process";

export class InitProcess extends BaseProcess {
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

    _.forEach(Game.rooms, (room: Room) => {
      const procName = "roomManager-" + room.name;
      if (!room.controller || !room.controller.my) {
        return;
      }
      if (this.kernel.hasProcess(procName)) {
        return;
      }
      this.kernel.addProcess(
        "roomManager",
        procName,
        Priority.HIGHEST,
        {
          roomDataSet: false,
          roomName: room.name
        } as IMetaData["roomManager"]
      );
    });

  } // end run()

}
