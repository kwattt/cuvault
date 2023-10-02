import { Box, Image, Input, useColorMode } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce';
import { useApiFunc } from "../contexts/handleApi";

interface Concept {
  concept: string
  definition: string
  labels: string
  subjects: string
  sources: string
}

const TopNav = ()  => {
  const { colorMode } = useColorMode()
  const [searchValue, setSearchValue] = useState('')
  const [value] = useDebounce(searchValue, 100);
  const [concepts, setConcepts] = useState<Concept[]>([])

  useEffect(() => {
    const concepts = async () => {
      if (value === '' || value.length < 2) {
        setConcepts([])
        return
      }
      const res = await useApiFunc('get', '/model/search', undefined, {query: value})
      if(res) {
        setConcepts(res.data)
      }
      else 
        setConcepts([])
    }
    concepts()
    }, [value])

  return <Box
    display='flex'
    justifyContent='center'
    flexWrap='wrap'
  >
    <Image
      mt='2%'
      src={ colorMode === 'light' ? "/logob.png"  : '/logow.png'}  
      alt='cuvault logo'
      w='5em'
    />
    <Box flexBasis='100%'/>

    <Box
      fontSize='1.2em'
      fontWeight='600'
    >
      Busqueda
    </Box>
    <Box flexBasis='100%' my='0.5%'/>
    <Box
      display='flex'
      // center
      alignItems='center'
      justifyContent='center'
      // break items into rows
      flexWrap='wrap'
    >
    <Box
      w='100%'
    >
      <Box>
      <Input
      size='sm'
      variant='p5i'      
      placeholder="Algebra lineal.."
      onChange={
        (e) => {
          setSearchValue(e.target.value)
        }
      }
      value={searchValue}
    />

    </Box>
    {concepts.length > 0 && 
      <Box
        w='100%'
        bg='rgba(144,144,144,0.3)'
        borderRadius='0.2em'
        p='0.1em'
      >
        {concepts.map((concept, i) => {
          return <ConceptBox key={i} concept={concept} setSearchValue={setSearchValue}/>
        })
      }
      </Box>
    }
    </Box>
    </Box>
  </Box>
}

const ConceptBox = ({concept, setSearchValue} : {concept: Concept, setSearchValue: (value: string) => void 
}) => {
  const navigate =useNavigate()
  return <Box>
    <Box
      _hover={
        {
          bg: 'rgba(144,144,144,0.5)',
          cursor: 'pointer'
        }
      }
      // onClick send to /concepto + concept.concept
      onClick={() => {
        navigate(`/concepto?name=${concept.concept}`)
        setSearchValue('')
      }}
    >
      {concept.concept}
    </Box>
  </Box>
}

export default TopNav