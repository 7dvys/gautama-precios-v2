import styles from '@/assets/MatchTable.module.css'
import { MatchItems, WarningsCount } from '@/types/Precios'


export const Information:React.FC<{matchItems:MatchItems,warningsCount:WarningsCount,cancelarHandler:()=>void,aceptarHandler:()=>void}> = ({matchItems,warningsCount,cancelarHandler,aceptarHandler})=>{
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
    
    return (
        <>
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