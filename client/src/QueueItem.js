import React from 'react'
import { Card, Row, Col, ButtonGroup, Button } from 'react-bootstrap'
import { TiTimes, TiThMenu } from 'react-icons/ti'

export default function QueueItem({item}) {
  return (
    <Card>
    <Card.Body>
    {/* <div className="d-flex m-1 align-items-center"> */}
      <Row>
        <Col xs={1}>
      <img src={item.albumUrl} style={{ height: "24px", width: "24px" }} />
      </Col>
      <Col xs={5}>
      <div>{item.title}</div>
      </Col>
      <Col xs={4}>
      <div 
      className="text-muted">{item.artist}</div>
      </Col>
      <Col sx={1}>
      23:40
      </Col>
      <Col sx={1}>
      <ButtonGroup>
        <TiTimes />
       <TiThMenu />
      </ButtonGroup>
      </Col>

    </Row>
    </Card.Body>
    </Card>
  )
}
