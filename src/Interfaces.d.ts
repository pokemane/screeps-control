type ProcessTypes =
  "init"
  | "memoryManager"
  | "statsManager"
  | "suspension"
  | "roomManager"
  | "roomEnergyManager"
  | "roomSpawnManager"
//  | "roomConstructionManager"
  | "roomStaticDataManager"
//  | "roomDefenseManager"
;

type CreepRoles =
  "civilian"
  | "upgrader"
  | "militia";

type JobTypes =
  "harvest"
  | "haul"
  | "build"
  | "upgrade";

type JobActions =
  "harvest"
  | "build"
  | "pickup"
  | "dropoff"
  | "upgrade"
  | "move";

// object information interfaces

// basic room meta data
interface IRoomMetaData {
  roomName: string;
}

interface IRoomManager extends IRoomMetaData {
  roomDataSet: boolean;
}

interface IRoomEnergyManager extends IRoomMetaData {
  sources: ISourceObjectInfo[];
}

interface ICreepMetaData {
  creepName: string;
}

interface IBasicObjectInfo {
  x: number;
  y: number;
  roomName: string;
  id: string;
}

interface IBasicJob {
  // maybe a TTL for bumping up the priority?
  requester: string;
  type: JobTypes;
  priority: number;
  steps: IBasicJobStep[];
  repeat?: number | boolean;
}

interface IBasicJobStep {
  action: JobActions;
  target: IBasicObjectInfo;
}

interface IJobProviderProcess {
  jobQueues: { [type in JobTypes]?: IBasicJob[] };
}

// extends BasicObjectInfo
interface ISpawnObjectInfo extends IBasicObjectInfo {
  spawning: number;
  spawnName: string;
}

interface ISourceObjectInfo extends IBasicObjectInfo {
  isMinedBy: {
    miners: number;
    haulers: number;
  };
}

interface ICreepSpawnQueue {
  spawnQueue: ICreepToSpawn[];
}

interface ICreepToSpawn {
  type: string;
  processToCreate: ProcessTypes;
  parentProcess?: string;
  priority: number;
  creepMeta?: any;
}

interface ITargetMetaData {
  target: IBasicObjectInfo;
}

interface IDropoffMetaData {
  dropoff: IBasicObjectInfo;
}

interface ICreepBuildSpec {
  base: BodyPartConstant[];
  extension?: BodyPartConstant[];
  maxExtensionCount?: number;
}

interface ICreepTypes {
  [name: string]: ICreepBuildSpec;
}

interface IMoveMetaData extends IRoomMetaData, ITargetMetaData, ICreepMetaData {
  path: string;
  previousX: number;
  previousY: number;
  stuck: number;
  range: number | undefined;
}

interface INextAction {
  nextAction: string;
}

interface IMetaData {
  roomManager: IRoomManager & IJobProviderProcess;
  roomStaticDataManager: IRoomMetaData;
  roomEnergyManager: IRoomEnergyManager;
  roomConstructionManager: IRoomMetaData;
  roomSpawnManager: IRoomMetaData;

  haulerLifeCycle: IRoomMetaData & ITargetMetaData & IDropoffMetaData & ICreepMetaData & INextAction;
  harvesterLifeCycle: IRoomMetaData & ITargetMetaData & IDropoffMetaData & ICreepMetaData & INextAction;
  builderLifeCycle: IRoomMetaData & ITargetMetaData & ICreepMetaData & INextAction;

  move: IMoveMetaData;
  harvest: IRoomMetaData & ITargetMetaData & ICreepMetaData;

  foo: {};
}
