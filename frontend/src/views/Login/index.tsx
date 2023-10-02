import { Box, useColorMode, Text, Img, Link, Input, Stack, Button, CircularProgress } from '@chakra-ui/react'
import Redirect from '../../components/Redirect'
import Cookies from '../../components/Cookies'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/authContext'

const Login = () => {
  const { colorMode } = useColorMode()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [failedAttempt, setFailedAttempt] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = useContext(AuthContext)
  if(user.logged) return <Redirect url='/'/>

  return <Box>
    <Box
      // make this responsive.
      // this should be a bit on top
      mt='2em'
      // center all content
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'

      paddingBottom='3em'
    >
      <Cookies/>
    </Box>

    <Box
      display='flex'
      flexDirection='column'

      alignItems='center'
      padding='0px'
      mt='2em'
    >
      <Box
      >
        <Box>
          
          <Box
            // center items
            display='flex'
            flexDirection='column'
            alignItems='center'
            padding='0px'
          >
            <Img 
              src={
                colorMode === 'light' ? 
                '/logob.png' :
                '/logow.png'  
              }
              alt='logo'
              width='100px'
              height='100px'
            />
          </Box>
          <Box
            mt='3em'
            display='flex'
            flexDirection='column'
            alignItems='center'
            padding='0px'

            gap='1.3em'
          >
            <Box
              fontFamily='Inter'
              textAlign='center'
            >
              <Text>
                Inicio de sesión
              </Text>
            </Box>

            <Box>
              <Stack
              >
                <Input
                  placeholder='Correo electrónico'
                  bg={colorMode === 'light' ? '#E4E7EB' : '#2C2F33'}
                  border='none'
                  size='sm'
                  borderRadius='4px'
                  variant='p5i'
                  padding='12px 16px'
                  _focus={{
                    outline: 'none'
                  }}
                  type='email'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  placeholder='Contraseña'
                  bg={colorMode === 'light' ? '#E4E7EB' : '#2C2F33'}
                  border='none'
                  borderRadius='4px'
                  variant='p5i'
                  size='sm'
                  padding='12px 16px'
                  _focus={{
                    outline: 'none'
                  }}
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
            >
              <Button
              gap='16px'
              padding='12px 69px'
              borderRadius='4px'
              bg={colorMode === 'light' ? '#E4E7EB' : '#2C2F33'}
              w='100%'
              cursor='pointer'
              // disable text selection
              userSelect='none'
              _hover={
                {
                  bg: colorMode === 'light' ? '#E4E7EB' : '#23272A'
                }
              }
              transition='background-color 0.1s ease-in-out'

              onClick={async () => {
                setLoading(true)
                if(password.length>4 && username.length>4){
                  const status = await user.fetchAuth(username, password)
                  if(status){
                    window.location.href = '/'
                  }
                  else {
                    setFailedAttempt(true)
                    setLoading(false)
                  }
                }
              }}
              >Iniciar sesión</Button>
            </Box>
            {loading && <>
            
              <CircularProgress
                isIndeterminate
                size='24px'
                color='p5i.500'
              />
            </>}

            {failedAttempt && <Text
                color='red.500'
                fontSize='sm'
              >
                Credenciales incorrectas
              </Text>}
          </Box>
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          padding='0px'
          mt='24px'
        >
        </Box>
      </Box>
      <Link
            color={colorMode === 'light' ? 'web.1' : 'web.8'}
          >NOTA: La autentificación está habilitada unicamente para administradores. 【Temporal】</Link>

    </Box>
  </Box>
}

export default Login