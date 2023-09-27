'use client'
import { Vendor } from "@/types/contabilium";
import { RefObject,MutableRefObject, useState, ChangeEvent, useRef, useEffect } from "react";
import { HELPERWORKERS } from "@/constants";
import * as XLSX from 'xlsx';
import { Config } from "@/types/Precios";

interface AyudantesProps{
    refConfig:MutableRefObject<Config>;
    xlsxWorkBook:XLSX.WorkBook;
    vendorRef:RefObject<HTMLSelectElement>;
    setConfigRef:(array: {
        name: string;
        value: string;
    }[]) => void
    vendorId:number;
}

interface ProveedoresProps extends Omit<AyudantesProps,'vendorId'>{
    vendors:Vendor[];
    vendorFilterRef:RefObject<HTMLSelectElement>;
}

const Proveedores:React.FC<ProveedoresProps> = ({vendors,vendorRef,vendorFilterRef,xlsxWorkBook,refConfig,setConfigRef})=>{
   
    const helperRef = useRef<HTMLSelectElement>(null);
    const {setHelperDisabled,setHelperEnabled} = (()=>{
        const setHelperDisabled = ()=>{
            (helperRef.current as HTMLSelectElement).disabled = true;
            (helperRef.current as HTMLSelectElement).title = "ningun ayudante disponible para este proveedor.";
        }

        const setHelperEnabled = ()=>{
            (helperRef.current as HTMLSelectElement).disabled = false;
        }

        return {setHelperDisabled,setHelperEnabled};
    })();

    const [vendorId,setVendorId] = useState<number>(0);

    useEffect(()=>{
        setHelperDisabled();
    },[])


    const vendorChangeHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        const {value:vendorId} = event.target as HTMLSelectElement
        if(HELPERWORKERS[Number(vendorId)]) setHelperEnabled()
        else setHelperDisabled();
        setVendorId(Number(vendorId));
    }

    
    return (
        <>
            <label>proveedor</label>
            <div>
                <select ref={vendorRef} onChange={vendorChangeHandler} name="idProveedor" >
                    <option value="0">proveedor</option>
                    {vendors.map((vendor,index)=>(
                        <option key={index} value={vendor.Id}>{vendor.NombreFantasia.length?vendor.NombreFantasia:vendor.RazonSocial}</option>
                    ))}
                </select>
                <select ref={vendorFilterRef} name="discriminar" title="Solo modificar los articulos cuyo proveedor corresponda al seleccionado.">
                    <option value="0">no discriminar</option>
                    <option value="1">discrimar</option>
                </select>
            </div>

            <label>ayudante</label>
            <select ref={helperRef} name="helper">
                <option value="0">ayudante</option>
                {HELPERWORKERS[vendorId]?Object.values(HELPERWORKERS[vendorId]).map(([name,explicacion],index)=>(
                    <option key={index} value={index} title={explicacion}>{name}</option>
                )):''}
            </select>
        </>
    )
}

export {Proveedores} ;