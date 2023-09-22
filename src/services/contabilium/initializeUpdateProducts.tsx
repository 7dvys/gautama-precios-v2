import { Config,MatchItem, XlsxProduct } from "@/types/Precios";
import { Product,Token, UpdateProducts } from "@/types/contabilium";
const parseJson = (str:string)=>{
    try{
        return JSON.parse(str);
    }catch(e){
        return false;
    }
}



    const initializeUpdateProducts = ({token}:{token:Token})=>{
        const updateProducts:UpdateProducts = async ({matchItems,serializedProducts,config})=>{
            Object.entries(matchItems).forEach(([table,tableMatchItems])=>{
                tableMatchItems.forEach(({codigo,costo,rentabilidad,precio,iva,final})=>{
                    // const {costo,precio,rentabilidad,final,iva} = matchItems.xlsxProducts[index]
                    const cbProduct = serializedProducts[(table as 'main'|'secondary')][codigo]
                    const {idProveedor} = config;
                    const {Id,Tipo,Estado} = cbProduct;
                    const estado = Estado == 'Activo'?'A':'I';
                    const tipo = Tipo=='Producto'?'P':'C';

                    const newObservaciones = `ultima actualizacion:${new Date()}`

                    const newProduct:Product = {...cbProduct,
                        CostoInterno:costo,
                        Precio:precio,
                        Rentabilidad:rentabilidad,
                        PrecioFinal:final,
                        Iva:iva,
                        Tipo:tipo,
                        Estado:estado,
                        CodigoBarras:idProveedor.toString(),
                        Observaciones:newObservaciones
                    }

                    const endpoint ="https://rest.contabilium.com/api/conceptos/?id="+Id
                    const fetchConfig = {
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                            'Authorization':'Bearer '+token[(table as 'main'|'secondary')],
                        },
                        body:JSON.stringify(newProduct)
                    }

                    // return [fetch(endpoint,fetchConfig),codigo];
                    // fetch(endpoint,fetchConfig).then(response=>{
                    //     if(!response.ok) response.text().then(error=>{console.log(error)})
                    // })
                    console.log({fetchConfig,endpoint,table})
                })
            })
            

            // const promises = updatedPromises.map(([promise])=>(promise as Promise<Response>))

            // const updates= await Promise.all(promises).then(updatesResponses=>{
            //     return updatesResponses.map((updateResponse,index)=>{
            //         const [_,codigo] = updatedPromises[index];
            //         return updateResponse.ok?{codigo,status:1}:{codigo,status:2};
            //     })
            // })
            // return updates as {codigo:string,status:number}[];
        }
        return {updateProducts};
    }
    




export {initializeUpdateProducts};