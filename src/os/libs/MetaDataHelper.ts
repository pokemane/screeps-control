
export default class MetaDataHelper {
  public static getBasicObjInfo(id: string, pos: RoomPosition): IBasicObjectInfo {
    return {
      x: pos.x,
      y: pos.y,
      roomName: pos.roomName,
      id
    };
  }

  public static getSpawnObjectInfo(spawn: StructureSpawn): ISpawnObjectInfo {
    return {
      x: spawn.pos.x,
      y: spawn.pos.y,
      id: spawn.id,
      roomName: spawn.pos.roomName,
      spawning: spawn.spawning === null ? NaN : spawn.spawning.remainingTime,
      spawnName: spawn.name
    };
  }

  public static getSourceObjectInfo(src: Source): ISourceObjectInfo {
    return src.room.memory.sources[src.id];
  }

}
