import { Box, Icon, Img, Text, useBreakpointValue, useColorMode, useDisclosure } from '@chakra-ui/react'
import {  motion } from 'framer-motion'
import {  useContext, useEffect, useState } from 'react'

import {RxHome} from 'react-icons/rx'
import {MdOutlineForum,  MdDarkMode, MdLightMode} from 'react-icons/md'
import {HiLogin, HiLogout, } from 'react-icons/hi'
import {FiHelpCircle} from 'react-icons/fi'
import {AiOutlineSecurityScan} from 'react-icons/ai'
//import {BsThreeDotsVertical} from 'react-icons/bs'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/authContext'

const Nav = () => {
  const user = useContext(AuthContext)
  const { colorMode, toggleColorMode } = useColorMode()
  
  // responsive font size
  const navigate = useNavigate()
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure()
  const [expand, setExpand] = useState(!isOpen)

  const enableExpand = useBreakpointValue({
    base: false,
    lg: true
  })

  useEffect(() => {
    if(!enableExpand && !expand) getButtonProps().onClick()
  }, [enableExpand])

  useEffect(() => {
    const expand = JSON.parse(localStorage.getItem('expand') || 'false')
    if(isOpen === expand)
      // trigger
      getButtonProps().onClick()
    setExpand(expand)
  }, [])
    
  return (
    <Box
      id='Nav' 
      h='100vh'
    >
      <motion.div
        {...getDisclosureProps()}
        hidden={false}
        initial={false}
        onAnimationStart={() => setExpand(false)}
        onAnimationComplete={() => setExpand(!isOpen)}
        animate={{ width: isOpen ? '17em' : '4.5em' }}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          left: '0',
          height: '100%',
          top: '0',
        }}
      >
        <Box
          overflowY='auto'
          h='100%'
          bg={colorMode === 'dark' ? 'nav.d0' : 'nav.1'}

          display='flex'
          flexDirection='column'
          alignItems='flex-start'
          padding='1.2em'
          fontFamily='Poppins'
          color='white'
          w='100%'
          gap='6px'
        >
          <Box
            color='white'
            display='flex'
            columnGap='7px'
            fontSize='1.5em'
            userSelect='none'
            w='100%'

            cursor='pointer'

            _hover={{
              color: colorMode === 'light' ? 'web.1' : 'webd.1',
            }}
            transition='0.1s linear'

            onClick={() => {
              if(enableExpand){
                getButtonProps().onClick()
                localStorage.setItem('expand', JSON.stringify(!expand))
              }
            }}
          >
            {!expand ? <>
              <Text
              fontWeight='800'
              letterSpacing='0.08em'
            >
              CU
            </Text>
            <Text
              letterSpacing='0.08em'
              fontWeight='300'
            >
              Vault
            </Text>            
            </> : <>
              <Img
                src='/logow.png'
              />
            </>
            }
          </Box>
          <Box
            // will put one child above and one below
            display='flex'
            flexDirection='column'
            alignItems='flex-start'
            gap='8px'
            w='100%'
              
            justifyContent='space-between'
            h='100%'
          >
          <Box
            w='100%'
            display='flex'
            flexDirection='column'
            alignItems='flex-start'
            gap='8px'
          >
          <NavButton
            text='Inicio'
              expand={expand}
              icon={RxHome}
            id='/'
            onClick={() => navigate('/')}
          />
          <NavButton
            text='Conversaciones'
            expand={expand}
            icon={MdOutlineForum}
          />

          <NavButton
            expand={expand}
            text='Ayuda'
            onClick={() => navigate('/ayuda')}
            icon={FiHelpCircle}
          />
          </Box>
          <Box
            boxSizing='border-box'
            w='100%'
            display='flex'
            flexDirection='column'
            alignItems='flex-start'
            gap='8px'
          >
            <NavButton
              text='Tema'
              expand={expand}
              icon={colorMode === 'light' ? MdDarkMode : MdLightMode}
              onClick={toggleColorMode}
            />

            {user.logged ? <>
            {
              user.accountData.role === 'ADMIN' && <NavButton
              text='Admin'
              expand={expand}
              icon={AiOutlineSecurityScan}
              onClick={() => navigate('/admin')}
              />
            }
            <NavButton
              expand={expand}
              text='Cerrar Sesión'
              icon={HiLogout}
              alt
              onClick={() => {
                localStorage.removeItem('jwt')
                window.location.reload()
              }}
            />
            </>
            :
            <NavButton
              expand={expand}
              text='Iniciar Sesión'
              icon={HiLogin}
              alt
              onClick={() => {
                navigate('/login')
              }}
            />
            }
            {user.logged && <>
            <Box
              borderTop='1px solid rgba(255,255,255,0.08)'
              display='flex'
              flexDirection='row'
              alignItems='center'
              gap='32px'
              mt='10px'
              py='10px'
              w='100%'

              userSelect='none'
              // disable mouse events

              // on click set route to /profile/{user.id}
              onClick={() => navigate(`/profile/${user.accountData.name}`)}
              /*
              _hover={{
                bg: 'p5i.200'
              }}
              cursor='pointer'
              */
              px={!expand ? '0.7em' : '0'}
              
              borderRadius='4px'
              /*
              <Icon
                as={BsThreeDotsVertical}
                width='16px'
                height='16px'
              /> 

              */
            > 
              <Box
                display='flex'
                flexDir='row'
                alignItems='center'
                gap='16px'
                // https://cdn.discordapp.com/avatars/254672103465418752/73df715db13a7dae10338e8833d9625f.png
              >
                <Img
                  pointerEvents='none'
                  src='/logob.png'
                  width='3em'
                  borderRadius='50%'
                />
              </Box>
              {!expand && <>
              <Box
                display='flex'
                flexDir='column'
                alignItems='flex-start'
              >
                <Text
                  fontWeight='600'
                  fontSize='0.8em'
                >
                  {user.accountData.name}
                </Text>
                <Text
                  fontWeight='400'
                  fontSize='0.7em'
                  color='rgba(255,255,255,0.7)'
                > {user.accountData.email.split('@')[0]} </Text>
              </Box>
              </>}
            </Box>
          </>}
          </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  )
}

const NavButton = ({text,icon, alt, onClick, id, expand} : {text:string, icon: typeof RxHome, alt?: true, 
  onClick?: () => void ,
  id?: string,
  expand: boolean
}) => {
  const { colorMode } = useColorMode()
  // get current route path
  const { pathname } = useLocation()

  return <Box
  borderRadius='4px'
  w='100%'
  p={!expand ? '0.5em' : '0.4em 0.25em'}
  display='flex'
  flexDirection='row'
  userSelect='none'
  cursor='pointer'
  bg={id === pathname ? (
    colorMode === 'light' ? 'web.0' : 'nav.d1'
  ) : (alt ? 'rgba(255, 255, 255, 0.08)' : 'transparent')}
  _hover={{
    bg: alt ? 'rgba(255, 255, 255, 0.6)' : (
      colorMode === 'light' ? 'web.0' : 'nav.d1'
    ),
    color: alt ? 'p5i.200' : '',
  }}
  gap='1em'
  transition='0.1s linear'
  onClick={onClick}
  // center 
  alignItems='center'
  justifyContent='flex-start'

>
  <Icon as={icon}
    w='1.6em'  
    h='1.6em'
    color={
      colorMode === 'light' ? 'white' : 'webd.1'
    }
  />{!expand && 
    <Text>{text}</Text>
  }
</Box>
}

export default Nav