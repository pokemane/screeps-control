import { KernelSG } from "os/core/Kernel";
import { ErrorMapper } from "utils/ErrorMapper";

export const loop = ErrorMapper.wrapLoop(() => {
  console.log("------------------------------------------------------------------------------------ new tick");
  const kernel = new KernelSG();
  while (kernel.stillUnderCpuLimit() && kernel.anyProcessesLeftToRun()) {
    kernel.runNextProcess();
  }
  kernel.shutdown();
});
