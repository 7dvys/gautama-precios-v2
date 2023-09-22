import { Product } from "../contabilium";

export type SerializedProduct = Record<string,Product>;
export type SerializedProducts = {main:Record<string,Product>,secondary:Record<string,Product>};