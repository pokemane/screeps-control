
declare const require: (module: string) => any;

declare interface CreepMemory {
  role: string;
  harvesting?: boolean;
  upgrading?: boolean;
  building?: boolean;
  _trav?: TravelData;
  _travel?: TravelData;
}

declare interface RoomMemory {
  sources: {[sourceId: string]: ISourceObjectInfo};
  spawns: ISpawnObjectInfo[];
  rcl?: number;
  avoid?: number;
}
