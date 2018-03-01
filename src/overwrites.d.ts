
declare const require: (module: string) => any;

declare interface CreepMemory {
  roles: JobTypes[];
  job?: IBasicJob;
  idleTicks?: number;
}

declare interface RoomMemory {
  sources: {[sourceId: string]: ISourceObjectInfo};
  spawns: ISpawnObjectInfo[];
  rcl?: number;
  avoid?: number;
}
