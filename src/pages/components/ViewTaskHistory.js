import React, { useEffect, useState } from 'react'
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseurl } from "../../api";
import axios from "axios";
import { check, checkpermission, downloadFile, timeinIndia } from '../../checkloggedin';
import AddTaskHistory from './AddTaskHistory';

const ViewTaskHistory = ({ project, history, setHistory, taskid, showModal1, setShowModal1, getUsernameById, handleFetch, settrigger, trigger }) => {

  const [showModal2, setShowModal2] = useState(false)
  const [texthistory, setTextHistory] = useState('')
  const [taskhistoryid, setTaskhistoryId] = useState('')
  const [filteredFiles, setFilteredFiles] = useState(project?.files)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [show, setshow] = useState(false)
  const [showModal3, setShowModal3] = useState(false)
  useEffect(() => {
    setFilteredFiles(project?.files)
  }, [project])
  const handledeletetaskhistory = async (row) => {

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseurl}/history/${row._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        console.log(row._id)
        let temp = history.filter((item) =>
          item._id != row._id
        )
        setHistory(temp);
      })
      handleFetch()
      settrigger(!trigger)
      toast.success("History deleted successfully");
      // setShowModal1(false)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  const handleedittaskHistory = async (row) => {

    setShowModal2(true)
    setTaskhistoryId(row._id)
    setTextHistory(row.taskDescription)
    setSelectedFiles(row.files)

  }
  const handleedithistorysubmit = async () => {
    settrigger(!trigger)
    let temp = ""
    try {
      const editData = {
        taskDescription: texthistory,
        files: selectedFiles
      };
      const token = localStorage.getItem('token');
      await axios.put(`${baseurl}/history/${taskhistoryid}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        let temp = history.map((item) =>
          item._id === res.data.taskHistory._id ? res.data.taskHistory : item
        )
        setHistory(temp);
      })

      toast.success("History updated successfully");
      // setShowModal1(false)
      setShowModal2(false)
    } catch (error) {
      toast.error(error.message)
    }

  }
  const handleFileAddChange = (id) => {
    for (let i = 0; i < selectedFiles.length; i++) {

      if (selectedFiles.includes(id)) {
        toast.error("Already Added")
        return;
      }
    }

    // setSelectedValue(id);
    setSelectedFiles((prevSelected) => [...prevSelected, id]);
    toast.success("Added Successfully");
  };
  const handleRemove = (id) => {
    // for()
    const newSelected = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i] !== id) {
        newSelected.push(selectedFiles[i]);
      }
    }
    setTimeout(() => {
      setSelectedFiles(newSelected);
    }, 50);
  };

  return (
    <>
      {/* View Task History */}
      <ToastContainer />
      <Modal className="#modal-content" style={{ width: "100%" }} show={showModal1} onHide={() => {
        // handleFetch()
        setShowModal1(false)
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive className="align-items-center table-flush">
            {history.map((row) => (
              <>
                <div style={{ border: "1px solid black", borderRadius: "5px", }}>
                  <div style={{ fontWeight: "bold", display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ textAlign: "left", fontWeight: "bold", fontSize: "20px" }}>{row.user ? getUsernameById([row.user]) : "User"}</p>
                    <p style={{ textAlign: "left", fontWeight: "bold", fontSize: "20px" }}>{timeinIndia(row.CreatedAt)}</p>

                      <div>
                        <Button style={{ color: "black", backgroundColor: "aqua" }} variant="info" size="sm" onClick={() => handleedittaskHistory(row)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        {check()[1]=="john_doe" && (<Button style={{ color: "black", backgroundColor: "aqua" }} variant="danger" size="sm" onClick={() => handledeletetaskhistory(row)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>)}
                      </div>
               
                  </div>

                  <pre style={{ color: "black", padding: "5px",whiteSpace:"pre-wrap"}}>{row?.taskDescription}
                  </pre>
                  <ol>
                    {row?.files?.map((id) => {
                      const tempfile = project?.files?.find(file => file._id === id)
                      return (<li onClick={() => downloadFile(tempfile.current, tempfile.filename + "." + (tempfile?.current).split(".").pop())} style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>{project?.files?.find(file => file._id === id)?.filename}  </li>

                      )
                    })}
                  </ol>

                </div>
              </>))}

            {/* <thead className="thead-light">
                    <tr>
                      <th scope="col">Created At</th>
                      <th scope="col">History Description</th>
                      <th scope="col">User</th>
                      <th scope="col">Files</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row) => (
                      <tr key={row._id}>
                        <td>{row.CreatedAt}
                        <Button variant="danger" size="sm" onClick={() => handledeletetaskhistory(row)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                          <Button variant="info" size="sm" onClick={()=> handleedittaskHistory(row)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </td>
                        <td><pre>{row.taskDescription}</pre></td>
                        <td>{row.user}</td>
                      </tr>
                    ))}
                  </tbody> */}
          </Table>
        </Modal.Body>
        <Modal.Footer>



          <AddTaskHistory handleFetch={handleFetch} project={project} taskid={taskid} showModal2={showModal3} setShowModal2={setShowModal3} settrigger={settrigger} trigger={trigger} />


          <Button style={{ backgroundColor: "greenyellow" }} variant="secondary" onClick={() => settrigger(!trigger)}>
            Refresh
          </Button>
          <Button style={{ backgroundColor: "greenyellow" }} variant="secondary" onClick={() => setShowModal3(true)}>
            Add Task
          </Button>
          <Button variant="secondary" onClick={() => setShowModal1(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Task History */}
      <Modal className="#modal-content" style={{ width: "100%" }} show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="editHeading">
            <h1>Task Description</h1>

            <textarea rows="8" style={{ width: "100%" }} value={texthistory} onChange={(e) => setTextHistory(e.target.value)} />
          </Form.Group>
          <ol>
            {selectedFiles?.map((id) => (
              <li style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>{project?.files?.find(file => file._id === id)?.filename}  <button onClick={(e) => {
                e.preventDefault();
                handleRemove(id)
              }} style={{ marginLeft: '5px', marginTop: '10px' }}>x</button></li>

            ))}
          </ol>
          <Modal.Footer>

            <Button variant="secondary" onClick={() => setShowModal2(false)}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: "greenyellow" }} variant="secondary" onClick={handleedithistorysubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
          <Form.Group className="mb-3" controlId="editHeading">
            <h1>Files</h1>
            <InputGroup>
              <Form.Control type="text" placeholder="Search Files" onChange={(e) => {
                const searchValue = e.target.value;
                const regex = new RegExp(searchValue, 'i');
                const filteredFiles = searchValue != '' ? project?.files?.filter(row => regex.test(row?.filename)) : project?.files
                setFilteredFiles(filteredFiles);
              }} />
            </InputGroup>
            <ul>
              {filteredFiles?.map((row) => (
                <li onClick={() => handleFileAddChange(row._id)} style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>{row.filename}</li>
              ))}
            </ul>
          </Form.Group>

        </Modal.Body>

      </Modal>

    </>
  )
}

export default ViewTaskHistory
