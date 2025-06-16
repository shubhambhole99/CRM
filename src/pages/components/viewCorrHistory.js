import React, { useState } from 'react'
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseurl } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const ViewCorrHistory = ({ resett,id, history, setHistory, showModal1, setShowModal1 }) => {

  const [showModal2, setShowModal2] = useState(false)
  const [texthistory, setTextHistory] = useState('')
  const [taskhistoryid, setTaskhistoryId] = useState('')
  let [editmode, seteditmode] = useState(false)

  const { correspondence, loading, error } = useSelector((state) => state.correspondence);


  const handledeletetaskhistory = async (row) => {

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${baseurl}/history/${row.taskHistory._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("History deleted successfully");
      setShowModal1(false)
    } catch (error) {
      toast.error(error.message)
    }

  }
  const handleedittaskHistory = async (row) => {

    setShowModal2(true)
    setTaskhistoryId(row.taskHistory._id)
    setTextHistory(row.taskHistory.taskDescription)

  }
  const handleedithistorysubmit = async () => {
    try {
      const editData = {
        taskDescription: texthistory,
      };
      const token = localStorage.getItem('token');
      const response = await axios.put(`${baseurl}/history/${taskhistoryid}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("History updated successfully");
      setShowModal1(false)
      setShowModal2(false)
    } catch (error) {
      toast.error(error.message)
    }

  }
  const handleeditorder = (id, value) => {
    // //////console.log(id, value)
    let updatedFiles = [...history];
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i]._id === id) {
        // //////console.log("found")
        updatedFiles[i] = { ...updatedFiles[i], order: Number(value) };
        break; // Exit the loop once the file is found and updated
      }
    }
    history = updatedFiles
    setHistory(updatedFiles)

  }


  const handleeditmode = () => {



  }
  const updateorder = async () => {
    try {
      
      await axios.put(`${baseurl}/correspondence/update/${id}`, history).then(()=>{
        resett(id,true)
      }
      )
      
      // setTimeout(()=>resett(id),100)

    }

    catch (error) { 
      //////console.log(error)
    }


  }


  return (
    <>
      {/* View Task History */}
      <ToastContainer />
      <Modal className="#modal-content" style={{ width: "100%" }} show={showModal1} onHide={() => setShowModal1(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="secondary" size="sm" onClick={(e) => seteditmode(!editmode)}>Edit</Button>
          {editmode ? (<>
            <Button variant="secondary" size="sm" onClick={(e) => updateorder(e)}>Update Order</Button></>) : (null)}

          <Table responsive className="align-items-center table-flush">
            <thead className="thead-light">
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Created At</th>
                <th scope="col">Description</th>
                <th scope="col">File Name</th>
                <th scope="col">File</th>
              </tr>
            </thead>
            <tbody>
              {history.length == 0 ? (<h1>No Files Added</h1>) : (<>
                {/* {(history.sort((a,b)=>a.order-b.order)).map((row) => ( */}
                  {history.map((row) => (
                  <tr key={row._id}>
                    <td style={{ maxWidth: "100px", cursor: "pointer" }}>
                      {editmode ? (<>
                        <Form.Control  required type="text" placeholder="Project Name" value={row.order} onChange={(e) => handleeditorder(row._id, e.target.value)} />
                      </>) : (<p>{row.order}</p>)}
                    </td>
                    <td>{row.date}</td>
                    <td>{row.description}</td>
                    <td>{row.filename}</td>
                    <td>{row.current != "" ? (<a href={row.current} download={"hi.txt"} style={{ textDecoration: "underline", color: "blue" }}>Link</a>) : (null)}</td>
                    <td>
                      {/* <Button variant="danger" size="sm" onClick={() => handledeletetaskhistory(row)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                        <Button variant="info" size="sm" onClick={()=> handleedittaskHistory(row)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button> */}
                    </td>
                    {/* <td><pre>{row.taskHistory.taskDescription}</pre></td> */}
                  </tr>
                ))}
              </>
              )
              }
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShowModal1(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Task History */}
      <Modal className="#modal-content" style={{ width: "100%" }} show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="editHeading">
            <textarea rows="8" style={{ width: "100%" }} value={texthistory} onChange={(e) => setTextHistory(e.target.value)} />
          </Form.Group>


        </Modal.Body>
        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShowModal2(false)}>
            Cancel
          </Button>
          <Button style={{ backgroundColor: "greenyellow" }} variant="secondary" onClick={handleedithistorysubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default ViewCorrHistory
