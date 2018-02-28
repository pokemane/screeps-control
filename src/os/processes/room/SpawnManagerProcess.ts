
import { IKernel } from "os/core/Kernel";
import { BaseProcess, ISerializedProcess } from "os/core/Process";

export class SpawnManagerProcess extends BaseProcess {
  protected metaData: IMetaData["roomSpawnManager"];
  public type = "roomSpawnManager";

  constructor(entry: ISerializedProcess, kernel: IKernel) {
    super(entry, kernel);
    this.metaData = entry.metadata as IMetaData["roomSpawnManager"];
  }

  public run(): void {
    throw new Error("Method not implemented.");
  }
}
