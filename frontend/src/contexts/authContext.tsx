import {createContext, useState, useCallback, ReactNode, useEffect} from "react";
import axios from "axios";

type LoggedType = {
  logged: boolean,
  accountData: {
    name: string,
    role: string,
    email: string,
  }

  fetchAuth: (email: string, password: string) => Promise<boolean>,
}

export const AuthContext = createContext<LoggedType>({
  logged: false,
  accountData: {
    name: '',
    role: '',
    email: '',
  },

  fetchAuth: () => Promise.resolve(false),
})

const AuthProvider = ({children}: {children: ReactNode}) => {
  const [logged, setLogged] = useState(false)
  const [accountData, setAccountData] = useState({
    name: '',
    role: '',
    email: '',
  })

  const fetchAuth = useCallback(async (
    email: string,
    password: string,
  ) => {
    // post json 
    const res = await axios.post(
      import.meta.env.VITE_API_URL +
      '/auth/login',
      {email,password},
      {headers: {
          'Content-Type': 'application/json'},
      }
    ).then(res => res)
    .catch((err) => {
      if (err.response.status !== 401)
        console.log(err.response)
      else if (err.response.status === 401)
        return false
      return err.response
    })
    
    if(res.status === 200) {
      localStorage.setItem('jwt', res.data.tokens.access.token)
      // redirect to home
      return true 
    }
    return false 
  },[])

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('jwt')
      if(!token) return 

      const res = await axios.get(
        import.meta.env.VITE_API_URL +
        'users/me',
        {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      ).then(res => res)
      .catch((err) => {
        if(err.response.status !== 401) 
          return err.response

        if(err.response.status === 401) {
          localStorage.removeItem('jwt')
        }
      })

      if(res.status === 200) {
        setLogged(true)
        setAccountData({
          name: res.data.name,
          role: res.data.role,
          email: res.data.email,
        })
      }
    }

    fetchMe()
  },[])

  return <AuthContext.Provider value={{
    logged,
    accountData,
    fetchAuth,
  }}>
    {children}
  </AuthContext.Provider>
}

export default AuthProvider