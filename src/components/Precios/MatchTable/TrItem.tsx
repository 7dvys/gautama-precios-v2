import { MatchItem,XlsxProduct } from "@/types/Precios";
import { Product } from "@/types/contabilium";
import { MutableRefObject,useEffect,useState, Dispatch, SetStateAction } from "react";
import styles from '@/assets/MatchTable.module.css'

interface TrItemProps{
    serializedProducts:Record<string,Product>;
    serializedXlsxItems:MutableRefObject<Record<string, XlsxProduct>>
    updateMatchItems:Function;
    deleteMatchItem:Function;
    item:MatchItem;
    warnings:{codigo:string,title:boolean,price:boolean}[];
    wereUpdated:{codigo:string,status:number}[]
    matchItems:MatchItem[]
}

const TrItem:React.FC<TrItemProps> = ({serializedProducts,serializedXlsxItems,updateMatchItems,deleteMatchItem,item,warnings,matchItems,wereUpdated})=>{
    const {codigo,descripcion,subCosto,costo,rentabilidad,precio,iva,final} = item;
    const currentProduct = serializedProducts[codigo]
    const xlsxTitle = serializedXlsxItems.current[descripcion]?serializedXlsxItems.current[descripcion].titulo??'':'';  

    const [warning, setWarning] = useState<{codigo:string,title:boolean,price:boolean}>({codigo,title:false,price:false});
    const [wasUpdated,setWasUpdated] = useState<{codigo:string,status:number}>({codigo,status:0})

    useEffect(()=>{
      if(warnings.length){
        const newWarning = warnings.filter(({codigo:wCodigo})=>(wCodigo == codigo))[0] ?? {codigo,title:false,price:false}
        setWarning(newWarning);
      }

      setWasUpdated({codigo,status:0})
      if(wereUpdated.length){
        const newWasUpdated = wereUpdated.filter(({codigo:fCodigo})=>(fCodigo == codigo))[0] ?? {codigo,status:0};
        setWasUpdated(newWasUpdated);
      }
    },[matchItems,warnings,wereUpdated])

    const {Nombre:cbTitle,PrecioFinal} = currentProduct;
    const finalAnteriorTitle = ['Iva','Rentabilidad','CostoInterno','Precio',].map((item:string)=>(`${item}:${(currentProduct as Record<string,any>)[item]}`)).join('\n')

    const updateItemHandler = ()=>{
        const newFinal = Number(prompt('nuevo final',final.toString())??final)
        updateMatchItems(codigo,newFinal);
    }

    const deleteItemHandler = ()=>{
        if (confirm('Estas seguro de eliminar:\n'+cbTitle))
        deleteMatchItem(codigo)
    }

    return (
    <tr className={wasUpdated.status?wasUpdated.status==1?styles.updateOk:styles.updateFailed:''}>
        <td>{codigo}</td>
        <td>{descripcion}</td>
        <td className={warning.title?styles.warning:''} title={xlsxTitle}>{cbTitle.trim()}</td>
        <td title={finalAnteriorTitle}>{PrecioFinal}</td>
        <td title={`subcosto: ${subCosto}+modificacion`}>{costo}</td>
        <td title={`precio: ${costo}+${rentabilidad}% (rentabilidad)`}>{precio}</td>
        <td className={`${warning.price?styles.warning:''} ${styles.final}`} onClick={updateItemHandler} title={`final: ${precio}+${iva}%(iva)`}>{final}</td>
        <td className={styles.delete} onClick={deleteItemHandler}>eliminar</td>

    </tr>
)
}

export {TrItem}