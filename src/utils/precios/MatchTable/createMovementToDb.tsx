import { Config, MatchItem } from "@/types/Precios";
import { Product, Vendor } from "@/types/contabilium";
import { Movement } from "@/types/movimientos";

interface CreateMovementToDbProps{
    matchItems:{main:MatchItem[],secondary:MatchItem[]};
    vendors:Vendor[]
    serializedProducts:{main:Record<string,Product>,secondary:Record<string,Product>};
    config:Config;
}
const createMovementToDb = ({matchItems,vendors,config,serializedProducts}:CreateMovementToDbProps)=>{
    const [main,secondary] = Object.entries(matchItems).map(([table,tableMatchItems])=>(  
        tableMatchItems.map(({codigo})=>{
            return serializedProducts[(table as 'main'|'secondary')][codigo];
        })
    ))

    const products = {main,secondary};

    const vendor = vendors.filter(({Id})=>(Id==config.idProveedor))[0];

    const movimiento:Movement = {
        vendorId:config.idProveedor,
        vendorName:vendor.NombreFantasia.length?vendor.NombreFantasia:vendor.RazonSocial,
        fuente:'precios',
        fecha:new Date(),
        detalles:{products,matchItems,config}
    }

    return {movimiento};
}

export {createMovementToDb};