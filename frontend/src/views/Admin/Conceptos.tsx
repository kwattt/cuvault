import { Box, Button, HStack, Heading, Input, InputGroup, Stack,  Text, } from "@chakra-ui/react"
import useApi, { useApiFunc } from "../../contexts/handleApi"
import { useEffect, useState } from "react"
import Loading from "../../components/Loading"

interface Concept {
  id: number 
  concept: string
  definition: string
  labels: string
  sources: string
  createdAt: string
  updatedAt: string
}

const PAGINATION = 10 

const Conceptos = () => {
  const [pagination, setPagination] = useState(0)
  const [concepts, setConcepts] = useState<Concept[]>([])
  const { loading, error, handleApi } = useApi()
  const [newConcept, setNewConcept] = useState<Concept>({
    id: -1,
    concept: '',
    definition: '',
    labels: '',
    sources: '',
    createdAt: '',
    updatedAt: ''
  })

  const getConcepts = async () => {
    const gconc = await handleApi('get', '/model', undefined, 
      { page: pagination, limit: PAGINATION }
    , undefined)
    if (concepts) setConcepts(gconc)
  }

  const addConcept = async () => {
    // remove id from data
    let data = {
      concept: newConcept.concept,
      definition: newConcept.definition,
      labels: newConcept.labels.split(','),
      sources: newConcept.sources.split(','),
    }
    const aconc = await handleApi('post', '/model', data, undefined, undefined)
    if (aconc) {setNewConcept({
      id: -1,
      concept: '',
      definition: '',
      labels: '',
      sources: '',
      createdAt: '',
      updatedAt: ''
    })
    getConcepts()
    }
  }

  useEffect(() => {
    getConcepts()
  }, [])

  useEffect(() => {
    getConcepts()
  }, [pagination])

  if(loading) return <Loading/>

  return <Box>
    {error && 
    <Box>
    <Text>
      Ha ocurrido un error al cargar la página '/model',
      por favor, inténtelo de nuevo más tarde y reportar el error.
    </Text>
    <p>
      {error}
    </p>
  </Box>
  }

  <Heading size='md'>Agregar Concepto</Heading>
  <Box
    m='0.5em'
  >
    <InputGroup
      size='sm'
    >
      <Input
        placeholder='Concepto'
        value={newConcept.concept}
        onChange={(e) => setNewConcept({...newConcept, concept: e.target.value})}
      />
      <Input
        placeholder='Definición'
        value={newConcept.definition}
        onChange={(e) => setNewConcept({...newConcept, definition: e.target.value})}
      />
      <Input
        placeholder='Fuentes'
        value={newConcept.sources}
        onChange={(e) => setNewConcept({...newConcept, sources: e.target.value})}
      />
    </InputGroup>

    <Button
        mt='0.3em'
        size='sm'
        border=''
        onClick={() => {
          addConcept()
        }}
      >
        Agregar
      </Button>
  </Box>

  <Heading size='md'>Conceptos - {pagination+1}</Heading>
  <Stack
    p='0.5em'
    spacing='0'
  >
    {concepts &&
    concepts.length > 0 &&
    concepts.map((concept, i) => {
      return <ConceptBox
        key={i}
        concept={concept}
        striped={i % 2 === 0}
      />
    })}
  </Stack>
  {(concepts && concepts.length >= PAGINATION || concepts&& pagination !== 0) &&
    <Box
      display='flex'
      alignItems='center'
    >
      {
        pagination !== 0 &&
        <Button
          size='sm'
          border=''
          onClick={() => {
            setPagination(pagination - 1)
          }}
        >
          {'<'}
        </Button>
      }
      <Text>
        {pagination+1}
      </Text>
      {
        concepts&& concepts.length >= PAGINATION &&
        <Button
          size='sm'
          border=''
          onClick={() => {
            setPagination(pagination + 1)
          }}
        >
          {'>'}
        </Button>
      }
    </Box>
  }
  <Heading size='md'>Modelo</Heading>
  <Text>Configuracion</Text>
  <Button size='sm' 
    variant='p5i'
    onClick={async () => {
      const res = await useApiFunc('post', '/model/train')
      if (res.status === 200) {
        alert('Modelo re-entrenado')
      } else {
        alert('Ha ocurrido un error al re-entrenar el modelo')
      }
    }}
  >Re-entrenar</Button>
  </Box>
}

const ConceptBox = ({ concept, striped }: { concept: Concept, striped:boolean }) => {
  const [open, setOpen] = useState(false)
  return <><Box
      bg={striped ? 'rgba(0,0,0,0.12)' : 'transparent'}
      p='0.2em'
      border='1px solid'
      borderColor='rgba(144,144,144,0.1)'
      // width to fit content
      display='inline-block'
      w='fit-content'
      minW='20%'
      onClick={() => setOpen(!open)}
      _hover={{
        bg: 'rgba(144,144,144,0.32)'
      }}
      cursor='pointer'
    >
      <Text>
        [{concept.id}] {concept.concept}
      </Text>
    </Box>
    {open && 
      // more concept info, add button for delete too
      <Box
        p='0.5em'
        border='1px solid'
        borderColor='rgba(144,144,144,0.1)'
        // width to fit content
        display='flex'
        w='fit-content'
        minW='20%'
      >
        <HStack
          spacing='0.5em'
        >
          <Text>
            {concept.definition}
          </Text>
        <Text>
          {concept.labels}
        </Text>
        <Text>
          {concept.sources}
        </Text>
        <Text>
          {concept.createdAt}
        </Text>
        <Text>
          {concept.updatedAt}
        </Text>
        <Button
          size='sm'
          border=''
          onClick={async () => {
            // delete concept
            const res = await useApiFunc('delete', '/model/' + concept.id)
            if (res.status === 204) {
              window.location.reload()
            } else {
              alert('Ha ocurrido un error al borrar el concepto')
            }
          }}
        >
          Borrar 
        </Button>
        </HStack>
      </Box>
    }
  </>
}

export default Conceptos