'use client'
import Link from "next/link";
import styles from '@/assets/RootNav.module.css'
import { usePathname } from 'next/navigation'

export const RootNav:React.FC = ()=>{
    const currentPath = usePathname().slice(1);
    
    const checkFocus = (page:string)=>{
        if(page == currentPath || (!currentPath && page=='inicio'))
        return styles.focus;
    }
    
    return(
    <nav className={styles.RootNav}>
        {
        // ['inicio','productos','precios','imap','pedidos','opciones']
        ['inicio','precios','opciones']

        .map((page,index)=>{
                return (<Link key={index} href={index?page:'/'} className={checkFocus(page)}>{page}</Link>)
            })
        }
    </nav>
)}