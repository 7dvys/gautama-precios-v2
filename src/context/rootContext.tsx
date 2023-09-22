import { Login, Product, UpdateProducts, Vendor } from "@/types/contabilium";
import { Dispatch, SetStateAction, createContext,MutableRefObject } from "react";
import { LoginProps } from "@/types/contabilium";
import { Config, MatchItem, MatchItems, Products, SerializedProducts } from "@/types/Precios";

interface RootContext{
    // Products:Product[];
    // setProducts:Dispatch<SetStateAction<Product[]>>
    // setVendors:Dispatch<SetStateAction<Vendor[]>>
    // vendors:Vendor[];
    login: Login;
    vendors: Vendor[];
    products: Products;
    updateProducts:UpdateProducts|null;
}

const rootContext = createContext({} as RootContext);

export {rootContext};