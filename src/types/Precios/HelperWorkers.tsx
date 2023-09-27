import { Config } from ".";

type ConfigOpcional = {
    [K in keyof Config]?: Config[K];
  };
export type HelperWorkers = Record<number,[
    name:string, //nombre del helper
    explicacion:string, //Explicacion del helper
    newConfig:ConfigOpcional //Si el helper crea o requiere una configuracion especifica este lo definira 

][]>