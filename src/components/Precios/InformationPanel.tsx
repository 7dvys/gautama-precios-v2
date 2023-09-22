import { Product } from "@/types/contabilium";

const InformationPanel:React.FC<{products:{main:Product[],secondary:Product[]}}> = ({products})=>{
    
    // update dolar :3

    return (
    <article className="box formBox">
        <h3>Informacion</h3>

        <span>Productos 764: {products.main.length?products.main.length:'cargando...'}</span>
        <span>Productos 925: {products.secondary.length?products.secondary.length:'cargando...'}</span>
        <span>Variacion Dolar: </span>
        <div>
            <button>actualizar dolar</button>
        </div>
    </article>)
}

export {InformationPanel}