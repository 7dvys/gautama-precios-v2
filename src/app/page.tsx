import { Movimientos } from "@/components/Movimientos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Inicio - Movimientos',
}

const MovimientosPage = ()=>{
  return (<Movimientos/>)
}

export default MovimientosPage;