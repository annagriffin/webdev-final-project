import React from 'react'
import { ListGroup } from 'react-bootstrap'

export default function TrackSearchResult({ track, addToQueue }) {

  function handlePlay() {
    addToQueue(track)
  }
  return (
    <ListGroup.Item>
    <div className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}>
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ms-3">

    
      <div>{track.title}</div>
      <div className="text-muted">{track.artist}</div>
        </div>
    </div>
    </ListGroup.Item>
  )
}
