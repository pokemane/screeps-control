import { Kernel } from "os/core/Kernel";
import { Process } from "os/core/Process";

export class RoomEnergyManager extends Process {
  public metaData: any;
  public type = "roomEnergyManager";
  constructor(entry: SerializedProcess, kernel: Kernel) {
    super(entry, kernel);
    // TS is throwing me a "Property has no initializer and is not definitely assigned in the constructor."
    // when I don't do this explicitly in the constructor.  For subclasses of Process,
    // this ends up being a re-assignment.  Unsure of impact.
    // The reason I need to do the assignment/typing in the first place is because
    // I want TS to help me out with metadata contents and typings.
    // TODO: figure out if this is an issue, and how to fix it!
    this.metaData = entry.metadata as MetaData["roomEnergyManager"];
  }
  public run(): void {
    throw new Error("Method not implemented.");
  }
}
