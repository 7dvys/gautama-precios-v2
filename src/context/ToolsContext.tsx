import { Product, Vendor } from "@/types/contabilium";
import { Dispatch, SetStateAction, createContext,MutableRefObject } from "react";

interface ToolsContext{
    // Products:Product[];
    // setProducts:Dispatch<SetStateAction<Product[]>>
    // setVendors:Dispatch<SetStateAction<Vendor[]>>
    vendors:Vendor[];
    token:string;
}

const toolsContext = createContext({} as ToolsContext);

export {toolsContext};