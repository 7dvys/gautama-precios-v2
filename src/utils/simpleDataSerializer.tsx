export const simpleDataSerializer = ()=>{
    const encoder = (object:Record<string,any>):string=>{
        return Object.entries(object).map(([key,value])=>(`${key}:${value}`)).join('\n')
    }

    const decoder = (encodedObject:string):Record<string,any>=>{
        const rows = encodedObject.split('\n');
        if(rows[0].length)
        return rows.reduce((acc,row)=>{
            const [key,value] = row.split(':');
            if(key&&value)
            acc[key]=value;
            return acc;
        },{} as Record<string,any>)
        else return {}
    }

    return {encoder,decoder}
}