
import { IKernel } from "os/core/Kernel";
import { BaseProcess, IProcess, ISerializedProcess } from "os/core/Process";

export interface IJobProvider {
  getHighestPriorityJob(type: JobTypes): IBasicJob | boolean;
  getJobFromRoles(roles: JobTypes[]): IBasicJob | boolean;
  addJob<J extends IBasicJob>(job: J): void;
  hasJobCount<J extends IBasicJob>(job: J): number;
  numTotalJobs(): number;
  // TODO: maybe use deep-equal to check for duplicate jobs?
  // lodash: _.filter(queue, _.matches(jobToCheckIfDupe));
}

/**
 * Class template for a Job Provider.
 * Supplies jobs to creeps on request, and enqueues more of them by request.
 * Stores jobs by type, sorted by priority.
 *
 * @export
 * @abstract
 * @class JobProviderProcess
 * @extends {BaseProcess}
 * @implements {IJobProvider}
 */
export abstract class JobProviderProcess extends BaseProcess implements IJobProvider {

  protected jobQueues: { [type in JobTypes]?: IBasicJob[] } = {};

  constructor(entry: ISerializedProcess, kernel: IKernel) {
    super(entry, kernel);
    this.loadJobTable();
  }

  /**
   * Gets highest priority job of supplied type.  Returns `false` if no job exists.
   *
   * @param {JobTypes} type
   * @returns {(IBasicJob | boolean)}
   * @memberof JobProviderProcess
   */
  public getHighestPriorityJob(type: JobTypes): IBasicJob | boolean {
    if (this.jobQueues[type] === undefined) { return false; }
    if (this.jobQueues[type]!.length < 1) { return false; } // no jobs, TODO: ask for some from other rooms or global
    return this.jobQueues[type]!.shift()!;
  }
/**
 * get a random job from the given list of job queues
 *
 * @param {JobTypes[]} roles
 * @returns {(boolean | IBasicJob)}
 * @memberof JobProviderProcess
 */
public getJobFromRoles(roles: JobTypes[]): boolean | IBasicJob {
    let result: IBasicJob | boolean = false;
    let count: number = 0;
    _.forEach(roles, (role) => {
      if (this.jobQueues[role] !== undefined) {
        if (Math.random() < 1 / ++count) {
          result = this.getHighestPriorityJob(role);
        }
      }
    });
    return result;
  }

  /**
   * Presorted insert of specified job into correct queue based on job type
   *
   * @template J extends IBasicJob
   * @param {J} job
   * @memberof JobProviderProcess
   */
  public addJob<J extends IBasicJob>(job: J): void {
    if (this.jobQueues[job.type] === undefined) {
      this.jobQueues[job.type] = [];
    }
    this.jobQueues[job.type]!.splice(_.findLastIndex(this.jobQueues[job.type]!, job.priority), 0, job);
  }

  /**
   * Counts the number of identical jobs already in the queue.
   * Will return 0 if the queue doesn't exist
   *
   * @template J extends IBasicJob
   * @param {J} job
   * @returns {(boolean | number)}
   * @memberof JobProviderProcess
   */
  public hasJobCount<J extends IBasicJob>(job: J): number {
    if (this.jobQueues[job.type] === undefined) { return 0; }
    return _.filter(this.jobQueues[job.type]!, _.matches(job)).length;
  }

  public numTotalJobs(): number {
    let numJobs: number = 0;
    _.forIn(this.jobQueues, (queue, key) => {
      _.forIn(queue!, (element, type) => {
        ++numJobs;
      });
    });
    return numJobs;
  }

  protected loadJobTable(): void {
    this.jobQueues = this.metaData.jobQueues as { [type in JobTypes]: IBasicJob[] };
    _.forIn(this.jobQueues, (queue, key) => {
      if (key === undefined || queue === undefined) { return; }
      queue = _.sortBy(queue!, "priority").reverse();
    });
  }

  public serialize(): ISerializedProcess {
    this.metaData.jobQueues = this.jobQueues;
    return super.serialize();
  }
}
