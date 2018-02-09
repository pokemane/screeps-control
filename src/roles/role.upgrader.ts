export const roleUpgrader = {
  run(creep: Creep, source: Source) {
    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading) {
      // hey cool, controllers don't explicitly need upgradeController().  You can use transfer instead.
      if (creep.transfer(creep.room.controller as StructureController, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller as StructureController, {visualizePathStyle: {stroke: "#ffffff"}});
      }
    } else {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    }
  }
};
