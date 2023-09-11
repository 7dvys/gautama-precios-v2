import { MatchItems } from "@/types/precios"
import { XlsxConfig } from "@/types/xlsx/types"
import { cbFetch } from "@/utils/contabiliumApi"

const parseJson = (str:string)=>{
    try{
        return JSON.parse(str);
    }catch(e){
        return false;
    }
}

const updateProducts = async ({matchItems,apiToken,xlsxConfig }:{matchItems:MatchItems,apiToken:string, xlsxConfig:XlsxConfig})=>{
    matchItems.cbProducts.forEach((product,index)=>{
        const {costo,precio,rentabilidad,final,iva} = matchItems.xlsxProducts[index]

        
        const observacionesJson = parseJson(product.Observaciones) ?? {};
        const anterior = {
            CostoInterno:product.CostoInterno,
            Precio:product.Precio,
            PrecioFinal:product.PrecioFinal,
            Rentabilidad:product.Rentabilidad,
            Iva:product.Iva,
            cotizacion:(observacionesJson.cotizacion ?? 1),
            CostoInternoDolar:(observacionesJson.costoInternoDolar ?? 0)
        };

        
        const newObservaciones = {
            idProveedor:xlsxConfig.idProveedor,
            cotizacion:xlsxConfig.cotizacion,
            CostoInternoDolar:Number(costo/xlsxConfig.cotizacion.venta).toFixed(2),
            anterior:anterior,
        }
        
        const newProduct = {...product,
            CostoInterno:costo,
            Precio:precio,
            Rentabilidad:rentabilidad,
            PrecioFinal:final,
            Iva:iva,
            Tipo:"P",
            Estado:"A",
            Observaciones:JSON.stringify(newObservaciones,null,2)
        }
        const productId = product.Id;    
        const config = {
            endpoint:`/api/conceptos/?id=${productId}`,
            method:"PUT" as "PUT",
            token:apiToken,
            body:JSON.stringify(newProduct)
        }

        // console.log(config)
        cbFetch(config)
    })


}


export {updateProducts}