import React from 'react'
import { useState, useEffect } from 'react'
import { TiMediaPlay, TiMediaPause, TiDeviceLaptop } from 'react-icons/ti'
import axios from 'axios'
import SpotifyWebApi from 'spotify-web-api-node'
import useAuth from './useAuth'

const spotifyApi = new SpotifyWebApi({
  clientId: 'a9fef7a2a0734ac5bd9a6f827573ed78'
})

export default function Controller({ accessToken }) {
  const [playbackState, setPlaybackState] = useState("")
  const [deviceId, setDeviceId] = useState("")

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  // useEffect(() => {
  //   if (!accessToken) return

  //   spotifyApi.getMyDevices()
  //   .then((data)=> {
  //     console.log(data.body.devices)
  //     // setDeviceId(data.body.devices.find(device => device["name"] == "Spotify Web Player"))
  //   })
  // })

  function playSong() {
  
    spotifyApi.play({ 
      device_id: deviceId
    })
      .then((data) => {
        
      })
  }

  function pauseSong() {
    spotifyApi.pause()
    .then((data)=> {
      console.log("pause data: ", data)
    })
  }

  return (
    <div>
      <TiMediaPlay onClick={playSong} />
      <TiMediaPause onClick={pauseSong} />
    </div>
  )
}