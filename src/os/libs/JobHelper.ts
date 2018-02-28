
import { Priority } from "os/core/Constants";

export default class JobHelper {
  public static createJob(requester: string, type: JobTypes, priority: Priority, steps: IBasicJobStep[]): IBasicJob {
    return {
      priority,
      requester,
      steps,
      type
    } as IBasicJob;
  }
  public static createHaulJobSteps(source: IBasicObjectInfo, target: IBasicObjectInfo): IBasicJobStep[] {
    const step1: IBasicJobStep = {
      action: "pickup",
      target: source
    };
    const step2: IBasicJobStep = {
      action: "dropoff",
      target
    };
    return [step1, step2];
  }

  public static createHarvestJob(requester: string, type: JobTypes, priority: Priority,
                                 source: IBasicObjectInfo, dropTarget: IBasicObjectInfo): IBasicJob {
    const step1: IBasicJobStep = {
      action: "harvest",
      target: source
    };
    const step2: IBasicJobStep = {
      action: "dropoff",
      target: dropTarget
    };
    return this.createJob(requester, type, priority, [step1, step2]);
  }
}
