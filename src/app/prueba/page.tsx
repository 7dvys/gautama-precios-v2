'use client'

import { rootContext } from "@/context";
import { Product } from "@/types/contabilium";
import { useContext, useEffect, useRef, useState } from "react";
import * as XLSX from 'xlsx';

const Prueba:React.FC = ()=>{

    const {products,tokenMain} = useContext(rootContext);
    const [codigos,setCodigos] = useState<string[]>([]);


    const fileRef=useRef<HTMLInputElement>(null)
    const aceptHandler = ()=>{
        const file = (fileRef.current?.files as FileList)[0] ;
        file.arrayBuffer().then(
            data=>{
                const xlsxWorkBook = XLSX.read(data);
                const sheets = xlsxWorkBook.SheetNames
                const xlsxWorkBookSheet = xlsxWorkBook.Sheets[sheets[0]]; 
                const sheetToJson=XLSX.utils.sheet_to_json(xlsxWorkBookSheet,{header:1,defval:'_null'})
                action(sheetToJson);
            }
        )
    }

    const action = (jsonSheet:any[])=>{
        const comboItemsList:string[] = [];
        jsonSheet.forEach(item=>{
            if(item[0] == 'Combo') 
            comboItemsList.push(item[1])
        })
        setCodigos(comboItemsList);
    }

    useEffect(()=>{
        if(products.main.length && codigos.length){
            // const {main} = products;
            // main.map(cbProduct=>{
            //     if(codigos.includes(cbProduct.Codigo))
            //     updateProduct(cbProduct)
            // })
            console.log(codigos)
        }
    },[products,codigos])




    const updateProduct = (cbProduct:Product)=>{
        const {Id,Estado} = cbProduct;
        const estado = Estado=='Activo'?'A':'I';
        
        const newProduct = {...cbProduct,
            Tipo:"C",
            Estado:estado
        }
        const endpoint ="https://rest.contabilium.com/api/conceptos/?id="+Id
        const fetchConfig = {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+tokenMain,
            },
            body:JSON.stringify(newProduct)
        }

        fetch(endpoint,fetchConfig).then(response=>{
            if(!response.ok) response.text().then(error=>{console.log(error)})
            else console.log('ok');
        });
    }

    
    return (
        <>
            <input ref={fileRef}type="file"/>
            <button onClick={aceptHandler}>aceptar</button>
        </>
    )
}

export default Prueba;