import { MatchItem } from "../Precios";

export interface ExchangeRateMatchItem extends MatchItem{
    prevCotizacion:string;
    prevCotizacionRate:number;
} 

export interface ExchangeRateMatchItems {
    main:ExchangeRateMatchItem[],
    secondary:ExchangeRateMatchItem[]
}