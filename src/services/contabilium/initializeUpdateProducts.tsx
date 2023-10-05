import { Product,Token, UpdateProducts } from "@/types/contabilium";
import { simpleDataSerializer } from "@/utils/simpleDataSerializer";
import { initializeCotizaciones } from "../cotizaciones/initializeCotizaciones";
import { serializeArray } from "@/utils";
import { Observaciones } from "@/types/Precios";

const initializeUpdateProducts = ({token}:{token:Token})=>{
    const updateProducts:UpdateProducts = async ({matchItems,serializedProducts,config,vendors})=>{
        const {encoder,decoder}=simpleDataSerializer();
        const {getCotizaciones} = await initializeCotizaciones()
        const serializedVendors = serializeArray(vendors,'Id')

        const [mainUpdates,secondaryUpdates] = Object.entries(matchItems).map(([table,tableMatchItems])=>{
            return tableMatchItems.map(({codigo,costo,rentabilidad,precio,iva,final})=>{
                const cotizacionPrecio = getCotizaciones()[config.cotizacion]
                const cbProduct = serializedProducts[(table as 'main'|'secondary')][codigo]
                const {idProveedor,cotizacion} = config;
                const {Id,Tipo,Estado,Observaciones} = cbProduct;
                const estado = Estado == 'Activo'?'A':'I';
                const tipo = Tipo=='Producto'?'P':'C';

                const {proveedor:prevVendor,cotizacion:prevCotizacion} = decoder(Observaciones) as Observaciones

                const newObservaciones:Observaciones = { 
                    ultActualizacion:new Date().toLocaleDateString('es-ar'),
                    cotizacion:cotizacion!='default'?cotizacion:prevCotizacion,
                    proveedor:!idProveedor?prevVendor:serializedVendors[idProveedor].NombreFantasia?serializedVendors[idProveedor].NombreFantasia:serializedVendors[idProveedor].RazonSocial,
                    cotizacionPrecio:cotizacionPrecio
                }

                const newObservacionesEncoded = encoder(newObservaciones);

                const newProduct:Product = {...cbProduct,
                    CostoInterno:costo,
                    Precio:precio,
                    Rentabilidad:rentabilidad,
                    PrecioFinal:final,
                    Iva:iva,
                    Tipo:tipo,
                    Estado:estado,
                    Observaciones:newObservacionesEncoded
                }

                if(idProveedor) newProduct.CodigoBarras = idProveedor.toString();

                const endpoint ="https://rest.contabilium.com/api/conceptos/?id="+Id
                const fetchConfig = {
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+token[(table as 'main'|'secondary')],
                    },
                    body:JSON.stringify(newProduct)
                }

                return [fetch(endpoint,fetchConfig),codigo,table];
                // fetch(endpoint,fetchConfig).then(response=>{
                    
                // }).catch(error=>{console.log({error,codigo})})
                // console.log({fetchConfig,endpoint,table,newObservacionesEncoded})
            })
        })
        
        alert('Todos los productos enviados.');
        const updatePromises = [...mainUpdates,...secondaryUpdates];
        const promises = updatePromises.map(([promise])=>(promise as Promise<Response>))

        const updates= await Promise.all(promises).then(updatesResponses=>{
            return updatesResponses.map((updateResponse,index)=>{
                const [_,codigo,table] = updatePromises[index];
                if(!updateResponse.ok) updateResponse.text().then(error=>{console.log({error,codigo})})
                return updateResponse.ok?{codigo,table,status:1}:{codigo,table,status:2};
            })
        })
        return updates as {codigo:string,status:number,table:'main'|'secondary'}[];
    }
    return {updateProducts};
}





export {initializeUpdateProducts};