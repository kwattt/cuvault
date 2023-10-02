import { Box, CircularProgress, Text } from "@chakra-ui/react"


const Loading = () => {
  return <Box
    h='fit-content'
    w='100%'
    display='flex'
    flexDirection='column'
    alignItems='center'
  >
    <Box
      mt='2em'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
    <Text>
      <b>
        Cargando...
      </b>
    </Text>

    <CircularProgress 
      isIndeterminate
      mt='0.3em'   
    />
    </Box>
  </Box>
  }
export default Loading