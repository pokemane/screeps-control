import { BaseProcess } from "os/core/Process";

export abstract class CreepActionProcess extends BaseProcess {
/**
 * marks current creep task as complete.
 * optionally resumes the parent
 * @protected
 * @param {boolean} [resumeParent=true]
 * @memberof CreepActionProcess
 */
protected markCompleted(resumeParent: boolean = true) {
    this.completed = true;
    if (resumeParent) { this.resumeParent(); }
  }
}
