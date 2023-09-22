export type DeleteMatchItem = ({ codigoItem, table }: {
    codigoItem: string;
    table: 'main' | 'secondary';
}) => void