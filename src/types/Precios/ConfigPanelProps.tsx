import { Dispatch,SetStateAction } from "react";
import { Config } from "@/types/Precios"
import { Product, Vendor } from "@/types/contabilium";

interface ConfigPanelProps{
    config:Config;
    setConfig:Dispatch<SetStateAction<Config>>
    vendors:Vendor[];
    products:Product[]
}

export type {ConfigPanelProps};