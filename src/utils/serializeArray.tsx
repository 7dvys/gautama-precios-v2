
const serializeArray = (arrayToSerialize:any[],index:string)=>{
    const serialized = arrayToSerialize.reduce((acc,current)=>{
      const id = current[index].toString().trim();
      acc[id]=current;
      return(acc)
    },{} as Record<string,any>)
    return serialized;
  }

  export {serializeArray};