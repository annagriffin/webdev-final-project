import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

export default function TopTrackItem({ track, addToQueue }) {

  function handlePlay() {
    addToQueue(track)
  }
  return (
    <Card className="mb-1" style={{ width: "154px", minWidth: "154px", maxWidth: "154px" }}>
      <Row className="d-flex flex-row flex-wrap" style={{ cursor: "pointer" }}
      onClick={handlePlay}>
        <Col>
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
        </Col>
        <Col className="position-relative">
        <p className="m-0 position-absolute" style={{ fontSize: 12, top: "50%", transform: "translate(0, -50%)" }}>{track.title}</p>
        </Col>
      </Row>
    </Card>
  )
}
