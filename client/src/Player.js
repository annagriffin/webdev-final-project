import { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({ accessToken, trackUri, nextSong }) {
  const [play, setPlay] = useState(false)


  useEffect(() => {
    setPlay(true)
  }, [trackUri])


  if (!accessToken) return null

  return (
    <div>

      <SpotifyPlayer
        token={accessToken}
        play={play}
        callback={state => {
          if (!state.isPlaying && state.position === 0) {
            nextSong()
          } else if (!state.isPlaying) {
              setPlay(false)

            }
          }
        }
        uris={trackUri ? [trackUri] : []}
      />
    </div>


  )
}




