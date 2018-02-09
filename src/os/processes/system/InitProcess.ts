import { Priority, SCRIPT_VERSION } from "os/core/Constants";
import { Process } from "os/core/Process";

export class InitProcess extends Process {
  public metaData: any;
  public type = ProcessType.init;

  public run() {
    // todo
  }
}
