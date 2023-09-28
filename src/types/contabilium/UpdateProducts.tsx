import { Vendor } from ".";
import { Config, MatchItems, SerializedProducts } from "../Precios";

export interface UpdateProductsProps{
    matchItems:MatchItems;
    config:Config;
    serializedProducts:SerializedProducts;
    vendors:Vendor[]
    // serializedXlsxItems:MutableRefObject<Record<string,XlsxProduct>>;
}

export type UpdateProducts = ({ matchItems, serializedProducts, config, vendors }: UpdateProductsProps) =>  Promise<{
    codigo: string;
    status: number;
    table:'main'|'secondary';
}[]>