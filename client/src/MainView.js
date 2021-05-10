import React from 'react'
import SideBar from './SideBar'
import Dashboard from './Dashboard'
import { Container, Row, Col } from 'react-bootstrap'

export default function MainView({ code }) {
  return (
    <Container>
      <Row>
        <Col xs={2}>
          <SideBar />
        </Col>
        <Col>
          <Dashboard code={code} />
        </Col>
      </Row>


    </Container>
  )
}
