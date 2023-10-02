import { Box,  Heading, } from "@chakra-ui/react"
import Conceptos from "./Conceptos"

const Admin = () => {
  return <Box
    h='fit-content'
    p='2em'
  >
    <Heading size='lg'> ADMIN - PANEL</Heading>
    <Conceptos/>
  </Box>
}

export default Admin