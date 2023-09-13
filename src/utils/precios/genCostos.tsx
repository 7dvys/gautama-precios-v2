import { MatchItem, Config } from "@/types/Precios";

const genCostos = ({xlsxCosto,rentabilidadPrevia,config,ivaPrevio}:{xlsxCosto:number;rentabilidadPrevia:number;config:Config,ivaPrevio:number}):Omit<MatchItem,'codigo'|'descripcion'>=>{

    if(typeof xlsxCosto != 'number')
    xlsxCosto=0;

    let {iva,ivaIncluido,modificacion,rentabilidad,modificacionAfecta,isFinal} = config;
    
    if(!iva)
    iva = ivaPrevio;
    const ivaFactor = (iva/100)+1??1;
    
    let subCosto = xlsxCosto;
    if(ivaIncluido)
    subCosto = xlsxCosto/ivaFactor;
    
    const modificacionFactor = (modificacion/100)+1??1;

    if(!rentabilidad)
    rentabilidad = rentabilidadPrevia;

    let rentabilidadFactor = (rentabilidad/100)+1??1;
    if(!modificacionAfecta){
      rentabilidadFactor = rentabilidadFactor/modificacionFactor;
      rentabilidad = (rentabilidadFactor-1)*100;
    }

    let costo,precio,final;

    costo = subCosto*modificacionFactor;
    precio = costo*rentabilidadFactor;
    final = precio*ivaFactor;
    
    if(isFinal){
      final = subCosto*ivaFactor;
      precio = final/ivaFactor;
      costo = precio/rentabilidadFactor;
      subCosto = costo/modificacionFactor;
    }
    
    return {subCosto:Number(subCosto.toFixed(2)),iva:Number(iva.toFixed(2)),costo:Number(costo.toFixed(2)),precio:Number(precio.toFixed(2)),rentabilidad:Number(rentabilidad.toFixed(2)),final:Number(final.toFixed(2))}
  }

  export {genCostos}
  