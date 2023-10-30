import { Navigate, useSearchParams } from "react-router-dom";
import TopNav from "../../components/TopNav";
import { Box, HStack,Text, useColorMode } from "@chakra-ui/react";
import useApi from "../../contexts/handleApi";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

interface Concept {
  id: number 
  concept: string
  definition: string
  labels: string
  sources: string
  createdAt: string
  updatedAt: string
}

const Concepto = () => {
  const {colorMode} = useColorMode()
  const [searchParams] = useSearchParams()
  const conceptName = searchParams.get('name')
  const [concept, setConcept] = useState<Concept>({
    id: -1,
    concept: '',
    definition: '',
    labels: '',
    sources: '',
    createdAt: '',
    updatedAt: ''
  })
  const { loading, handleApi } = useApi()

  const getConcepts = async () => {
    const gconc = await handleApi('get', '/model', undefined, 
      { 
        concept: conceptName,
       }
    , undefined)
    if (concept) setConcept(gconc[0])
  }

  useEffect(() => {
    getConcepts()
  }, [conceptName])

  if(!conceptName) {
    return <Navigate to='/'/>
  }

  return <Box
    textAlign='center'
    // height as children
    h='fit-content'
  >
    <TopNav/>
    <Box
      my='2%'
      bg={colorMode === 'light' ? 'web.b0' : 'webd.b0'}
      p='4%'
      textAlign='left'
    >
      {loading ? <Loading/>
        :
        <ConceptBlock concept={concept}/>
      }
    </Box>
  </Box>
}

const ConceptBlock = ({concept}: {concept: Concept}) => {
  return<> <b>
  <Text
    fontSize='1.5em'
    // text on left
  >{concept.concept}</Text>
  </b>
  <Text>
    {concept.definition}
  </Text>
  <br/>
  <Box>
    <b>Si quieres saber más sobre {concept.labels} puedes consultar estas fuentes</b><br/>
      {concept.sources && concept.sources.split('<br>').map((source, i) => {
        return <Box
          key={i}
        >

          {source}
          
        </Box>
      })}

  </Box>
  <Box
    mt='5%'
  >
    <b>Categoria</b><br/>
    <HStack
    >
      {concept.labels && concept.labels.split(',').map((label, i) => {
        return <Box
          key={i}
        >
          {label}
        </Box>
      })}
    </HStack>
  </Box>
  </>
}

export default Concepto