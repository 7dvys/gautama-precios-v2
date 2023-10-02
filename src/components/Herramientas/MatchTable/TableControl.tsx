import styles from '@/assets/MatchTable.module.css'
import { MatchItems } from '@/types/Precios';
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react';

interface TableControlProps{
    page:number;
    setPage:Dispatch<SetStateAction<number>>;
    pageSize:number;
    setPageSize:Dispatch<SetStateAction<number>>;
    search:string;
    setSearch:Dispatch<SetStateAction<string>>;
    matchItems:MatchItems
} 
const TableControl:React.FC<TableControlProps> = ({page,setPage,search,setSearch,pageSize,setPageSize,matchItems})=>{

    const {coincidenciasTitle,coincidenciasCount} = (()=>{
        const {main,secondary} = matchItems;
        const coincidenciasTitle = `rpm 764: ${main.length}\nrpm 925: ${secondary.length}`;
        const coincidenciasCount = main.length+secondary.length;
        return {coincidenciasCount,coincidenciasTitle};   
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

    const aceptarHandler = ()=>{}
    const cancelarHandler = ()=>{}
    
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
            </div>
            <div className={styles.options}>
                <button onClick={aceptarHandler}>aceptar</button>
                <button onClick={cancelarHandler}>cancelar</button>
            </div>
        </>
    )
}

export {TableControl}