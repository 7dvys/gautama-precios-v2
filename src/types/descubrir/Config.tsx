export type XlsxItems = {codigo:string,titulo:string}[];

export interface Config{
    colCodigo:number;
    colTitulo:number;
    xlsxItems:XlsxItems;
}