import { LogLevel, SCRIPT_VERSION } from "os/core/Constants";
import { BaseProcess } from "os/core/Process";

export class StatsManagerProcess extends BaseProcess {
  public metaData: any;
  public type: string = "statsManager";
    public run() {
        // ---------------------- stats stuff
      if (!Memory.stats) { Memory.stats = {}; }
      if (!Memory.stats.rooms) { Memory.stats.rooms = {}; }

      // todo: put the number of running processes and stuff in here.
      //        This really isn't the best way to get ALL stats;
      //        might want to consider having a system-level stats object
      //        that each process can add to.

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
      this.suspend = 2;
    }
}
