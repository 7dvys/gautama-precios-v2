interface CotizacionesProps{
    getCotizaciones: () => Record<string, number>;
    updateCotizacion: ({ title, value }: {
        title: string;
        value: number;
    }) => Record<string,number>;
    removeCotizacion: ({ title }: {
        title: string;
    }) => Record<string,number>
}

export type {CotizacionesProps};