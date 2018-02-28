
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
