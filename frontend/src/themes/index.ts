import { extendTheme, theme as baseTheme } from "@chakra-ui/react"
import { GlobalStyleProps } from '@chakra-ui/theme-tools';

export const transparentize = (hex: string, alpha : number) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2)}`
const colors = {
  webTab: {
    0: "#000", // default
    100: "#000", // hover
    200: "#000", // default dark mode 
    300: "#C8BCF6", // dark hover mode 
    400: "#000", // dark click mode 
    
    500: "#000", // default 
    600: "#009E74", // hover
    700: "#000", // click
    800: "#000", // click
    900: "#000", // click
  },

  webButton: {
    200: "#84c2b2", // default dark mode 
    300: "#489d87", // dark hover mode 
    400: "#b0d5cb", // dark click mode 
    
    500: "#009E74", // default 
    600: "#18bc8f", // hover
    700: "#005941", // click
  },

  nav: {
    d0: '#09090A',
    d1: '#1F1F22',
    0: '#000000',
    1: '#191919',
  },


  webd: {
    b0: '#111111',
    0: '#191919',
    t: '#999DA3',

    1: '#C8BCF6'
  },

  web: {
    b0: '#FDFEFF',
    b: '#F4F5F7',
    0: '#299D91',
    1: '#009E74',
    8: '#c1f3e6',
    t: '#9F9F9F',
  },

  p5i: {
    '0': '#000000',
    '100': '#18181C',
    '100a' : transparentize('#18181C', 0.8),
    '200': '#222228',
    '200a': transparentize('#222228', 0.8), 
    '300': '#2C2C38',
    '300a': transparentize('#2C2C38', 0.8),
    '400': '#363646',
    '400a': transparentize('#363646', 0.8),
    '450': '#9E9E9E',
    '450a': transparentize('#3D3D4D', 0.8),
    '500': '#c8c8c8',
    '500a': transparentize('#c8c8c8', 0.8),
    '550': '#AFBCCF',
    '550a': transparentize('#AFBCCF', 0.8),
    '600': '#E0E1DD',
    '600a': transparentize('#E0E1DD', 0.8)
  },

  vibe1: {
    "50": "#FCE9E9",
    "100": "#F6C0C0",
    "200": "#F19898",
    "300": "#EB7070",
    "400": "#E54848",
    "500": "#E01F1F",
    "600": "#B31919",
    "700": "#861313",
    "800": "#5A0C0C",
    "900": "#2D0606"
  },
  vibe2: {
    "50": "#F8EDF1",
    "100": "#EBCCD8",
    "200": "#DEAAC0",
    "300": "#D189A7",
    "400": "#C5688E",
    "500": "#B84775",
    "600": "#93395E",
    "700": "#6E2B46",
    "800": "#4A1C2F",
    "900": "#250E17"
  }
}

const ftheme = extendTheme({
  colors,
  components: {
    Input: {
      variants: {
        'p5i': (props: GlobalStyleProps) => {
          return {
            ...baseTheme.components.Input.variants!.outline(props),
            //change field and placeholder color
            field: {
              ...baseTheme.components.Input.variants!.outline(props).field,
              fontSize: '0.9rem',
              bg: 'p5i.200',
              color: 'rgba(160,160,160,1)',
              borderColor: 'transparent',
              borderRadius: '10px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              _placeholder: {
                color: 'p5i.450',
              },
            },
            
          }
        }
      }
    },
    Button: {
      variants: {
        'vibe': (props: GlobalStyleProps) =>  {
          const baseButton = baseTheme.components.Button.variants!.solid(props)
            return {
              ...baseButton,
              bg: 'rgba(144, 144, 144, 0.4)',
              color: 'white',
              _focus: {
                boxShadow: "0 0 0 0",
                bg: 'rgba(144, 144, 144, 0.4)' 
              },
              _hover: {
                boxShadow: "0 0 0 0",
                bg: 'rgba(144, 144, 144, 0.3)' 
              },
              _active: {
                boxShadow: "0 0 0 0",
                bg: 'rgba(144, 144, 144, 0.2)' 
              }
          }
        },
        'p5i': (props: GlobalStyleProps) =>  {
          const baseButton = baseTheme.components.Button.variants!.solid(props)
            return {
              ...baseButton,
              bg: 'p5i.200',
              color: 'white',
              _focus: {
              },
              _hover: {
                boxShadow: '0 2px 4px -2px rgba(0,0,0,1)',
                bg: 'rgba(255, 255, 255, 0.5)' ,
                color: 'p5i.300'
              },
              _active: {
                boxShadow: '0 2px 4px -2px rgba(0,0,0,1)',
                color: 'p5i.300',
                bg: 'rgba(255, 255, 255, 0.5)' 
              }
          }
        }
      }
    }
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
})

export default ftheme