import { ContabiliumOptions,CotizacionesOptions } from "@/components/Opciones";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Opciones',
  }

const OpcionesPage:React.FC = ()=>{
    return (
        <>
            <ContabiliumOptions/>
            <CotizacionesOptions/>
        </>
    )
}

export default OpcionesPage;