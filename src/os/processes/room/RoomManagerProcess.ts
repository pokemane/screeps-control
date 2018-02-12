import { Process } from "os/core/Process";
import { Priority } from "../../core/Constants";
import { Kernel } from "../../core/Kernel";

export class RoomManagerProcess extends Process {

  public metaData: MetaData["roomManager"];
  public type = "roomManager";

  constructor(entry: SerializedProcess, kernel: Kernel) {
    super(entry, kernel);
    // TS is throwing me a "Property has no initializer and is not definitely assigned in the constructor."
    // when I don't do this explicitly in the constructor.  For subclasses of Process,
    // this ends up being a re-assignment.  Unsure of impact.
    // The reason I need to do the assignment/typing in the first place is because
    // I want TS to help me out with metadata contents and typings.
    // TODO: figure out if this is an issue, and how to fix it!
    this.metaData = entry.metadata as MetaData["roomManager"];
  }

  public run() {
    throw new Error("RoomManager not fully implemented yet!");

    /* const room = Game.rooms[this.metaData.roomName];
    if (room && room.controller && (room.controller!).my) {
      // placeholders for task-specific processes
      const energyManagerName = "roomEnergyManager-" + this.metaData.roomName;
      if (!this.kernel.hasProcess(energyManagerName)) {
        this.spawnChildProcess(
          "roomEnergyManager",
          energyManagerName,
          Priority.HIGH,
          {roomName: this.metaData.roomName},
          false
        );
      }
    } */
  }

}
