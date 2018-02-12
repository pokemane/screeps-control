
declare enum ProcessType {
  init = "init",
  memoryManager = "memoryManager",
  statsManager = "statsManager",
}

declare enum LogMsgType {
  info,
  trace,
  debug,
  warn,
  error
}

interface SerializedProcess {
  name: string;
  priority: number;
  metadata: object;
  suspend: boolean;
  parent: string | undefined;
}

// object information interfaces

// basic room meta data
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

interface SysLogItem {
  processName: string;
  message: string;
  msgType: LogMsgType;
  cpu: number;
}
