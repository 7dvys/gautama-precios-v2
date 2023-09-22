import stringSimilarity from "string-similarity-js";

const compareTitles = ({xlsxTitle,cbTitle}:{xlsxTitle:string,cbTitle:string})=>{
    xlsxTitle = xlsxTitle?xlsxTitle.toString():''
    const similaryRate = stringSimilarity(xlsxTitle.toString(),cbTitle);

    const [rateWords,rateNumbers,rateNumbersAndWords] = [/[^a-zA-Z]/g,/[^0-9]/g,/[^a-zA-Z0-9]/g].map((regex)=>{
        const [xlsxTitleTokenized,titleTokenized] = [xlsxTitle,cbTitle].map(title=>title.split(/[\s\-Xx]+/).map(word=>(word.replace(regex, ''))));
        const rate = xlsxTitleTokenized.reduce((acc,word)=>{
            if(titleTokenized.includes(word) && word !== '') acc++;
            return acc;
        },0)/xlsxTitleTokenized.length;

        return rate;
    })

    const rate = rateNumbers*0.25+rateWords*0.15+rateNumbersAndWords*0.3+similaryRate*0.3
    
    return {rate};
    
}
export {compareTitles}