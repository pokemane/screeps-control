import { Process } from "os/core/Process";
import { LogMsgType } from "../../core/Constants";

export class SuspensionProcess extends Process {
  public metaData: any;
  public type = "suspension";
  public run() {
    const kernel = this.kernel;
    const processes = _.filter(kernel.processTable, (proc: Process) => {
      return (!proc.suspend === false) && (!proc.completed);
      // !proc.suspend because suspend can also be string or num for blocker or ticks
    });

    _.forEach(processes, (proc: Process) => {
      proc.hasAlreadyRun = true;

      if (typeof proc.suspend === "number") {
        proc.suspend--;
        if (proc.suspend === 0) {
          proc.resumeProcess();
        }
      } else if (typeof proc.suspend === "string") {
        if (!kernel.hasProcess(proc.suspend)) {
          proc.resumeProcess();
        }
      }
    });
  }
}
