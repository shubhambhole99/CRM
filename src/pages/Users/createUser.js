import React, { useState, useEffect } from "react";
import axios from "axios";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseurl, ProjectStatus, wards, companies } from "../../api";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, SplitButton, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';

const Comp = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [isDisabled,setIsDisabled] = useState(false)
    // Edit
    const [editid, setEditId] = useState('');
    const [editusername, setEditUsername] = useState('');
    const [editemail, setEditEmail] = useState('');
    const [editpassword, setEditPassword] = useState('');
    const [editrole, setEditRole] = useState('');
    const [editstatus, setEditStatus] = useState('');

    // Create User
    const [createusername, setCreateUsername] = useState('');
    const [createemail, setCreateEmail] = useState('');
    const [createpassword, setCreatePassword] = useState('');
    const [createrole, setCreateRole] = useState('');

    // Filter and Search
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        axios.get(`${baseurl}/user/`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
            });
    };

    const handleEditModal = (row) => {
        setEditId(row._id);
        setEditUsername(row.username);
        setEditEmail(row.email);
        setEditRole(row.role);
        setEditStatus(row.status);
        setShowModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        let editData = {
            username: editusername,
            email: editemail,
            role: editrole,
            password: editpassword,
            status: editstatus
        };
        try {
            axios.put(`${baseurl}/user/${editid}`, editData).then(() => {
                getUsers();
                setShowModal(false);
                toast.success("User Edited Successfully");
            });
        } catch (e) {
        }
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        let createData = {
            username: createusername,
            email: createemail,
            role: createrole,
            password: createpassword
        };
        try {
            axios.post(`${baseurl}/user/create`, createData).then(() => {
                getUsers();
                setCreateUsername('');
                setCreateEmail('');
                setCreateRole('');
                setCreatePassword('');
                toast.success("User Created Successfully");
            });
        } catch (e) {
        }
    };

    const handleDelete = (id) => {
        
            axios.delete(`${baseurl}/user/${id}`)
                .then(() => {
                    getUsers();
                    toast.success("User Deleted Successfully");
                })
                .catch(error => {
                    toast.error("Error Deleting User");
                });
        
    };

    const filteredUsers = users.filter(user => {
        return (
            (!filterStatus || (filterStatus === 'isDisabled' ? user.isDisabled : user.status === filterStatus)) &&
            (!searchTerm || user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!isDisabled || user.isDisabled === (isDisabled === 'true'))
        );
    });

    return (
        <>
            <Tab.Container defaultActiveKey="view">
                <Nav style={{ display: "flex", flexDirection: "row" }} fill variant="pills" className="flex-column flex-sm-row">
                    <Nav.Item>
                        <Nav.Link eventKey="view" className="mb-sm-3 mb-md-0">
                            View Users
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
                            Create User
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="view" className="py-4">
                        <section>
                            <Container>
                                <Row>
                                    <Col xs={12} className="mx-auto">
                                        <Card>
                                            <Card.Header>
                                                <Row className="align-items-center">
                                                    <Col>
                                                        <h5>Users List</h5>
                                                </Col>
                                                   
                                                </Row>
                                                <Row className="align-items-center mt-3">
                                                    <Col>
                                                        <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                                    </Col>
                                                    <Col>
                                                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                                            <option value="">All Status</option>
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </Form.Select>
                                                    </Col>
                                                    <Col>
                                                        <Form.Select value={isDisabled} onChange={(e) => setIsDisabled(e.target.value)}>
                                                            <option value="">All Status</option>
                                                            <option value={false}>False</option>
                                                            <option value={true}>True</option>
                                                        </Form.Select>
                                                    </Col>
                                                </Row>
                                            </Card.Header>
                                            <Table responsive className="align-items-center table-flush">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Username</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Role</th>
                                                        <th scope="col">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredUsers && filteredUsers.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td style={{ whiteSpace: "pre-wrap" }}>
                                                                {new Date(row.actualCreatedAt).toLocaleDateString('en-IN', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric'
                                                                })}
                                                            </td>
                                                            <td>{row.username}</td>
                                                            <td>{row.email}</td>
                                                            <td>{row.role}</td>
                                                            <td>
                                                                <Button variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Button>
                                                                <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            <Modal
                                                style={{ overflowX: "scroll" }}
                                                show={showModal1}
                                                onHide={() => {
                                                    setShowModal1(false);
                                                }}
                                            >
                                                <Modal.Header>
                                                    <Modal.Title>Edit User</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="primary" onClick={(e) => {
                                                        handleEditSubmit(e)
                                                    }}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="secondary" onClick={() => {
                                                        setShowModal1(false)
                                                    }}>
                                                        Cancel
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    </Tab.Pane>
                    <Tab.Pane eventKey="home" className="py-4">
                        <section>
                            <Container>
                                <Row className="justify-content-center">
                                    <Col xs={12} md={8} lg={6} className="mx-auto">
                                        <Card>
                                            <Card.Header>
                                                <Row className="align-items-center">
                                                    <Col>
                                                        <h5>Create User</h5>
                                                    </Col>
                                                    <Col className="text-end">
                                                        <Button variant="secondary" size="sm">See all</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form>
                                                    <Form.Group className="mb-3" controlId="createUsername">
                                                        <Form.Label>UserName</Form.Label>
                                                        <Form.Control type="text" value={createusername} onChange={(e) => setCreateUsername(e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="createEmail">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control type="text" value={createemail} onChange={(e) => setCreateEmail(e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="createRole">
                                                        <Form.Label>Role</Form.Label>
                                                        <Form.Select required value={createrole} onChange={(e) => setCreateRole(e.target.value)}>
                                                            <option value="">Select Option</option>
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="createPassword">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="text" value={createpassword} onChange={(e) => setCreatePassword(e.target.value)} />
                                                    </Form.Group>
                                                    <Button variant="primary" onClick={(e) => handleCreateUser(e)}>
                                                        Create User
                                                    </Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Edit Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="editHeading">
                            <Form.Label>UserName</Form.Label>
                            <Form.Control type="text" value={editusername} onChange={(e) => setEditUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDescription">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={editemail} onChange={(e) => setEditEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDescription">
                            <Form.Label>Role</Form.Label>
                            <Form.Select required value={editrole} onChange={(e) => setEditRole(e.target.value)}>
                                <option value="">Select Option</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDescription">
                            <Form.Label>Status</Form.Label>
                            <Form.Select required value={editstatus} onChange={(e) => setEditStatus(e.target.value)}>
                                <option value="">Select Option</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="disabled">Disabled</option>
                                <option value="isDisabled">isDisabled</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDescription">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" value={editpassword} onChange={(e) => setEditPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={(e) => handleEditSubmit(e)}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Comp;
