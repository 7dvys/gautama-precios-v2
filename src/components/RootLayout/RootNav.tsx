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
        {['inicio','precios','imap','pedidos','opciones'].map((page,index)=>{
                return (<Link key={index} href={index?page:'/'} className={checkFocus(page)}>{page}</Link>)
            })
        }
    </nav>
)}