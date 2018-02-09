
declare enum ProcessType {
  init = "init",
  memoryManager = "memoryManager",
}

interface SerializedProcess {
  name: String;
  priority: number;
  metadata: object;
  suspend: boolean;
  parent: string | undefined;
}

// object information interfaces

interface RoomMetaData {
  roomName: string;
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

