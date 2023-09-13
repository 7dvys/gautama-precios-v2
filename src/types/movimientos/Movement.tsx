import { Config, MatchItem } from "../Precios";
import { Product } from "../contabilium";

interface DetallesPrecios{
    matchItems:MatchItem[];
    config:Config;
    products:Product[];
}

interface Movement{
    id?:number;
    vendorId:number;
    vendorName:string;
    fuente:'precios'|'imap'|'pedidos';
    detalles:DetallesPrecios;
    fecha:Date;
}

export type {Movement};