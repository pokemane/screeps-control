
import { Priority } from "os/core/Constants";
import { IKernel } from "os/core/Kernel";
import { BaseProcess, ISerializedProcess } from "os/core/Process";
import JobHelper from "os/libs/JobHelper";
import { JobProviderProcess } from "os/processes/JobProviderProcess";
import { RoomManagerProcess } from "os/processes/room/RoomControllerProcess";

export class RoomEnergyManager extends BaseProcess {
  protected metaData: IMetaData["roomEnergyManager"];
  public type = "roomEnergyManager";
  constructor(entry: ISerializedProcess, kernel: IKernel) {
    super(entry, kernel);
    this.metaData = entry.metadata as IMetaData["roomEnergyManager"];
  }
  public run(): void {
    /*
     * find sources without harvesters,
     * enqueue spawn command for each empty harvesting "slot"
     */

    /*
     * Somehow find number of required haulers.
     * Start by only using haulers when there are source-containers to pick from,
     * or resources dropped on the ground.
     * Start with 1 or 2 per source-container set.
     */
    const myController = this.parent as RoomManagerProcess;
    const src: ISourceObjectInfo = {
      x: 30,
      y: 21,
      roomName: "W8N3",
      id: "26f20772347f879",
      isMinedBy: {
        haulers: 0,
        miners: 0
      }
    };
    const drop: IBasicObjectInfo = {
      x: 29,
      y: 26,
      roomName: "W8N3",
      id: "5a964c6d6e5b04630fb114fa"
    };
    const newjob = JobHelper.createHarvestJob(this.name, "harvest", Priority.HIGH, src, drop);
    if (!myController.hasJobCount(newjob)) {
      myController.addJob(newjob);
    } else {
      // myController.getHighestPriorityJob("harvest");
    }

    // TODO: when a creep goes to harvest from a Source, have it "reserve" the Source.
    // Should probably do this as soon as the creep notices that it's trying to move toward the Source.
    /* Reserve:
    *   Adds a "TTL" value to the Source (e.g. 40 per creep/job).  Energy Manager decrements this per tick.
    *   Energy Manager targets a certain "life level" of the Source and pushes more/fewer jobs depending on level.
    * Unreserve:
    *   Removes same "TTL" value from Source counter.  Energy Manager still decrements this counter.
    *   Unreserving a Source increases the "queue pressure" on the harvesting tasks.
    */

  }

  private getAvailableSource(): ISourceObjectInfo {
    throw new Error("RoomEnergyManager.getAvailableSource() not yet implemented");
  }

  /**
   * Un-reserve harvesting slot at given source.
   * To be called by Creep child-processes
   *
   * @param {SourceObjectInfo} source
   * @memberof RoomEnergyManager
   */
  public unreserveHarvestSlot(source: ISourceObjectInfo) {
    // todo decrement number of harvesters working on an energy source
  }

  /**
   * Reserve harvesting slot at given source.
   * To be called by Creep child-processes
   *
   * @param {SourceObjectInfo} source
   * @memberof RoomEnergyManager
   */
  public reserveHarvestSlot(source: ISourceObjectInfo) {
    // todo increment number of harvesters working on an energy source
  }

}
