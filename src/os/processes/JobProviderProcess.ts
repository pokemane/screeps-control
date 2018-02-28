
import { IKernel } from "os/core/Kernel";
import { BaseProcess, IProcess, ISerializedProcess } from "os/core/Process";

export interface IJobProvider {
  getHighestPriorityJob(type: JobTypes): IBasicJob | boolean;
  addJob<J extends IBasicJob>(job: J): void;
  hasJobCount<J extends IBasicJob>(job: J): boolean | number;
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
   * Returns `false` if no identical jobs exist in this provider.
   *
   * @template J extends IBasicJob
   * @param {J} job
   * @returns {(boolean | number)}
   * @memberof JobProviderProcess
   */
  public hasJobCount<J extends IBasicJob>(job: J): boolean | number {
    if (this.jobQueues[job.type] === undefined) { return false; }
    return _.filter(this.jobQueues[job.type]!, _.matches(job)).length;
  }

  protected loadJobTable(): void {
    this.jobQueues = this.metaData.jobQueues as { [type in JobTypes]: IBasicJob[] };
    _.forIn(this.jobQueues, (queue, key) => {
      if (key === undefined || queue === undefined) { return; }
      queue = _.sortBy(queue!, "priority").reverse();
    });
  }

  public serialize(): ISerializedProcess {
    this.metaData.jobQueue = this.jobQueues;
    return super.serialize();
  }
}
