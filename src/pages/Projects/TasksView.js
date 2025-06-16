import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, SplitButton, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, wards, companies } from "../../api";
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory, useParams, Link } from 'react-router-dom';
import { fetchProjects } from "../../features/projectslice";
import Multiselect from "../../components/Multiselect";
import { check, timeinIndia } from '../../checkloggedin.js';
import { Dropdown, ModalBody } from 'react-bootstrap';
import History from "./History.js";
import AddTaskHistory from "../components/AddTaskHistory";
import ViewTaskHistory from "../components/ViewTaskHistory";
import ViewTasks from "../Tasks/viewTasks";
const TasksView = ({ projects, ProjectFilter, handleprojectFetch, users }) => {
    const [temp, settemp] = useState(2)
    const [project, setProject] = useState(null)
    const [showModal1, setShowModal1] = useState(false);
    const [tasks, setTasks] = useState([])
    const [filtertasks, setfiltertasks] = useState([])
    const [history, setHistory] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [taskid, seteditTaskid] = useState("")
    const [showModal2, setShowModal2] = useState(false);

    useEffect(() => {
        handleFetch()
    }, [])
    const handleFetch = async (e) => {
        if (e) {
            e.preventDefault()
        }
        try {
            const response = await axios.put(`${baseurl}/task/filter`, {
                // projectid: undefined,
                // assignTaskTo: undefined,
                // taskCompleted: undefined
            });
            setTasks(response.data);
            //console.log(response.data)

        } catch (error) {
            //console.error(error);
        }
    };
    const handleEditModal = (item) => {
        const filteredTasks = tasks.filter((task) => task.projectid === item._id)
        setProject(projects.find((project) => project._id === item._id))
        console.log(filteredTasks)
        setfiltertasks(filteredTasks)
        setShowModal(true)
    }

    const handletaskhistory = async (row) => {
        //////////////////console.log("hi")
        try {
            // fetching all Histories of one task
            let response = await axios.get(`${baseurl}/history/${row._id}`)
            let temp = []
            console.log(response.data)

            for (let i = 0; i < response.data.length; i++) {
                let res = await axios.get(`${baseurl}/history/single/${(response.data)[i]._id}`)
                temp.push(res.data)
                //////////////////console.log(temp)
            }
            setHistory(temp)
            // setProject(row._id)
            console.log(history)


        } catch (error) {
            //////////////////console.log(error)
        }
        setShowModal1(true)
    }
    const handleaddhistory = async (row) => {
        // ////////////////console.log(row._id)

        seteditTaskid(row._id)
        setShowModal2(true)
        // dispatch(addtaskhistory("hi"))

    }
    const getUsernameById = (assignTaskTo) => {
        let str = "";
        for (let i = 0; i < assignTaskTo.length; i++) {
            for (let j = 0; j < users.length; j++) {
                if (users[j]._id === assignTaskTo[i]) {
                    str = str + users[j].username + " ";
                    break;
                }
            }
        }
        return str;
    };


    return (
        <>
            <ProjectFilter />
            <section>
                <Container>
                    <Row>
                        {/* Searching */}
                        <Col xs={12}
                            className="mx-auto">
                            <Card
                            // style={{ marginLeft: "-5%", width: 'max-content', zIndex: "7" }} border="light" className="shadow-sm"
                            >
                                <Card.Header>
                                    <Row className="align-items-center">
                                        <Col>
                                            <h5>Service List</h5>
                                        </Col>
                                        <Col className="text-end">
                                            <Button variant="secondary" size="sm">Add</Button>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Table responsive className="align-items-center table-flush">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col" onClick={() => settemp(temp === 1 ? 2 : 1)}>Date</th>
                                            <th scope="col">Project Name</th>
                                            <th scope="col">Project Status</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {data.slice(startIndex, endIndex).map((row, index) => ( */}
                                        {projects && projects.sort((a, b) => {
                                            if (temp === 1) {
                                                return new Date(a.date) - new Date(b.date); // Ascending order
                                            } else if (temp === 2) {
                                                return new Date(b.date) - new Date(a.date); // Descending order
                                            }
                                            return 0;
                                        }).map((row, index) => (
                                            <tr key={index}>
                                                {/* <td style={{ maxWidth: "10px", cursor: "pointer" }} onClick={()=>handleRedirect(row._id)}>{startIndex + index + 1}</td> */}

                                                <td style={{ border: "1px solid black", width: "10px", cursor: "pointer" }} onClick={() => handlegreyirect(row._id)}>{index + 1}</td>
                                                <td style={{ border: "1px solid black", width: "10px", cursor: "pointer", whiteSpace: "pre-wrap" }}>
                                                    {new Date(row.createdAt).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric' // 4-digit year
                                                    })}
                                                </td>
                                                <td style={{ border: "1px solid black", maxWidth: "20px", width: "1px", cursor: "pointer", whiteSpace: "pre-wrap" }}>
                                                    <Link
                                                        to={`/projects/${row._id}`}
                                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {row.name}
                                                    </Link>
                                                </td>
                                                <td
                                                    style={{
                                                        border: "1px solid black",
                                                        width: "600px",
                                                        fontSize: "18px",

                                                        cursor: "pointer",
                                                        whiteSpace: "pre-wrap",
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    {tasks
                                                        ?.filter(task => task.projectid === row._id)
                                                        .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
                                                        .map((task, index) => (
                                                            index < 4 ? (
                                                                <>
                                                                    <div style={{ fontSize: "15px", textDecoration: "underline", color: "blue" }}>{timeinIndia(task.CreatedAt)}</div>
                                                                    <div style={{ border: "1px solid black", marginBottom: "5px", borderRadius: "5px", fontWeight: "bolder", }} key={task._id}>{task.taskSubject}</div>
                                                                </>
                                                            ) : null
                                                        ))
                                                    }
                                                </td>
                                                <td
                                                    style={{
                                                        border: "1px solid black",
                                                        width: "10px",
                                                        fontSize: "18px",
                                                        textAlign: "left"
                                                        // fontWeight: "bolder",
                                                        // cursor: "pointer",
                                                        // whiteSpace: "pre-wrap",
                                                    }}

                                                >
                                                    <Button onClick={() => {
                                                        const scrollY = window.scrollY;

                                                        sessionStorage.setItem("scrollPosition", scrollY);
                                                        setProject(row)
                                                        handleEditModal(row)
                                                    }}>View all</Button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {/* <tfoot>
                          <tr>
                            <td colSpan="8">
                              <div className="d-flex justify-content-center mt-3">
                                <Button
                                  variant="light"
                                  disabled={currentPage === 0}
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  className="me-2"
                                >
                                  <FontAwesomeIcon icon={faAngleLeft} />
                                </Button>
                                <Button
                                  variant="light"
                                  disabled={currentItems.length < itemsPerPage}
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  className="ms-2"
                                >
                                  <FontAwesomeIcon icon={faAngleRight} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tfoot> */}
                                </Table>


                            </Card>
                        </Col>
                    </Row>

                </Container>
            </section>
            <Modal
                style={{ overflowX: "scroll" }}
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    handleFetch()
                    handleprojectFetch();
                    setTimeout(() => {
                        const scrollY = sessionStorage.getItem("scrollPosition");
                        ;
                        if (scrollY !== null) {
                            window.scrollTo(0, parseInt(scrollY));
                        }
                    }, 100);
                }}
            >
                <ViewTasks ptbf={project?._id} />
                {/* <ModalBody>
                </ModalBody> */}


            </Modal>
        </>
    )
}

export default TasksView
