import { Product } from "@/types/contabilium";

const InformationPanel:React.FC<{products:Product[]}> = ({products,})=>{
    
    // update dolar :3
    return (
    <article className="box formBox">
        <h3>Informacion</h3>

        <span>Productos: {products.length?products.length:'cargando...'}</span>
        <span>Variacion Dolar: </span>
        <div>
            <button>actualizar dolar</button>
        </div>
    </article>)
}

export {InformationPanel}