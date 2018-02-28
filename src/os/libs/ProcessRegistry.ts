import { BaseProcess, IProcess } from "os/core/Process";
import { InitProcess } from "os/processes/system/InitProcess";

type IProcessTable = {
  [type in ProcessTypes]: any;
};
