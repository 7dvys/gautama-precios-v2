'use client'
import { DeleteMatchItem, MatchItem,MatchItems,SerializedProducts,SerializedXlsxItems,UpdateMatchItems,Warnings } from "@/types/Precios";
import { Fragment, useEffect,useState } from "react";
import styles from '@/assets/MatchTable.module.css'
import { Product } from "@/types/contabilium";

interface TrItemProps{
    matchItems:MatchItems;
    warnings:Warnings;
    serializedXlsxItems:SerializedXlsxItems;
    serializedProducts:SerializedProducts;
    updateMatchItems:UpdateMatchItems;
    deleteMatchItem:DeleteMatchItem;
    item:MatchItemWithTableAndCurrentProduct;
}

const TrItem:React.FC<TrItemProps> = ({serializedXlsxItems,updateMatchItems,deleteMatchItem,item,warnings,matchItems})=>{
    const {codigo,descripcion,subCosto,costo,rentabilidad,precio,iva,final,currentProduct,table} = item;
    const xlsxTitle = serializedXlsxItems[descripcion]?serializedXlsxItems[descripcion].titulo??'':'';  

    const [warning, setWarning] = useState<{codigo:string,title:boolean,price:boolean}>({codigo,title:false,price:false});
    const [wasUpdated,setWasUpdated] = useState<{codigo:string,status:number}>({codigo,status:0})

    useEffect(()=>{
      if(warnings.length){
        const newWarning = warnings.filter(({codigo:wCodigo})=>(wCodigo == codigo))[0] ?? {codigo,title:false,price:false}
        setWarning(newWarning);
      }

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

interface TrItemsProps extends Omit<TrItemProps,'item'>{
    page:number,
    pageSize:number,
    search:string,
}

interface MatchItemWithTableAndCurrentProduct extends MatchItem {
    table:'main'|'secondary';
    currentProduct:Product;
}
const TrItems:React.FC<TrItemsProps> = ({page,pageSize,search,matchItems,warnings,serializedProducts,serializedXlsxItems,updateMatchItems,deleteMatchItem})=>{

    if(matchItems.main.length || matchItems.secondary.length){
        const allItems = Object.entries(matchItems).reduce((acc,[table,values])=>{
            const items = values.map(item=>{
                const {codigo} = item;
                const currentProduct = serializedProducts[(table as 'main'|'secondary')][codigo]
                return {...item,table:(table as 'main'|'secondary'),currentProduct}
            })
            return acc.concat(items);
        },[] as MatchItemWithTableAndCurrentProduct[])
        .filter(({currentProduct})=>{
            const {Nombre} = currentProduct;
            return search.length?Nombre.toLowerCase().includes(search.toLowerCase()):true;
        })

        // Calcular el índice de inicio y fin para la paginación
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Obtener los elementos para la página actual
        const pageItems = allItems.slice(startIndex, endIndex);

        let currentTable = '';
        return pageItems.map((item,index)=>{
            const {table} = item;
            let tableTr = <Fragment key={table}></Fragment>;
            if(table != currentTable){
                currentTable = table;
                tableTr = <tr key={table}><td colSpan={7}>{table=='main'?'RPM 764':'RPM 925'}</td><td>{}</td></tr>
            }
            return (
            <Fragment key={index}>
                {tableTr}
                <TrItem 
                matchItems={matchItems}
                warnings={warnings} 
                item={item} 
                serializedProducts={serializedProducts} 
                serializedXlsxItems={serializedXlsxItems} 
                updateMatchItems={updateMatchItems} 
                deleteMatchItem={deleteMatchItem}
                />
            </Fragment>
            )
        })

    } else return (<tr><td colSpan={7}>sin articulos...</td><td>{}</td></tr>)
}

export {TrItems}