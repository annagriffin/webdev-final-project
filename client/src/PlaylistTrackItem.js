import React from 'react'
import { Dropdown, ListGroup } from 'react-bootstrap'

export default function PlaylistTrackItem({ track, addToQueue }) {

  function handlePlay() {
    addToQueue(track)
  }
  return (
    <div style={{ cursor: "pointer" }}
      onClick={handlePlay}>
      <div className="ms-3">
      <div>{track.title}</div>
      <div className="text-muted">{track.artist}</div>
        </div>
    </div>
  )
}
