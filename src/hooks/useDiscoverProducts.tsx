import { PotentialMatches } from "@/types/descubrir/PotentialMatches";
import { useRef, useState } from "react"


const useDiscoverProducts = ()=>{

    const [potentialMatches,setPotentialMatches] = useState<PotentialMatches>([]);

    const potencialProducts = useRef({});

    return {potentialMatches,setPotentialMatches};

}

export {useDiscoverProducts}