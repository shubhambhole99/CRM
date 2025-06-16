import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../api";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { check, checkpermission, downloadFile } from '../../checkloggedin';

const Comp = ({ trigger,settrigger,project, taskid, showModal2, setShowModal2, handleFetch }) => {

  const [texthistory, setaddtexthistory] = useState("")
  const [filteredFiles, setFilteredFiles] = useState(project?.files)
  const [selectedFiles, setSelectedFiles] = useState([])
  useEffect(() => {
    setFilteredFiles(project?.files)
  }, [project])
  const handleaddhistorysubmit = async (e) => {
    e.preventDefault()
    settrigger(!trigger)
    const token = localStorage.getItem('token');
    const editData = {
      taskDescription: texthistory,
      user: check()[0],
      files: selectedFiles
    };

    try {
      await axios.post(`${baseurl}/history/create/${taskid}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        handleFetch()
        settrigger(!trigger)
      });

      toast.success("History Added Succesfully");
      setShowModal2(false);
      setaddtexthistory("")
    } catch (error) {
      //console.error(error);
      toast.error("Failed to add history");
    }
  }
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


  return (
    <>
      <ToastContainer />
      <Modal className="#modal-content" style={{ width: "100%" }} show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="editHeading">
            <textarea rows="8" style={{ width: "100%" }} value={texthistory} onChange={(e) => setaddtexthistory(e.target.value)} />
          </Form.Group>


          <ol>
            {selectedFiles?.map((id) => (
              <div>
                <li onClick={() => downloadFile(project?.files?.find(file => file._id === id)?.current, project?.files?.find(file => file._id === id)?.filename + "." + (project?.files?.find(file => file._id === id)?.current).split(".").pop())} style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>{project?.files?.find(file => file._id === id)?.filename}</li>
                <button onClick={(e) => {
                  e.preventDefault();
                  handleRemove(id)
                }}
                  style={{ marginLeft: '5px', marginTop: '10px' }}>x</button>
              </div>


            ))}
          </ol>
          <Modal.Footer>


            <Button variant="secondary" onClick={() => setShowModal2(false)}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: "greenyellow" }} variant="secondary" onClick={(e) => handleaddhistorysubmit(e)}>
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
        <Modal.Footer>

        </Modal.Footer>
      </Modal>









    </>

  )
}
export default Comp;


