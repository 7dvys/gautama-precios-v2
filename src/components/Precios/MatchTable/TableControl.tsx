import styles from '@/assets/MatchTable.module.css'
import { MatchItems, WarningsCount } from '@/types/Precios'
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react';


interface TableControlProps{
    matchItems:MatchItems,
    warningsCount:WarningsCount,
    cancelarHandler:()=>void,
    aceptarHandler:()=>void,
    page:number,
    setPage:Dispatch<SetStateAction<number>>;
    pageSize:number,
    setPageSize:Dispatch<SetStateAction<number>>
    search:string,
    setSearch:Dispatch<SetStateAction<string>>
}

export const TableControl:React.FC<TableControlProps> = ({matchItems,warningsCount,cancelarHandler,aceptarHandler,page,setPage,pageSize,setPageSize,search,setSearch})=>{
    const {coincidenciasTitle,coincidenciasCount} = (()=>{
        const {main,secondary} = matchItems;
        const coincidenciasTitle = `rpm 764: ${main.length}\nrpm 925: ${secondary.length}`;
        const coincidenciasCount = main.length+secondary.length;
        return {coincidenciasCount,coincidenciasTitle};   
    })()
    
    const {disonantes,dispares}=(()=>{
        const {main,secondary} = warningsCount;
        const [disonantes,dispares] = ['title','price'].map((index)=>{
            const indexName = (index as 'title'|'price');
            const title = `rpm 764: ${main[indexName]}\nrpm 925: ${secondary[indexName]}`;
            const count = main[indexName]+secondary[indexName];
            return {title,count};
        })
        return {disonantes,dispares};
    })()

    // Search and Pagination
    const searchChangeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        const {value} = event.target as HTMLInputElement
        setSearch(value);
    }
    
    const itemsCount = (matchItems.main.length+matchItems.secondary.length)??1;
    const aditionalPage = itemsCount%pageSize?1:0
    const pages = itemsCount?Math.trunc(itemsCount/pageSize)+aditionalPage:1;

    const prevPageHandler = ()=>{
        if(page != 1)
        setPage(page=>page-1);
    }

    const nextPageHandler = ()=>{
        if(page != pages)
        setPage(page=>page+1);
    }

    const changePageSizeHandler = ()=>{
        const  newPageSize = Number(prompt('nuevo tamano de pagina',pageSize.toString()));
        if(isNaN(newPageSize) || !newPageSize)
        setPageSize(pageSize)
        else setPageSize(newPageSize)
    }

    useEffect(()=>{
        setPage(1)
    },[pageSize])
    
    return (
        <>
            <div className={styles.control}>
                <input onChange={searchChangeHandler} placeholder='buscar' type="text" />
                <div className='flex'>
                    <span onClick={prevPageHandler}>❮</span>
                    <span onClick={changePageSizeHandler}>pagina {page} de {pages}</span>
                    <span onClick={nextPageHandler}>❯</span>
                </div>
            </div>
                
            <div className={styles.information}>
                <span title={coincidenciasTitle}>coincidencias: {coincidenciasCount}</span>
                <span title={disonantes.title}>titulos disonantes: {disonantes.count}</span>
                <span title={dispares.title}>precios dispares: {dispares.count}</span>
            </div>
            <div className={styles.options}>
                <button onClick={aceptarHandler}>aceptar</button>
                <button onClick={cancelarHandler}>cancelar</button>
            </div>
        </>
    )
} 