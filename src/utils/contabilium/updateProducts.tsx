import { Config,MatchItem, XlsxProduct } from "@/types/Precios";
import { Product } from "@/types/contabilium";
import { MutableRefObject } from "react";

const parseJson = (str:string)=>{
    try{
        return JSON.parse(str);
    }catch(e){
        return false;
    }
}

interface UpdateProductsProps{
    matchItems:MatchItem[];
    config:Config;
    serializedProducts:Record<string,Product>;
    token:string;
    // serializedXlsxItems:MutableRefObject<Record<string,XlsxProduct>>;
}


    const updateProducts = async ({matchItems,serializedProducts,config,token}:UpdateProductsProps)=>{
        const updatedPromises = matchItems.map(({codigo,descripcion,costo,rentabilidad,precio,iva,final})=>{
            // const {costo,precio,rentabilidad,final,iva} = matchItems.xlsxProducts[index]
            const cbProduct = serializedProducts[codigo]
            const {idProveedor} = config;

            const newProduct:Product = {...cbProduct,
                CostoInterno:costo,
                Precio:precio,
                Rentabilidad:rentabilidad,
                PrecioFinal:final,
                Iva:iva,
                Tipo:"P",
                Estado:"A",
                CodigoBarras:idProveedor.toString()
            }
            const {Id} = cbProduct;
            const endpoint ="https://rest.contabilium.com/api/conceptos/?id="+Id
            const fetchConfig = {
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+token,
                },
                body:JSON.stringify(newProduct)
            }

            return [fetch(endpoint,fetchConfig),codigo];
        })

        const promises = updatedPromises.map(([promise])=>(promise as Promise<Response>))

        const updates= await Promise.all(promises).then(updatesResponses=>{
            return updatesResponses.map((updateResponse,index)=>{
                const [_,codigo] = updatedPromises[index];
                return updateResponse.ok?{codigo,status:1}:{codigo,status:2};
            })
        })
        return updates as {codigo:string,status:number}[];
    }




export {updateProducts};