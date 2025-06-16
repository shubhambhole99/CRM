import React, { useState, useEffect, useRef } from "react";
import { fetchProjects } from "../../features/projectslice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { baseurl, ProjectStatus, wards, companies } from "../../api";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, SplitButton, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import Projectwise from "./Projectwise.js";
import Userwise from "./Userwise.js"; // Assuming you have a Userwise component
import Multiselect from "../../components/Multiselect";
import { check, dateinIndia, timeinIndia } from '../../checkloggedin.js';
import { getAllBuckets, deleteTaskFromBucket } from "../../features/bucketslice";  // Import your action
import ViewTasks from "./viewTasks.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHolding, faEdit, faTicketAlt, faThumbsUp, faThumbsDown, faBoxOpen } from "@fortawesome/free-solid-svg-icons";

const Kanban = () => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    // States
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [buckets, setBuckets] = useState([]);
    const [view, setView] = useState('projectwise'); // New state for managing view
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [dateordeadline, setdateordeadline] = useState("date")

    // Filters
    const [companyname, setCompanyName] = useState('');
    const [regu, setregu] = useState('');
    const [feactive, setfeactive] = useState('');
    const [people, setPeople] = useState([]);
    const [isDisabled, setIsDisabled] = useState('');
    const [name, setName] = useState('');
    const [pid, setPid] = useState('');
    const [task, settask] = useState(null);
    const [trigger, setTrigger] = useState(false);
    const [position, setPostition] = useState({ scrollX: 0, scrollY: 0 })
    const [ppid, setppid] = useState('')
    // Task 
    const [taskstatus, setTaskStatus] = useState("false");

    // Api
    useEffect(() => {
        // Projects
        dispatch(fetchProjects({
            isDisabled: false,
        })).then((resp) => {
            setProjects(resp);

        });
        // Users
        axios.get(`${baseurl}/user/`)
            .then(response => {
                setUsers(response.data);

            });
        // Tasks
        axios.put(`${baseurl}/task/filter`, {
            projectid: undefined,
            assignTaskTo: undefined,
            taskCompleted: undefined
        }).then(response => {
            setTasks(response.data);

        });
        // Bucket
        dispatch(getAllBuckets()).then((resp) => {
            setBuckets(resp);

            // console.log(buckets);
        });  // Await the dispatch to get the data
    }, [trigger]);
    const findprojectname = (id) => {
        //////////////////console.log(id,pnamearr)
        for (let i = 0; i < projects.length; i++) {
            if (projects[i]._id === id) {
                return projects[i].name
            }
        }
    }

    const Task = ({ task }) => {
        if (!task) return null;
        return (
            <div key={task._id} style={{
                width: "300px",
                backgroundColor: !task?.taskCompleted ? (new Date(task.deadline) < new Date() ? "#ffa693" : "transparent") : "rgb(157, 250, 157)",
                borderRadius: "20px",
                padding: "20px",
                border: "1px solid grey",
                fontSize: "18px",
                marginTop: "5px"
            }}>

                <p onClick={() => openHistory(task)} style={{ fontWeight: "bolder", color: "blue", textDecoration: "underline", cursor: "pointer" }}>{task?.taskSubject ? task.taskSubject : "No Subject"}</p>
                <p>Created At: {timeinIndia(task?.CreatedAt)}</p>
                <p>Deadline: {dateinIndia(task?.deadline)}</p>

                <p style={{ textDecoration: "underline" }}>{task?.assignTaskTo.map(userId => users.find(user => user._id === userId)?.username).join(", ")}-{findprojectname(task.projectid)}</p>
                <pre style={{ whiteSpace: "pre-wrap" }}>{task?.taskDescription}</pre>
                <Button onClick={() => editTask(task)} variant="info">
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button onClick={() => addbucktotask(task)} variant="success">
                    <FontAwesomeIcon icon={faBoxOpen} />
                </Button>
                {task?.taskCompleted ? (
                    <Button onClick={(e) => handleComplete(e, task?._id)} variant="secondary">
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </Button>
                ) : (
                    <Button onClick={(e) => handleComplete(e, task?._id)} variant="danger">
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </Button>
                )}

            </div>


        )

    }
    const openHistory = (task) => {
        setShowModal(true);
        settask(task);


    }
    const editTask = (task) => {
        setShowModal1(true);
        settask(task);

    }
    const addbucktotask = (task) => {
        setShowModal2(true);
        settask(task);
    }

    const addtask = (ptbf) => {
        setShowModal3(true)
        setppid(ptbf)
    }

    const handleComplete = (e, id) => {
        e.preventDefault();
        // Find the task with the given id and toggle its completion status locally
        const updatedData = tasks.map(item => {
            if (item._id === id) {
                return { ...item, taskCompleted: !item.taskCompleted };
            }
            return item;
        });

        // Update the state with the modified data

        // Make the PUT request to update the task completion status on the server
        axios.put(`${baseurl}/task/complete/${id}`)
            .then(response => {
                // Handle success response if needed
                setTasks(updatedData);

            })
            .catch(error => {
                // If the request fails, revert the local state change
                //console.error(error);
                // setData(data); // Revert back to the original data
            });
    };


    const ProjectFilter = () => {
        return (
            <Row>
                {/* Searching */}
                <Col xs={12} md={3}>
                    <Form.Group id="cname" className="mb-4">
                        <Form.Label>Company Name</Form.Label>
                        <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Select required value={companyname} onChange={(e) => {
                                setCompanyName(e.target.value);
                            }}>
                                <option value="">Select Option</option>
                                {companies.map((company, index) => (
                                    <option key={index} value={company}>
                                        {company}
                                    </option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group id="cname" className="mb-4">
                        <Form.Label>Regulation</Form.Label>
                        <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Select value={regu} onChange={(e) => {
                                setregu(e.target.value);
                            }}>
                                <option value="">Select Option</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group id="taskstatus" className="mb-4">
                        <Form.Label>Project Status</Form.Label>
                        <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Select value={feactive} onChange={(e) => {
                                setfeactive(e.target.value);
                            }}>
                                <option value="">Select Option</option>
                                {ProjectStatus.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    {check()[1] === 'john_doe' ? (
                        <Form.Group id="taskstatus" className="mb-4">
                            <Form.Label>isDisabled</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={isDisabled} onChange={(e) => {
                                    setIsDisabled(e.target.value);
                                }}>
                                    <option value="">Select Option</option>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    ) : (<p>{check()[1]}</p>)}
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group id="taskstatus" className="mb-4">
                        <Form.Label>Project Name</Form.Label>
                        <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Select value={pid} onChange={(e) => {
                                setPid(e.target.value);
                            }}>
                                <option value="">Select Option</option>
                                {projects.filter((project) => (pid == "" || project._id === pid) &&
                                    (companyname === "" || project.company === companyname) &&
                                    // (regu === "" || project.regu === regu) &&
                                    // (isDisabled === "" || project.isDisabled === isDisabled)
                                    ((new RegExp(name, 'i')).test(project.name)) &&
                                    (feactive == "" || project.status === feactive)).map((option, index) => (
                                        <option key={index} value={option._id}>{option.name}</option>
                                    ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <>
                        {/* <Form.Group id="taskstatus" className="mb-4"> */}
                        <Form.Label>Project Search</Form.Label>
                        <Form.Group controlId="editFileName">
                            <Form.Control
                                ref={inputRef}
                                type="text"
                                placeholder="File Name or Date"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setTimeout(() => {
                                        inputRef.current?.focus(); // Retains focus without autofocus
                                    }, 0);
                                }
                                }
                            />
                            {/* </InputGroup> */}
                        </Form.Group>
                    </>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group id="taskstatus" className="mb-4">
                        <Form.Label>Task Status</Form.Label>
                        <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Select value={taskstatus} onChange={(e) => setTaskStatus(e.target.value)}>
                                <option value="">Select Option</option>
                                <option value="true">Complete</option>
                                <option value="false">Incomplete</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group id="view" className="mb-4">
                        <Form.Label>View</Form.Label>
                        <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Select value={view} onChange={(e) => {
                                setView(e.target.value);
                            }}>
                                <option value="projectwise">Projectwise</option>
                                <option value="userwise">Userwise</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group id="view" className="mb-4">
                        <Form.Label>Sort by Date or Deadline</Form.Label>
                        <InputGroup>
                            <InputGroup.Text></InputGroup.Text>
                            <Form.Select value={dateordeadline} onChange={(e) => {
                                setdateordeadline(e.target.value);
                            }}>
                                 <option value="date">Date</option>
                                 <option value="deadline">Deadline</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </Col>
         
                <Col xs={12} md={3}>
                    <Form.Group className="mb-3" controlId="editIsActive">
                        {users ? (<Multiselect
                            selectedValues={people}
                            setSelectedValues={setPeople}
                            options={users} />) : (
                            <p>loading</p>
                        )}
                    </Form.Group>
                </Col>
              
                <Col xs={12} md={3} className="d-flex justify-content-center">
                    <Button onClick={(e) => {
                        e.preventDefault();
                    }} style={{ height: "70px" }} variant="primary" type="submit" className="w-100 mt-3">
                        Submit
                    </Button>
                </Col>


            </Row>
        );
    };

    return (
        <>
            <ProjectFilter />
            {projects ? (
                <>
                    {view === 'projectwise' ? (
                        <Projectwise projects={projects.filter((project) => (pid == "" || project._id === pid) &&
                            (companyname === "" || project.company === companyname) &&
                            // (regu === "" || project.regu === regu) &&
                            // (isDisabled === "" || project.isDisabled === isDisabled)
                            ((new RegExp(name, 'i')).test(project.name)) &&
                            (feactive == "" || project.status === feactive))}
                            users={users.filter((user) => user.status === "active")}
                            tasks={tasks
                                .sort((a, b) => dateordeadline === "date" ? new Date(b.CreatedAt) - new Date(a.CreatedAt) : new Date(a.deadline) - new Date(b.deadline))
                                .filter((task) => (pid === "" || task.projectid === pid) &&
                                    (taskstatus === "" || task?.taskCompleted === (taskstatus === "true")) &&
                                    (task.isDisabled === false)
                                )}
                            //    taskstatus==""||task.taskCompleted==taskstatus)
                            addtask={addtask}
                            buckets={buckets}
                            openHistory={openHistory}
                            editTask={editTask}
                            Task={Task} />
                    ) : (
                        <Userwise
                            projects={projects.filter((project) => (pid == "" || project._id === pid) &&
                                (companyname === "" || project.company === companyname) &&
                                // (regu === "" || project.regu === regu) &&
                                // (isDisabled === "" || project.isDisabled === isDisabled)
                                ((new RegExp(name, 'i')).test(project.name)) &&
                                (feactive == "" || project.status === feactive))}
                            users={users.filter((user) => user.status === "active")}
                            tasks={tasks
                                .sort((a, b) => dateordeadline === "date" ? new Date(b.CreatedAt) - new Date(a.CreatedAt) : new Date(a.deadline) - new Date(b.deadline))
                                .filter((task) => (pid === "" || task.projectid === pid) &&
                                    (taskstatus === "" || task?.taskCompleted === (taskstatus === "true")) &&
                                    (task.isDisabled === false)
                                )}
                            buckets={buckets}
                            Task={Task}
                        />
                    )}
                </>
            ) : (null)}

            <Modal
                style={{ overflowX: "scroll" }}
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setTrigger(!trigger);

                }}
            >
                <Modal.Header>
                    <Modal.Title>View Task History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewTasks ptbf={task?.projectid} taskdetails={task} openhistorymodal={true} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false)
                        setTrigger(!trigger);

                    }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                style={{ overflowX: "scroll" }}
                show={showModal1}
                onHide={() => {
                    setShowModal1(false);
                    setTrigger(!trigger);
                }}
            >
                <Modal.Header>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewTasks ptbf={task?.projectid} taskdetails={task} editmodal={true} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal1(false)
                        setTrigger(!trigger);

                    }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>



            <Modal
                style={{ overflowX: "scroll" }}
                show={showModal2}
                onHide={() => {
                    setShowModal2(false);
                    setTrigger(!trigger);
                }}
            >
                <Modal.Header>
                    <Modal.Title>Add To Bucket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewTasks ptbf={task?.projectid} taskdetails={task} addtobucket={true} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal2(false)
                        setTrigger(!trigger);

                    }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                style={{ overflowX: "scroll" }}
                show={showModal3}
                onHide={() => {
                    setShowModal3(false);
                    setTrigger(!trigger);

                }}
            >
                <Modal.Header>
                    <Modal.Title>View Tasks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewTasks ptbf={ppid} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal3(false)
                        setTrigger(!trigger);

                    }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Kanban;
