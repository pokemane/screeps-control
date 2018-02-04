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
        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: "#ffaa00"}});
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: "#ffaa00"}});
                }
            }
        }
    }
};
