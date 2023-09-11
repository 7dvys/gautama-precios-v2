interface Product{
    Id:number;
    Nombre:string;
    Codigo:string;
    CodigoOem:string;
    CodigoBarras:string;
    Descripcion:string;
    Precio:number;
    PrecioFinal:number;
    Iva:number;
    Rentabilidad:number;
    CostoInterno:number;
    Stock:number;
    StockMinimo:number;
    Observaciones:string;
    Estado:string;
    Tipo:string;
    IdRubro:string;
    IdSubrubro:string;
    Foto:string;
    AplicaRG5329:string;
    IDMoneda:number;
    ListasDePrecio:string;
    Items:string;
}

export {type Product};