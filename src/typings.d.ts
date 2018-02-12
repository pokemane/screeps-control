type ProcessTypes =
  "init"
  | "memoryManager"
  | "statsManager"
  | "suspension"
  | "roomManager"
  | "roomEnergyManager"
  | "roomSpawnManager"
  | "roomConstructionManager"
  | "roomStaticDataManager"
  | "roomDefenseManager";

interface SerializedProcess {
  name: string;
  priority: number;
  metadata: object;
  suspend: boolean | number | string;
  parent: string;
}

// object information interfaces

// basic room meta data
interface RoomMetaData {
  roomName: string;
}

interface RoomManager extends RoomMetaData {
  roomDataSet: boolean;
}

interface CreepMetaData {
  creepName: string;
}

interface BasicObjectInfo {
  x: number;
  y: number;
  roomName: string;
  id: string;
}

// extends BasicObjectInfo
interface SpawnObjectInfo extends BasicObjectInfo {
  spawning: number;
  spawnName: string;
}

interface SourceObjectInfo extends BasicObjectInfo {
  isMinedBy: {
    miners: number;
    haulers: number;
  }
}

interface TargetMetaData {
  target: BasicObjectInfo;
}

interface DropoffMetaData {
  dropoff: BasicObjectInfo;
}

interface CreepBase {
  base: BodyPartConstant[];
  baseCost: number;
  extension?: BodyPartConstant[];
  extensionCost?: number;
  maxExtensionCount?: number;
}

interface MetaData {
  roomManager: RoomManager;
  staticRoomData: RoomMetaData;
  roomEnergyManager: RoomMetaData;
}
