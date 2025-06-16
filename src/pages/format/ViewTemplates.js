import React, { useState, useEffect } from "react";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { baseurl } from "../../api";
import axios from "axios";
import { useHistory, useParams, Link } from 'react-router-dom';

const viewFeasibility = () => {

  const [template, setTemplate] = useState([]);
  const [filetemplate, setfiletemplate] = useState([])
  const [type, setType] = useState("Feasibility");
  const [data, setData] = useState(["hello","bye"])
  useEffect(() => {
    // Feasibility
    const getTemplate = async () => {
      let body = {}
      await axios.put(`${baseurl}/template/`, {
        body
      }).then(response => {
        console.log(response.data,"feasibility")
        // console.log(response.data.templates,"templates")
        setTemplate(response.data.templates);
      }).catch(error => {
        
      })
   
    }
    getTemplate();
    // File Template
    const getFileTemplate = async () => {
      let body = {}
      await axios.put(`${baseurl}/filetemplate/`, {
        body
      }).then(response => {
        setfiletemplate(response.data.fileTemplates);
      })
    
    }
    getFileTemplate();


  }, [data]);
  // useEffect(() => {
  //   console.log(filetemplate, "Updated filetemplate");
  // }, [filetemplate]);

  const changeData = (type) => {
    if (type == "Feasibility") {
      setData(template)
    }
    if (type == "File") {
      setData(filetemplate)
    }

  }

  return (
    <>
     <form onSubmit={(e) => handleFetch(e)}>
      
      <Col xs={12} md={4}>
        <Form.Group id="pname" className="mb-4">
          <Form.Label>Type</Form.Label>
          <InputGroup>
            <InputGroup.Text></InputGroup.Text>
            <Form.Select value={type} onChange={(e) => {
              setType(e.target.value)
              changeData(e.target.value)
            }}>
              <option value="">Select Option</option>
              <option value="Feasibility">Feasibility</option>
              <option value="File">File</option>

            </Form.Select>
          </InputGroup>
        </Form.Group>
      </Col>
      {/* <Col xs={12} md={4}>
      <Form.Group id="taskstatus" className="mb-4">
        <Form.Label>Project Status</Form.Label>
        <InputGroup>
          <InputGroup.Text></InputGroup.Text>
          <Form.Select value={isActive} onChange={(e) => {
            isActive = e.target.value
            setIsActive(e.target.value)
            handleprojectFetch()
          }}>
            <option value="">Select Option</option>
            {ProjectStatus.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </Form.Select>
        </InputGroup>
      </Form.Group>
    </Col> */}
      {/* <Col xs={12} md={4}>
      <Form.Group id="pname" className="mb-4">
        <Form.Label>Project name</Form.Label>
        <InputGroup>
          <InputGroup.Text></InputGroup.Text>
          <Form.Select value={pname} onChange={(e) => setPname(e.target.value)}>
            <option value="">Select Option</option>
            pnamearr
            {pnamearr != undefined ? pnamearr.map((option, index) => (
              <option key={index} value={option._id}>{option.name}</option>
            )) : null}
          </Form.Select>
        </InputGroup>
      </Form.Group>
    </Col> */}
      {/* 
    <Col xs={12} md={4}>
      <Form.Group id="people" className="mb-4">
        <Form.Label>People</Form.Label>
        <InputGroup>
          <InputGroup.Text></InputGroup.Text>
          <Form.Select value={people} onChange={(e) => setPeople(e.target.value)}>
            <option value="">Select Option</option>
            {users.map((option, index) => (
              <option key={index} value={option._id}>{option.username}</option>
            ))}
          </Form.Select>
        </InputGroup>
      </Form.Group>
    </Col> */}
      {/* <Col xs={12} md={4}>
      <Form.Group id="taskstatus" className="mb-4">
        <Form.Label>Task Status</Form.Label>
        <InputGroup>
          <InputGroup.Text></InputGroup.Text>
          <Form.Select value={taskstatus} onChange={(e) => setTaskStatus(e.target.value)}>
            <option value="">Select Option</option>
            <option value={true}>Complete</option>
            <option value={false}>Incomplete</option>
          </Form.Select>
        </InputGroup>
      </Form.Group>
    </Col> */}
      {/* <Col xs={12} md={2} className="d-flex justify-content-center">
        <Button style={{ height: "70%" }} variant="primary" type="submit" className="w-100 mt-3">
          Submit
        </Button>
      </Col>
    </Row> */}
  </form>
      <div style={{ display: "flex", gap: "200px", padding: "20px", border: "1px solid red" }}>
        <div style={{ width: "50%", border: "1px solid red" }}>
          <table responsive className="align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th style={{borderRight:"1px solid black"}} scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              {/* {data.map((row, index) => (
                <tr key={index}>
                  <td>hi</td>
                  </tr>
              ))} */}
            {type == "Feasibility" ? (<>
                {template && template.map((row, index) => {
                  return (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}
                      <td>{row.date}</td>
                      <td>
                        <a
                          href={`#/feasibility/${row._id}`}
                          style={{ color: 'blue', textDecoration: 'underline' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row._id}
                        </a>
                        {/* <Link
                                  to={`/feasibility/hi`}
                                  style={{ color: 'blue', textDecoration: 'underline' }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  hi
                                </Link> */}
                      </td>
                    </tr>
                  );
                })}
              </>
              ) : (
                <>
                {/* <p>hello</p> */}
                {filetemplate && filetemplate.map((row, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <a
                          href={`#/format/${row._id}`}
                          style={{ color: 'blue', textDecoration: 'underline' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row._id}
                        </a>
                        </td>
                        <td>{row.type}</td>
                        <td>{row.name}</td>
                    </tr>
                  );
                })}
              </>
              )}
             



            </tbody>

          </table>

        </div>
        <div style={{ width: "60%", border: "1px solid red" }}>Hello</div>
      </div>
      </>
    
  )
}

export default viewFeasibility