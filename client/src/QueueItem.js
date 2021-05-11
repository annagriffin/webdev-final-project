import React, { useState } from 'react'
import { Card, Row, Col, ButtonGroup, Button } from 'react-bootstrap'
import { TiTimes, TiThMenu } from 'react-icons/ti'
import { Draggable } from 'react-beautiful-dnd'

export default function QueueItem({ item, index }) {

  function toMs(ms) {
      console.log(ms)
      let minutes = Math.floor((ms / 1000) / 60)
      let seconds = Math.floor((ms / 1000) % 60)
      return `${minutes}:${seconds}` 

  }
  return (
    <Draggable draggableId={item.uri} index={index} >
      { provided => (

        <Card ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <Card.Body className="p-2">
            {/* <div className="d-flex m-1 align-items-center"> */}
            <Row>
              <Col xs={1}>
                <img src={item.albumUrl} style={{ height: "24px", width: "24px" }} />
              </Col>
              <Col xs={6}>
                <div>{item.title}</div>
              </Col>
              <Col xs={4}>
                <div
                  className="text-muted">{item.artist}</div>
              </Col>
              <Col sx={1}>
                {toMs(item.duration)}
          </Col>
              
            </Row>
          </Card.Body>
        </Card>
      )}
    </Draggable>
  )
}
