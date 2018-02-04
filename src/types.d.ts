// type shim for nodejs' `require()` syntax
declare const require: (module: string) => any;
interface CreepMemory {
    role: string
    harvesting?: boolean
    upgrading?: boolean
    building?: boolean
}
