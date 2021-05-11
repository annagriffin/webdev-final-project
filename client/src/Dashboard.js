import { useState, useEffect } from 'react'
import { Container, Form, ListGroup, Row, Col, Card, Dropdown } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import useAuth from './useAuth'
import Player from './Player'
import TrackSearchResult from './TrackSearchResult'
import Controller from './Controller'
import { TiMediaPlay, TiMediaPause, TiDeviceLaptop } from 'react-icons/ti'
import QueueItem from './QueueItem'
import Queue from './Queue'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

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

  useEffect(() => {
    if (!queue) return setQueue([])
    if (!accessToken) return


    setPlayingTrack(queue[0]);
    // setQueue(queue.slice(1, queue.length))

  }, [queue])


  function addToQueue(track) {
    setQueue([...queue, track])
    setSearch("")
  }

  function playNewSong() {

    const tempQueue = queue.slice(1, queue.length)
    setQueue(tempQueue)

    // if (queue.length > 1) {
    //   console.log(queue)
    //   setPlayingTrack(queue[0]);
    // }

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





  function handleOnDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }


    const items = Array.from(queue);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQueue(items)
    // console.log(queue)
  }

  return (
    <Container className="position-relative vh-100">
      <Row>
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {searchResults.length > 0 ? (
            <ListGroup className="overflow-auto position-absolute" style={{ top: "38px", height: "400px", zIndex: 1000 }}>
            {searchResults.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                addToQueue={addToQueue}
              />
            ))}
          </ListGroup>
        ) : (<div></div>)}
        
      </Row>



      <Row>
        <Container>
          <h4>Queue</h4>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="songqueue">
              {provided => (
                <div className="p-0" ref={provided.innerRef} {...provided.droppableProps}>
                  <Queue queue={queue} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

        </Container>
      </Row>
      <Row className="w-100 position-absolute bottom-0">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} q={queue} nextSong={playNewSong} />
      </Row>

      {/* <div><Controller accessToken={accessToken} /></div> */}
    </Container>
  )
}
