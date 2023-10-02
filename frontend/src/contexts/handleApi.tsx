// component for handling api calls, if the api call is successful, it will return the data, check if jwt is still valid, otherwhise redirect to login
// send requests with bearer token
// also, have status of the request, if it is loading, if it has an error, and if it is done

// Path: frontend-cuvault/src/contexts/handleApi.tsx

import { useState, useCallback } from 'react'

import axios, { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

// not component, usage for functions like onClick 
export const useApiFunc = async (
  method: 'get' | 'post' | 'delete' | 'put',
  url: string,
  data?: any,
  query?: any,
  headers?: any,
) => {
  const handleApi = async (
    method: 'get' | 'post' | 'delete' | 'put',
    url: string,
    data?: any,
    query?: any,
    headers?: any,
  // returns axios response 
  ): Promise<AxiosResponse<any>> => {
    const jwt = localStorage.getItem('jwt')
    const res = await axios({
      method: method,
      url: import.meta.env.VITE_API_URL + url,
      data: data,
      params: query,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
        ...headers
      }
    }).then(res => res)
    .catch((err) => {
      if (err.response.status !== 401)
        console.log(err.response)
      else if (err.response.status === 401)
      window.location.href = '/login'
      else {
      }
      return err.response
    })
    if(res.status === 200) {
      return res
    }
    else if(res.status === 401) {
      window.location.href = '/login'
    }

    return res
  }
  const res = await handleApi(method, url, data, query, headers)
  return res
}


const useApi = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleApi = useCallback(async (
    method: 'get' | 'post' | 'delete' | 'put',
    url: string,
    data?: any,
    query?: any,
    headers?: any,
  ) => {
    setLoading(true)
    setError('')
    setDone(false)
    const jwt = localStorage.getItem('jwt')
    console.log(data)
    const res = await axios({
      method: method,
      url: import.meta.env.VITE_API_URL + url,
      data: data,
      params: query,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
        ...headers
      }
    }).then(res => res)
    .catch((err) => {
      if (err.response.status !== 401)
        console.log(err.response)
      else if (err.response.status === 401)
        navigate('/login')
      else {
        setError(err.response.data.message)
        setLoading(false)
      }
      return err.response
    })
    if(res.status === 200) {
      setLoading(false)
      setDone(true)
      return res.data
    }
    else if(res.status === 401) {
      navigate('/login')
    }
    else {
      setError(res.data.message)
      setLoading(false)
    }
  }, [])

  return { loading, error, done, handleApi }
}

export default useApi