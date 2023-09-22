'use client'
import { DeleteMatchItem, MatchItem,MatchItems,SerializedProduct,SerializedProducts,SerializedXlsxItems,UpdateMatchItems,Warnings } from "@/types/Precios";
import { Fragment, useEffect,useState } from "react";
import styles from '@/assets/MatchTable.module.css'
import { ACCOUNT_TYPE } from "@/constants";

interface TrItemsProps {
    matchItems:MatchItems;
    warnings:Warnings;
    serializedXlsxItems:SerializedXlsxItems;
    serializedProducts:SerializedProducts;
    updateMatchItems:UpdateMatchItems;
    deleteMatchItem:DeleteMatchItem;
}

const TrItems:React.FC<TrItemsProps> = ({matchItems,warnings,serializedProducts,serializedXlsxItems,updateMatchItems,deleteMatchItem})=>{
    if(matchItems.main.length || matchItems.secondary.length)
    return Object.keys(matchItems).map((table,index)=>(

        <Fragment key={index}>
            {matchItems[(table as 'main'|'secondary')].length?<tr key={table}><td colSpan={7}>{table==ACCOUNT_TYPE.main?'RPM 764':'RPM 925'}</td><td>{''}</td></tr>:''}
            {matchItems[(table as 'main'|'secondary')].map((item,index)=>(
                <TrItem 
                matchItems={matchItems}
                table={table as 'main'|'secondary'} 
                key={index} warnings={warnings} 
                item={item} 
                serializedProducts={serializedProducts} 
                serializedXlsxItems={serializedXlsxItems} 
                updateMatchItems={updateMatchItems} 
                deleteMatchItem={deleteMatchItem}/>
            ))}
        </Fragment>
        )
    ) 
    else return (<tr><td colSpan={7}>sin articulos...</td><td>{}</td></tr>)
}

interface TrItemProps extends TrItemsProps{
    updateMatchItems:UpdateMatchItems;
    deleteMatchItem:DeleteMatchItem;
    item:MatchItem;
    table:'main'|'secondary';
    // wereUpdated:{codigo:string,status:number}[]
}

const TrItem:React.FC<TrItemProps> = ({table,serializedProducts,serializedXlsxItems,updateMatchItems,deleteMatchItem,item,warnings,matchItems})=>{
    const {codigo,descripcion,subCosto,costo,rentabilidad,precio,iva,final} = item;
    const currentProduct = serializedProducts[table][codigo]
    const xlsxTitle = serializedXlsxItems[descripcion]?serializedXlsxItems[descripcion].titulo??'':'';  

    const [warning, setWarning] = useState<{codigo:string,title:boolean,price:boolean}>({codigo,title:false,price:false});
    const [wasUpdated,setWasUpdated] = useState<{codigo:string,status:number}>({codigo,status:0})

    useEffect(()=>{
      if(warnings.length){
        const newWarning = warnings.filter(({codigo:wCodigo})=>(wCodigo == codigo))[0] ?? {codigo,title:false,price:false}
        setWarning(newWarning);
      }

    //   setWasUpdated({codigo,status:0})
    //   if(wereUpdated.length){
    //     const newWasUpdated = wereUpdated.filter(({codigo:fCodigo})=>(fCodigo == codigo))[0] ?? {codigo,status:0};
    //     setWasUpdated(newWasUpdated);
    //   }
    },[matchItems,warnings])

    const {Nombre:cbTitle,PrecioFinal} = currentProduct;
    const finalAnteriorTitle = ['Iva','Rentabilidad','CostoInterno','Precio',].map((item:string)=>(`${item}:${(currentProduct as Record<string,any>)[item]}`)).join('\n')

    const updateItemHandler = ()=>{
        const nuevoFinal = Number(prompt('nuevo final',final.toString())??final)
        updateMatchItems({codigoItem:codigo,nuevoFinal,table});
    }

    const deleteItemHandler = ()=>{
        if (confirm('Estas seguro de eliminar:\n'+cbTitle))
        deleteMatchItem({codigoItem:codigo,table})
    }

    return (
        <tr className={`${wasUpdated.status?wasUpdated.status==1?styles.updateOk:styles.updateFailed:''} ${styles.row}`}>
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

export {TrItems}