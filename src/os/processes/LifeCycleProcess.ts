import { BaseProcess } from "os/core/Process";
import { Priority } from "../core/Constants";

export abstract class LifeCycleProcess extends BaseProcess {
/**
 *
 *
 * @param {BasicObjectInfo} target
 * @param {number} [range=1]
 * @memberof LifeCycleProcess
 */
public switchToMoveProcess(target: BasicObjectInfo, range = 1) {
    this.spawnChildProcess(
      "move",
      "move-" + this.metaData.creepName,
      Priority.MEDIUM,
      {
        creepName: this.metaData.creepName,
        range,
        roomName: this.metaData.roomName,
        target
      },
      true
    );
  }

  public switchToHarvestProcess() {
    this.spawnChildProcess(
      "harvest",
      "harvest-" + this.metaData.creepName,
      Priority.MEDIUM,
      {
        creepName: this.metaData.creepName,
        roomName: this.metaData.roomName,
        target: this.metaData.target
      },
      true
    );
  }

/**
 *
 *
 * @param {BasicObjectInfo} target
 * @memberof LifeCycleProcess
 */
public switchToDropoffProcess(target: BasicObjectInfo) {
    this.spawnChildProcess(
      "dropoff",
      "dropoff-" + this.metaData.creepName,
      Priority.MEDIUM,
      {
        creepName: this.metaData.creepName,
        dropOff: this.metaData.dropOff,
        roomName: this.metaData.roomName
      },
      true
    );
  }

/**
 *
 *
 * @memberof LifeCycleProcess
 */
public switchToUpgradeProcess() {
    this.spawnChildProcess(
      "upgrade",
      "upgrade-" + this.metaData.creepName,
      Priority.MEDIUM,
      {
        creepName: this.metaData.creepName,
        roomName: this.metaData.roomName
      },
      true
    );
  }

/**
 *
 *
 * @param {BasicObjectInfo} target
 * @memberof LifeCycleProcess
 */
public switchToBuildProcess(target: BasicObjectInfo) {
    this.spawnChildProcess(
      "build",
      "build-" + this.metaData.creepName,
      Priority.MEDIUM,
      {
        creepName: this.metaData.creepName,
        roomName: this.metaData.roomName,
        target
      }
    );
  }

}
