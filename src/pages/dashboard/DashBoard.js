import React from 'react'
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ViewTasks from '../Tasks/viewTasks';
import { check } from '../../checkloggedin';
// import Bucket from './Bucket';
import Bucket from '../Bucket/viewBucket';

const DashBoard = () => {

  


  return (
    <>
      <h1>Bucket:{check()[1]}</h1>
    <div style={{border:"2px solid grey",borderRadius:"20px",maxHeight:"1000px",overflowY:"scroll",padding:"30px"}}>
    <Bucket fromdashboard={true}/>
    </div>
    <h1>Tasks:{check()[1]}</h1>
    <div style={{border:"2px solid grey",borderRadius:"20px",maxHeight:"1000px",overflowY:"scroll",padding:"30px"}}>
    <ViewTasks fromdashboard={true}/>
    </div>
    </>
  )
}

export default DashBoard