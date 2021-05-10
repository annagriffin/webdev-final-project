import { useState, useEffect } from 'react'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import useAuth from './useAuth'
import Player from './Player'
import TrackSearchResult from './TrackSearchResult'
import Controller from './Controller'
import { TiMediaPlay, TiMediaPause, TiDeviceLaptop } from 'react-icons/ti'
import QueueItem from './QueueItem'
import Queue from './Queue'

const spotifyApi = new SpotifyWebApi({
  clientId: 'a9fef7a2a0734ac5bd9a6f827573ed78'
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [playlists, setPlaylists] = useState([])
  const [queue, setQueue] = useState([])
  const [deviceId, setDeviceId] = useState("")


  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)

  }, [accessToken])


  function addToQueue(track) {
    setQueue([...queue, track])
    setSearch("")
  }

  function playNewSong() {
    if (queue.length > 1) {
      setPlayingTrack(queue[0]);
      setQueue(queue.slice(1, queue.length))
    }

  }


  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false

    spotifyApi.searchTracks(search)
      .then(res => {
        if (cancel) return
        setSearchResults(res.body.tracks.items.map(track => {

          const smallestAlbumImages = track.album.images.reduce((smallest, image) => {
            if (image.height < smallest.height) return image
            return smallest
          }, track.album.images[0])

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImages.url
          }
        }))
      })
    return () => cancel = true
  }, [search, accessToken])


  useEffect(() => {
    if (!queue) return setQueue([])
    if (!accessToken) return

    console.log(queue[0])

    setPlayingTrack(queue[0]);
    // setQueue(queue.slice(1, queue.length))

  }, [queue])


  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            addToQueue={addToQueue}
          />
        ))}
      </div>

      <Queue queue={queue} />

      <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} q={queue} nextSong={playNewSong} /></div>

      {/* <div><Controller accessToken={accessToken} /></div> */}
    </Container>
  )
}
