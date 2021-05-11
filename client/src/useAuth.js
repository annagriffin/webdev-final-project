import { useState, useEffect } from 'react'
import axios from 'axios'
const LS_KEYS = {
  ACCESS_TOKEN: 'access token',
  TOKEN_EXPIRES: 'spotifyTokenExpiry',
  REFRESH_TOKEN: 'refresh token',
}

const CLIENT_ID = 'a9fef7a2a0734ac5bd9a6f827573ed78';
const client_secret =  '286b51b5aedd47a9be829c4bb1e59e60';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=a9fef7a2a0734ac5bd9a6f827573ed78&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-read-private"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    axios.post('http://localhost:3001/login', {
      code,
    }).then(res => {
      storeToken(res.data.accessToken, res.data.expiresIn, res.data.refreshToken)
      setAccessToken(res.data.accessToken)
      setExpiresIn(res.data.expiresIn)
      setRefreshToken(res.data.refreshToken)
      window.history.pushState({}, null, "/")
    }).catch(() => {
      window.location = '/'
    })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return

    const interval = setInterval(() => {
      axios.post('http://localhost:3001/refresh', {
        refreshToken,
      }).then(res => {
        setAccessToken(res.data.accessToken)
        setExpiresIn(res.data.expiresIn)
      }).catch(() => {
        window.location = '/'
      })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}

export const storeToken = (accessToken, expiry, refreshToken) => {
  localStorage.setItem(LS_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(LS_KEYS.TOKEN_EXPIRES, expiry)
  localStorage.setItem(LS_KEYS.REFRESH_TOKEN, refreshToken)
}

export const getToken = () => {
  const token = localStorage.getItem(LS_KEYS.ACCESS_TOKEN)
  return token
}

export const checkToken = () => {
  const token = localStorage.getItem(LS_KEYS.accessTOKEN)
  const expiry = localStorage.getItem(LS_KEYS.TOKEN_EXPIRES)

  if (!token || !expiry) {
    return false
  }

  return true
}

export const login = () => {
  return new Promise((resolve, reject) => {
    window.location.assign(AUTH_URL);
    
    const listener = setInterval(() => {
      if (checkToken()) {
        resolve()
        window.onmessage = null
      }
    }, 1000)

    window.onmessage = event => {
      const { token, expiry } = JSON.parse(event.data)
      storeToken(token, expiry)
      clearInterval(listener)
      window.onmessage = null
      return resolve(token)
    }
  })
}
