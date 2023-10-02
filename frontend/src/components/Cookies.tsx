import { Box, Button, Icon, Link, Text, useColorMode } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import {FaCookieBite} from 'react-icons/fa'

const Cookies = () => {
  const { colorMode } = useColorMode()
  const [cookies, setCookies] = useState(false)

  // check local Storage for cookie consent

  useEffect(() => {
    // if cookie consent is not in local storage
    if(!localStorage.getItem('cookieConsent')) {
      // show cookies
      setCookies(true)
    }
  }
  , [])

  if(!cookies) return <></>
  
  return <Box
    borderRadius='0.5em'
    padding='1em'
    justifyContent='space-between'
    border='solid 1px #CBD5E4'
    fontSize='Spline Sans'
    fontWeight='400'
  >
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      padding='0px'
      gap='0.8em'

      flex='none'
      order='0'
      flexGrow='0'
    >
      <Icon 
      width='2em'
      height='2em'
      color='orange'
      as={
        FaCookieBite
      }/>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='flex-start'
        padding='0px'
        gap='8px'
      >
        <Text
          // break word if it's too long
        >
        En este sitio utilizamos cookies para analizar el tráfico, recordar sus preferencias y optimizar su experiencia.
        </Text>
        <Link
          color={colorMode === 'light' ? 'web.1' : 'web.8'}
        >
          Más información
        </Link>
      </Box>
      <Box>
        <Button
          colorScheme="webButton"

          onClick={() => {
            localStorage.setItem('cookieConsent', 'true')
            setCookies(false)
          }}
        >
          Aceptar
        </Button>
      </Box>
    </Box>
  </Box>
}

export default Cookies