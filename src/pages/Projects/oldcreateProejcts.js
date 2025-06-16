import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, Modal, InputGroup } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, companies } from "../../api";
import { useHistory, useParams, Link } from 'react-router-dom';
import Multiselect from "../../components/Multiselect";

const Comp = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectStatus, setEditProjectStatus] = useState('');
  const [editProjectId, setEditProjectId] = useState('');
  let history = useHistory();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseurl}/projects`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleEditModal = (item) => {
    const scrollY = window.scrollY;
    sessionStorage.setItem("scrollPosition", scrollY);

    setEditProjectId(item._id);
    setEditProjectName(item.name);
    setEditProjectStatus(item.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY !== null) {
      window.scrollTo(0, parseInt(scrollY));
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${baseurl}/project/${editProjectId}`, {
        name: editProjectName,
        status: editProjectStatus,
      });
      toast.success("Project updated successfully");
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  return (
    <>
      <ToastContainer />
      <Breadcrumb>
        <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
        <Breadcrumb.Item>Projects</Breadcrumb.Item>
        <Breadcrumb.Item active>Manage Projects</Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Project Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.status}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleEditModal(item)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} restoreFocus={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" value={editProjectName} onChange={(e) => setEditProjectName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Status</Form.Label>
              <Form.Select value={editProjectStatus} onChange={(e) => setEditProjectStatus(e.target.value)}>
                {ProjectStatus.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Comp;
