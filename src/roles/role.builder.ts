import { roleUpgrader } from "../roles/role.upgrader";
export const roleBuilder = {
    run(creep: Creep) {
        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say("🔄 harvest");
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say("🚧 build");
        }

        if (creep.memory.building) {
            const buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            const brokenstuff =
                creep.pos.findClosestByPath(FIND_STRUCTURES,
                    {filter: (structure) => structure.hits < structure.hitsMax});
            if (buildTargets.length) {
                if (creep.build(buildTargets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[0], {visualizePathStyle: {stroke: "#ffffff"}});
                }
            } else {
                // no targets to build
                const SOURCE2 = Game.getObjectById("59f1a57582100e1594f3e911") as Source;
                roleUpgrader.run(creep, SOURCE2);
            }
        } else { // grab energy from somewhere
            const gatherTargets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return ((structure.structureType === STRUCTURE_EXTENSION) && structure.energy > 0)
                        || (structure.structureType === STRUCTURE_CONTAINER &&
                            _.sum(structure.store) > 0);
                }
            });
            if (gatherTargets.length) {
                // console.log(`${creep.name} found targets to gather from`);
                gatherTargets.sort((a, b) => {
                    if (a.structureType === STRUCTURE_SPAWN) {
                        return 1;
                    } else {
                        if (a.structureType === STRUCTURE_CONTAINER) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                });
            }
            if (gatherTargets.length) {
                const target = gatherTargets[0];
                creep.room.visual.circle(target.pos.x, target.pos.y);
                if (!(creep.pos.isNearTo(target))) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: "#ffffff"}});
                } else {
                    creep.withdraw(target, RESOURCE_ENERGY);
                }
            }
        }
    }
};
