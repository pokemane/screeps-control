/**
 * harvester role
 */
export const roleHarvester = {
  /**
   * makes a creep act like a harvester
   * @param creep creep to use as a harvester
   * @param source primary source for the harvester
   */
  run(creep: Creep, source: Source) {
    if (!creep.memory.harvesting && creep.carry.energy === 0) {
    creep.memory.harvesting = true;
    creep.say("🔄 harvest");
    }
    if (creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
      creep.memory.harvesting = false;
      creep.say("unload");
    }
    if (creep.memory.harvesting) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: {stroke: "#ffaa00"}
        });
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return ((structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity)
                || (structure.structureType === STRUCTURE_CONTAINER &&
                    _.sum(structure.store) < structure.storeCapacity);
          }
      });
      if (targets.length) {
        const droptarget = _.min(targets, (structure) => {
          if (structure.structureType === STRUCTURE_SPAWN) {
            return -1;
          } else if (structure.structureType === STRUCTURE_CONTAINER) {
            return 1;
          } else {
            return 0;
          }
          });

        if (creep.transfer(droptarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(droptarget, {visualizePathStyle: {stroke: "#ffaa00"}});
        }
      } else {
        // no targets to dump energy into
        const FLAG_IDLE = "idle";
        creep.moveTo(Game.flags[FLAG_IDLE].pos, {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    }
  }
};
