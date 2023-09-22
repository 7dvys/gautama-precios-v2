export type UpdateMatchItems = ({ codigoItem, nuevoFinal, table }: {
    codigoItem: string;
    nuevoFinal: number;
    table: 'main' | 'secondary';
}) => void