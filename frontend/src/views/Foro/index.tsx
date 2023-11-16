import { Box,  Image, useColorMode } from "@chakra-ui/react"

type SectionType = {
  title: string,
  description: string,
  posts: number
}

const Sections: SectionType[] = [
  {
    title: 'Rizz lol',
    description: 'Rizzeate a tu familia inclusive.',
    posts: 2
  },
  {
    title: 'Programacion orientada',
    description: 'Programacion orientada a objetos',
    posts: 8
  },
  {
    title: 'estadistica',
    description: 'Objetivamente la materia mas dificil de la carrera',
    posts: 231
  }
]

const Foro = () => {
    const { colorMode } = useColorMode()

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
      Conversaciones
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
      {
        Sections.map((section, index) => {
          return <Box
            key={index}
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            alignItems='flex-start'
            p='1em'
            w='100%'
            border='1px solid #c4c4c4'
            borderRadius='0.5em'
            my='0.5em'
          >
            <SectionHeader {...section}/>
            <Box
              fontSize='0.9em'
              fontWeight='500'
              mt='0.5em'
            >
              {section.description}
            </Box>
          </Box>
        })
      }
    </Box>
    </Box>
  </Box>
}

const SectionHeader = ({ title, posts }: SectionType) => {
  return <Box
    display='flex'
    justifyContent='space-between'
    alignItems='center'
  >
    <Box
      fontSize='1.2em'
      fontWeight='600'
    >
      {title}
    </Box>
    <Box
      fontSize='0.8em'
      fontWeight='500'
    >
      {posts} posts
    </Box>
  </Box>
} 
  

export default Foro