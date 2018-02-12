import { Kernel } from "os/core/Kernel";
import { Process } from "os/core/Process";

export class RoomStaticDataManager extends Process {
  public metaData: MetaData["staticRoomData"];
  public type = "roomStaticDataManager";

  constructor(entry: SerializedProcess, kernel: Kernel) {
    super(entry, kernel);
    // TS is throwing me a "Property has no initializer and is not definitely assigned in the constructor."
    // when I don't do this explicitly in the constructor.  For subclasses of Process,
    // this ends up being a re-assignment.  Unsure of impact.
    // The reason I need to do the assignment/typing in the first place is because
    // I want TS to help me out with metadata contents and typings.
    // TODO: figure out if this is an issue, and how to fix it!
    this.metaData = entry.metadata as MetaData["staticRoomData"];
  }
  public run(): void {
    const room = Game.rooms[this.metaData.roomName];
    room.memory.sources = {};
    room.memory.spawns = [];
    const process = this;

    const sources = room.find(FIND_SOURCES);
    _.forEach(sources, (source: Source) => {
      room.memory.sources[source.id] = {
        id: source.id,
        isMinedBy: {
          haulers: 0,
          miners: 0
        },
        roomName: process.metaData.roomName,
        x: source.pos.x,
        y: source.pos.y
      };
    });
    const spawns = Game.spawns;
    _.forEach(spawns, (spawn: StructureSpawn) => {
      if (spawn.room.name !== process.metaData.roomName) {
        return;
      }
      room.memory.spawns.push({
        id: spawn.id,
        roomName: process.metaData.roomName,
        spawnName: spawn.name,
        spawning: 0,
        x: spawn.pos.x,
        y: spawn.pos.y
      });
    });

    // room.memory.builders = 0;

    this.completed = true;
  }
}
