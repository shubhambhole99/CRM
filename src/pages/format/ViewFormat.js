import React, { useState, useEffect } from "react";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { baseurl } from "../../api";
import axios from "axios";
import { useHistory, useParams, Link } from 'react-router-dom';

const viewFeasibility = () => {

  const [template, setTemplate] = useState([]);

  useEffect(() => {
    const getTemplate = async () => {
      let body={}
      const response = await axios.put(`${baseurl}/template/`, {
        body
      });
      console.log(response.data.templates)
      setTemplate(response.data.templates);
    }
    getTemplate();
  }, []);

  return (
    
    <div style={{display: "flex", gap: "200px", padding: "20px",border:"1px solid red"}}>
    <div style={{width:"57%",border:"1px solid red"}}>
    <table responsive  className="align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">#</th>
                            <th  scope="col">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                         
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
                         
                        </tbody>
                    
     </table>

    </div>
    <div style={{width:"50%",border:"1px solid red"}}>Hello</div>
    </div>

  )
}

export default viewFeasibility