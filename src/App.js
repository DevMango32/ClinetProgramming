import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import Top from './component/Top';
import Bottom from './component/Bottom';
import Menu from './component/Menu';

import './App.css';

const App = () => {
  return (
    <Container className="App">
        <Top/>
        <Menu/>
        <Bottom/>
    </Container>
  )
}

export default App
