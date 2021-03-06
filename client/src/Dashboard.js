import { useState, useEffect } from 'react'
import { Container, Form, ListGroup, Row, Col, Card, Dropdown, Accordion, CardDeck } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import useAuth from './useAuth'
import Player from './Player'
import TrackSearchResult from './TrackSearchResult'
import Queue from './Queue'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import PlaylistTrackItem from './PlaylistTrackItem'
import TopTrackItem from './TopTrackItem'

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
  const [user, setUser] = useState()
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([])
  const [topTracks, setTopTracks] = useState([])


  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)

    spotifyApi.getMe()
      .then((data) => {
        setUser(data.body)
      })

  }, [accessToken])


  function getTracks(uri) {
    return spotifyApi.getPlaylistTracks(uri)
      .then((res) => {
        setCurrentPlaylistTracks(res.body.items.map(track => {
          const smallestAlbumImages = track.track.album.images.reduce((smallest, image) => {
            if (image.height < smallest.height) return image
            return smallest
          }, track.track.album.images[0])
          return {
            artist: track.track.artists[0].name,
            title: track.track.name,
            uri: track.track.uri,
            albumUrl: smallestAlbumImages.url,
            duration: track.track.duration_ms
          }
        }))
      })
  }


  {/* Get user playlists and top tracks*/}
  useEffect(() => {
    if (!accessToken || !user) return

    spotifyApi.getUserPlaylists(user.id, { limit: 5 })
      .then((data) => {
        setPlaylists(data.body.items)
        return data.body.items
      })
      .then(() => {
        spotifyApi.getMyTopTracks({ limit: 8})
        .then((res) => {
          setTopTracks(res.body.items.map(track => {
            const smallestAlbumImages = track.album.images.reduce((smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            }, track.album.images[0])
  
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImages.url,
              duration: track.duration_ms
            }
          }))
        })
      })

  }, [user])


  
  useEffect(() => {
    if (!queue) return setQueue([])
    if (!accessToken) return


    setPlayingTrack(queue[0]);
    // setQueue(queue.slice(1, queue.length))

  }, [queue])


  // add songs to the queue
  function addToQueue(track) {
    setQueue([...queue, track])
    setSearch("")
  }

  // update the queue and play next
  function playNewSong() {

    const tempQueue = queue.slice(1, queue.length)
    setQueue(tempQueue)
  }


  // search bar 
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
            albumUrl: smallestAlbumImages.url,
            duration: track.duration_ms
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
  }

  return (
    <Container className="position-relative vh-100">
      <Row className="my-3">
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
          <Row>
            <Col>
            <h4>Queue</h4>

              <DragDropContext  onDragEnd={handleOnDragEnd}>
                <Droppable  droppableId="songqueue">
                  {provided => (
                    <div className="p-0 overflow-auto" style={{ maxHeight: "255px"}} ref={provided.innerRef} {...provided.droppableProps}>
                      <Queue queue={queue.slice(1, queue.length)} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Col>
            <Col xs={3}>
              <h4>Quick Adds</h4>
              <Accordion>
                <Card>
                  {playlists.map((item, index) => (
                    <Card className="p-0 border-0" key={item.id}>
                      <Accordion.Toggle as={Card.Header} onClick={() => getTracks(item.id)} eventKey={index.toString()}>
                        {item.name}
                      </Accordion.Toggle>
                      <Accordion.Collapse className="overflow-auto" style={{ maxHeight: "200px" }} eventKey={index.toString()}>
                        <Card.Body className="p-0 border-0">
                          {currentPlaylistTracks.length > 0 ? (
                            <ListGroup>
                              {currentPlaylistTracks.map(track => (
                                <ListGroup.Item key={track.id} className="border-0">
                                <PlaylistTrackItem
                                  track={track}
                                  addToQueue={addToQueue}
                                />
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          ) : (<div></div>)}
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))}
                </Card>

              </Accordion>
            </Col>
          </Row>
          <Row>
            <Col>
            <h4>Top Tracks</h4>
            <CardDeck>
              <Row>
              {topTracks.map(track => (
                <Col className="pe-0" key={track.id}>
                  <TopTrackItem
                      track={track}
                      addToQueue={addToQueue}/>
                  </Col>

              ))}
              </Row>

            </CardDeck>

            </Col>

          </Row>

        </Container>
      </Row>
      <Row className="w-100 position-absolute bottom-0">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} q={queue} nextSong={playNewSong} />
      </Row>
    </Container>
  )
}
