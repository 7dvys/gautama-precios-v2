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
    matchItems:MatchItem[]
}

const TrItem:React.FC<TrItemProps> = ({serializedProducts,serializedXlsxItems,updateMatchItems,deleteMatchItem,item,warnings,matchItems})=>{
    const {codigo,subCosto,costo,rentabilidad,precio,iva,final} = item;
    const currentProduct = serializedProducts[codigo]
    const {titulo:xlsxTitle} = serializedXlsxItems.current[codigo]  
    const [warning, setWarning] = useState<{codigo:string,title:boolean,price:boolean}>({codigo,title:false,price:false});

    useEffect(()=>{
      if(warnings.length){
        const newWarning = warnings.filter(({codigo:wCodigo})=>(wCodigo == codigo))[0] ?? {codigo,title:false,price:false}
        setWarning(newWarning);
      }
    },[matchItems,warnings])

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
    <tr>
        <td>{codigo}</td>
        <td className={warning.title?styles.warning:''} title={xlsxTitle}>{cbTitle.trim()}</td>
        <td title={finalAnteriorTitle}>{PrecioFinal}</td>
        <td title={`subcosto: ${subCosto}`}>{costo}</td>
        <td title={`precio: costo+${rentabilidad}%(ganacia)`}>{precio}</td>
        <td className={warning.price?styles.warning:''} onClick={updateItemHandler} title={`final: precio+${iva}%(iva)`}>{final}</td>
        <td onClick={deleteItemHandler}>eliminar</td>
        
    </tr>
)
}

export {TrItem}