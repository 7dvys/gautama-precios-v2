import { Config, MatchItems, SerializedProducts } from "../Precios";

export interface UpdateProductsProps{
    matchItems:MatchItems;
    config:Config;
    serializedProducts:SerializedProducts;
    // serializedXlsxItems:MutableRefObject<Record<string,XlsxProduct>>;
}
export type UpdateProducts = ({ matchItems, serializedProducts, config }: UpdateProductsProps) => Promise<void>