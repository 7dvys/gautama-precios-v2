export type PotentialMatches = {
    table:'main'|'secondary';   
    xlsxCodigo:string;
    items:{
        codigo:string,
        titulo:string
    }
}[]