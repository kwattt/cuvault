import { Box, useColorMode } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Inicio from './views/Inicio'
import Concepto from './views/Concepto/Concepto'
import Login from './views/Login'
import Admin from './views/Admin'
import { useEffect } from 'react'
import Ayuda from './views/Ayuda'

const App = () => {
  const { colorMode } = useColorMode()

  useEffect(() => {
    console.log('started app')
  }, [])

  return <Box
  // height to match children
    display='flex'
    h={`${Math.max( document.body.scrollHeight, document.body.offsetHeight, 
      document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight )}px`
    }
    w='100vw'
    fontSize={{ base: '12px', sm: '16px', md: '18px', lg: '14px', xl: '17px' }}
    bg={colorMode === 'light' ? 'web.b' : 'webd.0'}
    
  >
    <BrowserRouter>
      <Nav/>
      <Box
        w='100vw'
        h='100vh'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        overflowY='auto'
      >
      <Routes>
        <Route path='/' element={<Inicio/>}/>
        <Route path='/concepto' element={<Concepto/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/ayuda' element={<Ayuda/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
      </Box>
    </BrowserRouter>
  </Box>
}

export default App