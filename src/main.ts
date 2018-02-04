import { roleBuilder } from "roles/role.builder";
import { roleHarvester } from "roles/role.harvester";
import { roleUpgrader } from "roles/role.upgrader";
import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  if (Game.time % 20 === 0) {
    console.log(`Current game tick is ${Game.time}`);
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === "upgrader");
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === "builder");
  const SPAWN_NAME = "Spawn1";
  const BASIC_BODY = [WORK, CARRY, MOVE];

  if  (Game.spawns[SPAWN_NAME].spawnCreep(BASIC_BODY, "foo", {dryRun: true}) === OK) {
    if (harvesters.length < 1) {
      const newName = "harv" + Game.time;
      console.log("spawning new harvester");
      Game.spawns[SPAWN_NAME].spawnCreep(BASIC_BODY, newName, {memory: {role: "harvester"} as CreepMemory});
    }
    if (upgraders.length < 2) {
      const newName = "upgrade" + Game.time;
      console.log("spawning new upgrader");
      Game.spawns[SPAWN_NAME].spawnCreep(BASIC_BODY, newName, {memory : {role: "upgrader"} as CreepMemory});
    }
    if (builders.length < 2) {
      const newName = "build" + Game.time;
      console.log("spawning new builder");
      Game.spawns[SPAWN_NAME].spawnCreep(BASIC_BODY, newName, {memory : {role: "builder"} as CreepMemory});
    }
  }

  for (const name in Game.creeps) {
    // go through all the creeps and decide what to do with them depending on role
    const HARVESTER = "harvester";
    const UPGRADER = "upgrader";
    const BUILDER = "builder";
    const SOURCE1 = Game.getObjectById("59f1a57582100e1594f3e912") as Source;
    const creep = Game.creeps[name];

    if (creep.memory.role === HARVESTER) {
      roleHarvester.run(creep, SOURCE1);
    }
    if (creep.memory.role === UPGRADER) {
        roleUpgrader.run(creep, SOURCE1);
    }
    if (creep.memory.role === BUILDER) {
        roleBuilder.run(creep, SOURCE1);
    }
  }
});
