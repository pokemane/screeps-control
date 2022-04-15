import { BaseProcess } from "os/core/Process";

export interface ICreepLifecycle {

}

export abstract class CreepLifecycle extends BaseProcess {
  protected abstract myJob: IBasicJob | undefined;

}
