'use client'
import { rootContext } from "@/context";
import { useContext,useState, useEffect, ChangeEvent } from "react";
import { Product, Vendor } from "@/types/contabilium";
import { getProducts } from "@/services/contabilium";
import styles from '@/assets/precios.module.css';
import stylesTable from '@/assets/MatchTable.module.css'
import { serializeArray } from "@/utils";

const ProductsTable:React.FC<{items:{codigo:string,descripcion:string,nombre:string,final:number,stock:number}[]}> = ({items})=>{
    const sortFunction = (a:any,b:any)=>{
        if (a.stock === b.stock) {
            return 0;
        }
        else {
            return (a.stock < b.stock) ? -1 : 1;
        }
    }
    
    if(items && items.length)
    return (
        <table className={stylesTable.table}>
            <thead>
                <tr>
                    {['codigo','descripcion','nombre','precio final','stock'].map((title,index)=>(
                        <th key={index}>{title}</th>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                {items.sort(sortFunction).map(({codigo,descripcion,nombre,final,stock},index)=>(
                    <tr key={index}>
                        <td>{codigo.trim()}</td>
                        <td>{descripcion.trim()}</td>
                        <td>{nombre.trim().substring(0,160)+'...'}</td>
                        <td>{final}</td>
                        <td>{stock}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
    else 
    return (<>sin articulos</>)
}


const Productos:React.FC = ()=>{
    const {products,vendors} = useContext(rootContext);
    const [indexedProducts,setIndexedProducts] = useState<Record<string,{codigo:string,descripcion:string,nombre:string,final:number,stock:number}[]>>({});
    const [selectedVendor,setSelectedVendor] = useState<string>('none');
    const [enabledVendors,setEnabledVendors] = useState<Vendor[]>([]);
    const [withoutStockCount,setWithoutStockCount] = useState<number>(0);
    



    useEffect(()=>{
        if(products.main.length){
            const serializedVendors = serializeArray(vendors,'Id');
            const newEnabledVendors:Vendor[] = [];
            const newIndexedProducts = products.main.reduce((acc,product)=>{
                const {CodigoBarras,Stock,PrecioFinal,Codigo,Descripcion,Nombre} = product;
                const includedInVendors = Object.keys(serializedVendors).includes(CodigoBarras)

                
                if(!Object.keys(acc).includes(CodigoBarras) && includedInVendors){
                    acc[CodigoBarras] = [];
                    newEnabledVendors.push(serializedVendors[CodigoBarras])
                }
                const element = {codigo:Codigo,descripcion:Descripcion,nombre:Nombre,final:PrecioFinal,stock:Stock};

                if(includedInVendors)
                acc[CodigoBarras].push(element)
                else acc.orphan.push(element)
                return acc;
            },{orphan:[]} as Record<string,{codigo:string,descripcion:string,nombre:string,final:number,stock:number}[]>)
            setIndexedProducts(newIndexedProducts)
            setEnabledVendors(newEnabledVendors)
        }
    },[products])

    useEffect(()=>{
        if(Object.keys(indexedProducts).length){
            let withoutStockCount = 0;
            indexedProducts[selectedVendor].forEach(({stock})=>{
                if(stock<=0) withoutStockCount++;
            })
            setWithoutStockCount(withoutStockCount);

        }
    },[selectedVendor])



    const changeVendorHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        const {value} = event.target
        setSelectedVendor(value);
    }   

    if(enabledVendors.length)
    return (
        <>
            <aside className={styles.aside}>
                <article className="box formBox">
                    <h3>Proveedores</h3>
                    <div>
                        <select value={selectedVendor} onChange={changeVendorHandler} name="idProveedor">
                            <option value="nonbe">proveedor</option>
                            {enabledVendors.map((vendor,index)=>(
                                <option key={index} value={vendor.Id}>{vendor.NombreFantasia.length?vendor.NombreFantasia:vendor.RazonSocial}</option>
                            ))}
                            <option value="orphan">sin proveedor</option>

                        </select>
                    </div>
                </article>
            </aside>
            <div className={stylesTable.matchTable}>
                <div className={`${stylesTable.tableOptions} box`}>
                    <div className={stylesTable.information}>
                        <span>articulos: {indexedProducts[selectedVendor]?indexedProducts[selectedVendor].length:0}</span>
                        <span>sin stock: {withoutStockCount}</span>
                    </div>

                </div>
                <div className={`${stylesTable.tableContainer} box`}>
                    <ProductsTable items={indexedProducts[selectedVendor]}/>
                </div>
            </div>
        </>
    )
    else return (<>cargando...</>)
}

export {Productos};