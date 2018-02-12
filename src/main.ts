import { roleBuilder } from "roles/role.builder";
import { roleHarvester } from "roles/role.harvester";
import { roleUpgrader } from "roles/role.upgrader";
import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  if (Game.time % 20 === 0) {
    // console.log(`Current game tick is ${Game.time}`);
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  const SPAWN_NAME = "Spawn1";

  const towers = Game.spawns[SPAWN_NAME].room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_TOWER
  }) as StructureTower[];

  _.forEach(towers, (tower) => {
    if (tower) {
      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
      });
      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      }
    }
  });

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === "upgrader");
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === "builder");

  const BASIC_BODY = [WORK, CARRY, MOVE];

  function basicBody(spawn: StructureSpawn): BodyPartConstant[] {
    let numBlocks = Math.floor(spawn.room.energyAvailable / 200); // cost of work/carry/move
    const body = new Array<BodyPartConstant>();
    while (numBlocks-- > 0) {
      body.push(...BASIC_BODY);
    }
    return body;
  }

  const creepBody = basicBody(Game.spawns[SPAWN_NAME]);
  if  (Game.spawns[SPAWN_NAME].spawnCreep(creepBody, "foo", {dryRun: true}) === OK) {
    if (harvesters.length < 4) {
      const newName = "harv" + Game.time;
      console.log("spawning new harvester");
      Game.spawns[SPAWN_NAME].spawnCreep(creepBody, newName, {memory: {role: "harvester"} as CreepMemory});
    } else if (upgraders.length < 1) {
      const newName = "upgrade" + Game.time;
      console.log("spawning new upgrader");
      Game.spawns[SPAWN_NAME].spawnCreep([WORK, CARRY, MOVE], newName, {memory : {role: "upgrader"} as CreepMemory});
    } else if (builders.length < 2) {
      const newName = "build" + Game.time;
      console.log("spawning new builder");
      Game.spawns[SPAWN_NAME].spawnCreep(creepBody, newName, {memory : {role: "builder"} as CreepMemory});
    }
  }

  const sources = Game.spawns[SPAWN_NAME].room.find(FIND_SOURCES_ACTIVE) as Source[];
  const targsource = _.min(sources, (source) => {
    return source.pos.getRangeTo(Game.spawns[SPAWN_NAME]);
  });
  const SOURCE1 = targsource;
  const controller = Game.spawns[SPAWN_NAME].room.controller as StructureController;
  const SOURCE2 = controller.pos.findClosestByRange(FIND_SOURCES) as Source;
  for (const name in Game.creeps) {
    // go through all the creeps and decide what to do with them depending on role
    const HARVESTER = "harvester";
    const UPGRADER = "upgrader";
    const BUILDER = "builder";

    const creep = Game.creeps[name];

    if (creep.memory.role === HARVESTER) {
      roleHarvester.run(creep, SOURCE1);
    }
    if (creep.memory.role === UPGRADER) {
      roleUpgrader.run(creep, SOURCE2);
    }
    if (creep.memory.role === BUILDER) {
      roleBuilder.run(creep);
    }
  }

  // console.log(`cpu used this tick: ${Game.cpu.getUsed()}`);
  // console.log(`bucket: ${Game.cpu.bucket}`);

  // ---------------------- stats stuff
  if (!Memory.stats) { Memory.stats = {}; }
  if (!Memory.stats.rooms) { Memory.stats.rooms = {}; }

  if (Game.time % 5 === 0) {
    Memory.stats.cpuUsed = Game.cpu.getUsed();
    Memory.stats.cpuLimit = Game.cpu.limit;
    Memory.stats.cpuBucket = Game.cpu.bucket;
    Memory.stats.gclLevel = Game.gcl.level;
    Memory.stats.gclProgress = Game.gcl.progress;
    Memory.stats.gclProgressTotal = Game.gcl.progressTotal;

    _.forEach(Object.keys(Game.rooms), (roomName) => {
      // tslint:disable-next-line:max-line-length
      if (_.isNull(Memory.stats.rooms[roomName]) || _.isUndefined(Memory.stats.rooms[roomName])) { Memory.stats.rooms[roomName] = {}; }
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        Memory.stats.rooms[roomName].rclLevel = room.controller.level;
        Memory.stats.rooms[roomName].rclProgress = room.controller.progress;
        Memory.stats.rooms[roomName].rclProgressTotal = room.controller.progressTotal;
        Memory.stats.rooms[roomName].spawnEnergy = room.energyAvailable;
        Memory.stats.rooms[roomName].spawnEnergyTotal = room.energyCapacityAvailable;
        if (room.storage) {
          Memory.stats.rooms[roomName].storageEnergy = room.storage.store.energy;
        }
      }
    });
  }
});
