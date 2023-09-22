import { Config, Products } from "@/types/Precios";
import { UpdateProducts, Vendor } from "@/types/contabilium";

export interface MatchTableProps{
    products:Products,
    config:Config,
    vendors:Vendor[]
    updateProducts:UpdateProducts|null;
}