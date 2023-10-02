import * as React from 'react'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import theme from './themes'
import './fonts.css'
import AuthProvider from './contexts/authContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
      </ChakraProvider>
    </React.StrictMode>
  </AuthProvider>
)