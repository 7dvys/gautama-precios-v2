import { Config, HelperWorkers } from "@/types/Precios";

// LocalStorage Keys
export const LOCALSTORAGE_KEYS = {
    // ConatbiliumApi
    cbUserMain: 'cbUserMain' as 'cbUserMain',
    cbUserSecondary: 'cbUserSecondary' as 'cbUserSecondary',
    cbPassMain: 'cbPassMain' as 'cbPassMain',
    cbPassSecondary: 'cbPassSecondary' as 'cbPassSecondary',
    cbApiTokenMain: 'cbApiTokenMain' as 'cbApiTokenMain',
    cbApiTokenSecondary: 'cbApiTokenSecondary' as 'cbApiTokenSecondary',
    accountType: 'accountType' as 'accountType',
    cotizaciones: 'cotizaciones' as 'cotizaciones',
};

export const ACCOUNT_TYPE = {
    main:'main' as 'main',
    secondary:'secondary' as 'secondary'
}

// IndexedDb ObjectStore Names
export const IndexedDb = {
    NAME:'gautama-precios',
    OBJECTS_STORE:{
        movimientos:'movimientos',
        helpers:'helpers'
    },
}

// para cada helper lo crearemos en la carpeta $key con el nombre del helper.



export const HELPERWORKERS:HelperWorkers = {29201900:[['helperName','explication',{}]]};