import { Vendor } from "@/types/contabilium";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type ProveedoresValues = {
    vendorValue:string;
    discriminarValue:string;
}

interface ProveedoresProps{
    proveedoresValues:ProveedoresValues;
    setProveedoresValues:Dispatch<SetStateAction<ProveedoresValues>>;
    vendors:Vendor[];
}

const Proveedores:React.FC<ProveedoresProps> = ({proveedoresValues,setProveedoresValues,vendors})=>{
    
    const changeVendorEvent = (event:ChangeEvent<HTMLSelectElement>)=>{
        const {value} = event.target;
        setProveedoresValues({...proveedoresValues,vendorValue:value});
    }

    const changeDiscrimarEvent = (event:ChangeEvent<HTMLSelectElement>)=>{
        const {value} = event.target;
        setProveedoresValues({...proveedoresValues,discriminarValue:value});
    }
    
    return (
        <>
            <label>proveedor</label>
            <div>
                <select name="idProveedor" onChange={changeVendorEvent} value={proveedoresValues.vendorValue}>
                    <option value="0">proveedor</option>
                    {vendors.map((vendor,index)=>(
                        <option key={index} value={vendor.Id}>{vendor.NombreFantasia.length?vendor.NombreFantasia:vendor.RazonSocial}</option>
                    ))}
                </select>
                <select onChange={changeDiscrimarEvent} value={proveedoresValues.discriminarValue} name="discriminar" title="Solo modificar los articulos cuyo proveedor corresponda al seleccionado.">
                    <option value="0">no discriminar</option>
                    <option value="1">discrimar</option>
                </select>
            </div>
        </>
    )
}

export {Proveedores} ;