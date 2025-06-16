

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, companies } from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { check, checkpermission } from '../../checkloggedin';
import Multiselect from "../../components/Multiselect";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAsyncData } from '../../features/userslice'
import { deletetasks } from "../../features/taskslice";
import { addtaskhistory } from "../../features/taskhistoryslice";
import AddTaskHistory from "../components/AddTaskHistory";
import ViewTaskHistory from "../components/ViewTaskHistory";
import { fetchProjects } from "../../features/projectslice";
import CreateTasks from "./createTasks";
import { ModalBody } from "react-bootstrap";
import AddToBucket from "./addToBucket";
import { setTrigger } from "../../features/bucketslice";
import { dateinIndia, timeinIndia } from '../../checkloggedin'

const Comp = ({ ptbf, taskdetails, openhistorymodal, editmodal, addtobucket, fromdashboard }) => {
  const [pname, setPname] = useState(ptbf ? ptbf : '');
  const [people, setPeople] = useState(fromdashboard ? check()[0] : '');
  const [pnamearr, setPnamearr] = useState([]);
  const [taskstatus, setTaskStatus] = useState(false);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [temp, settemp] = useState(2)

  // for edit
  const [taskid, seteditTaskid] = useState("")
  const [editassignTaskTo, setEditassignTaskTo] = useState([])
  const [editprojectname, setEditprojectname] = useState("")
  const [edittaskDescription, setEdittaskDescription] = useState("")
  const [edittaskSubject, setEdittaskSubject] = useState("")
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal4, setShowModal4] = useState(false)
  const [name, setName] = useState('')
  const inputRef = React.useRef(null);
  const [isDisabled, setisDisabled] = useState("false")
  // project filtering
  let [companyname, setCompanyName] = useState('')
  let [isActive, setIsActive] = useState(null)

  // view task History
  const [history, setHistory] = useState([])
  const [taskthis, settaskthis] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  let [project, setProject] = useState(null)
  let [alltaskhistory, setalltaskhistory] = useState([])
  //view add History
  const [texthistory, setaddtexthistory] = useState("")
  const [showModal2, setShowModal2] = useState(false);

  //Add tasks
  const [showModal3, setShowModal3] = useState(false);
  const [trigger, settrigger] = useState(false)
  //Created Option 
  let [createdoption, setCreatedoption] = useState(0)
  const [editdeadline, seteditDeadline] = useState(null)




  // common for all
  const dispatch = useDispatch();

  const todaystask = useSelector(state => state.bucket.today);
  // for users
  const { user1, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (openhistorymodal && taskdetails && alltaskhistory && data && pnamearr) {
      // Trigger the function if ohm exists
      handletaskhistory({ _id: taskdetails?._id, projectid: ptbf })
    }
    if (editmodal && taskdetails && alltaskhistory && data && pnamearr) {
      // Trigger the function if ohm exists
      handleEditModal(taskdetails)
    }

    if (addtobucket && taskdetails && alltaskhistory && data && pnamearr) {
      // Trigger the function if ohm exists
      handleaddtobucket(taskdetails)
    }
  }, [alltaskhistory, pnamearr]);

  useEffect(() => {
    // Users
    dispatch(fetchAsyncData())
    if (user1.length != 0) {
      setUsers(user1)
    }
    // Project
    handleprojectFetch()
    // Tasks
    handleFetch()
    // Task History
    axios.get(`${baseurl}/history/`).then((res) => {
      alltaskhistory = res.data
      setalltaskhistory(res.data)
    })
  }, [user1.length, todaystask, trigger]);



  const handleprojectFetch = async () => {
    //////////////////console.log(companyname)
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr(resp)
      ////////console.log(resp)
    }).catch(error => {

    })
  }
  const findprojectname = (id) => {
    //////////////////console.log(id,pnamearr)
    for (let i = 0; i < pnamearr.length; i++) {
      if (pnamearr[i]._id === id) {
        return pnamearr[i].name
      }
    }
  }

  const handleFetch = async (e) => {
    if (e) {
      e.preventDefault()
    }
    try {
      const response = await axios.put(`${baseurl}/task/filter`, {
        projectid: pname || ptbf || undefined,
        assignTaskTo: people ? [people] : undefined,
        taskCompleted: taskstatus || undefined
      });
      setData(response.data);
      //console.log(response.data)

    } catch (error) {
      //console.error(error);
    }
  };

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

  const handleComplete = (id) => {
    // Find the task with the given id and toggle its completion status locally
    const updatedData = data.map(item => {
      if (item._id === id) {
        return { ...item, taskCompleted: !item.taskCompleted };
      }
      return item;
    });

    // Update the state with the modified data
    setData(updatedData);

    // Make the PUT request to update the task completion status on the server
    axios.put(`${baseurl}/task/complete/${id}`)
      .then(response => {
        // Handle success response if needed
      })
      .catch(error => {
        // If the request fails, revert the local state change
        //console.error(error);
        setData(data); // Revert back to the original data
      });
  };
  const handleEditModal = (item) => {
    //////////////////console.log(item)
    let temp = []
    let tempuser = item.assignTaskTo
    for (let j = 0; j < users.length; j++) {
      if ((tempuser).includes(users[j]._id)) {
        temp.push({
          id: users[j]._id,
          name: users[j].username,
        })
      }
    }
    //////////////////console.log(temp,"hi")
    seteditTaskid(item._id)
    setEditassignTaskTo(temp)
    setEditprojectname(item.projectid)
    setEdittaskDescription(item.taskDescription)
    setEdittaskSubject(item.taskSubject)
    setShowModal(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
    seteditDeadline(new Date(item.deadline).toISOString().split("T")[0])
  }

  const handleEditSubmit = async () => {
    //////////////////console.log(taskid,"chekcing task id")
    const token = localStorage.getItem('token');
    let temp = []
    for (let i = 0; i < editassignTaskTo.length; i++) {
      temp.push(editassignTaskTo[i].id)
    }
    const editData = {
      assignTaskTo: temp,
      projectid: editprojectname,
      taskDescription: edittaskDescription,
      taskSubject: edittaskSubject,
      deadline: editdeadline
    };

    try {
      await axios.put(`${baseurl}/task/${taskid}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        handleFetch()
      })
      //////////////////console.log(response.data);
      toast.success("Task updated successfully");
      setShowModal(false);
      setEditMode(false);
      seteditTaskid("")
      setEditassignTaskTo([])
      setEditprojectname("")
      setEdittaskDescription("")
      setEdittaskSubject("")
    } catch (error) {
      //console.error(error);
      toast.error("Failed to update task");
    }
  }

  const handletaskhistory = async (row) => {

    seteditTaskid(row._id)
    let temp = alltaskhistory.filter((history) => history.taskId === row._id)
    setHistory(temp)
    let proj = pnamearr.find((project) => project._id === ptbf)
    setProject(proj)
    setShowModal1(true)
    settaskthis(true)
  }

  const handleaddhistory = async (row) => {
    // ////////////////console.log(row._id)
    setProject(pnamearr.find((project) => project._id === row.projectid))
    seteditTaskid(row._id)
    setShowModal2(true)
    // dispatch(addtaskhistory("hi"))

  }

  const handleaddtobucket = async (row) => {
    seteditTaskid(row._id)
    setShowModal4(true)

  }


  const timeinIndia = (date) => {
    const utcTime = new Date(date);
    const istTime = utcTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    return (istTime);
  }

  const AddtasktoUserBucket = async (e, taskid, uid) => {
    if (e) {
      e.preventDefault();
    }



    // const userId = check()[0]; // Assuming this returns the userId

    if (!taskid) {
      toast.error("Please select a task");
      return;
    }

    // Generate the current date
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    try {
      // Send taskId as an array since the backend expects "tasks" to be an array
      const response = await axios.post(`${baseurl}/bucket/buckets/${uid}`, {
        date: currentDate,
        tasks: [taskid],  // Send taskid as an array
      });

      if (response.status === 200) {
        if (response.data.message === "Task added to existing bucket") {
          toast.success("Task added to the existing bucket");
        } else {
          toast.success("New bucket created successfully");
        }
      } else {
        toast.error("Failed to create or update the bucket");
      }
    } catch (error) {
      console.error("Error creating/updating bucket:", error);
      toast.error("Error creating or updating bucket");
    }
  }




  return (
    <>
      <form onSubmit={(e) => handleFetch(e)}>
        <Row>
          <Col xs={12} md={4}>
            <Form.Group id="pname" className="mb-4">
              <Form.Label>Company Name</Form.Label>
              <InputGroup>
                <InputGroup.Text></InputGroup.Text>
                <Form.Select value={companyname} onChange={(e) => {
                  companyname = e.target.value
                  setCompanyName(e.target.value)
                  handleprojectFetch()
                }}>
                  <option value="">Select Option</option>
                  {companies.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
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
                  {/* Mapping through the arr array to generate options */}
                  {ProjectStatus.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
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
          <Col xs={12} md={4}>
            <Form.Group id="pname" className="mb-4">
              <Form.Label>Project name</Form.Label>
              <InputGroup>
                <InputGroup.Text></InputGroup.Text>
                <Form.Select value={pname} onChange={(e) => setPname(e.target.value)}>
                  <option value="">Select Option</option>
                  pnamearr
                  {pnamearr != undefined ? pnamearr.filter((project) =>
                    (companyname === "" || project.company === companyname) &&
                    // (regu === "" || project.regu === regu) &&
                    // (isDisabled === "" || project.isDisabled === isDisabled)
                    ((new RegExp(name, 'i')).test(project.name))
                  ).map((option, index) => (
                    <option key={index} value={option._id}>{option.name}</option>
                  )) : null}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>


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
          </Col>
          <Col xs={12} md={4}>
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
          </Col>
          <Col xs={12} md={4}>
            <Form.Group id="taskstatus" className="mb-4">
              <Form.Label>Is Disabled</Form.Label>
              <InputGroup>
                <InputGroup.Text></InputGroup.Text>
                <Form.Select value={isDisabled} onChange={(e) => setisDisabled(e.target.value)}>
                  <option value="">Select Option</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col xs={12} md={2} className="d-flex justify-content-center">
            <Button style={{ height: "70%" }} variant="primary" type="submit" className="w-100 mt-3">
              Submit
            </Button>
          </Col>
        </Row>
      </form>
      <section>
        <Container>
          <Row>
            <Col className="mx-auto">
              <Card style={{ width: 'max-content', marginLeft: '-5%' }} border="light" className="shadow-sm">
                <Card.Header>
                  <Row style={{ width: "100%" }} className="align-items-center">
                    <Col>
                      <h5>Tasks List {ptbf ? `for ${pnamearr.find((i) => i._id === ptbf)?.name}` : ''}</h5>
                    </Col>
                    <Col style={{ width: "100%" }} className="text-end">
                      <Button onClick={(e) => setShowModal3(true)} variant="secondary" size="sm">Add Tasks</Button>
                    </Col>
                  </Row>
                </Card.Header>
                <table responsive className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col" className="unselectable" style={{ cursor: "pointer" }} onClick={() => settemp(temp == 1 ? 2 : 1)}>Created At</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Task Subject</th>
                      <th scope="col">Task Description</th>
                      <th scope="col">Deadline</th>
                      <th scope="col">Assigned to</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">loading...</td>
                      </tr>
                    ) : (
                      data.filter((task) =>
                        (taskstatus === "" || task?.taskCompleted === (taskstatus === "true")) &&
                        (isDisabled === "" || task?.isDisabled === (isDisabled === "true"))



                      )
                        .sort((a, b) => {
                          if (temp == 1) {
                            return new Date(a.CreatedAt) - new Date(b.CreatedAt); // Ascending order
                          } else if (temp == 2) {
                            return new Date(b.CreatedAt) - new Date(a.CreatedAt); // Descending order
                          }
                          return 0;
                        }).map((row, index) => {
                          const projectName = findprojectname(row.projectid);
                          return projectName ? (
                            <tr key={index}>
                              <td style={{ whiteSpace: "pre-wrap" }}>{timeinIndia(row.CreatedAt)}</td>

                              <td style={{ textAlign: "left", maxWidth: '20px', cursor: "pointer", whiteSpace: "pre-wrap" }} onClick={() => handletaskhistory(row)}>
                                <p >{projectName}</p>
                                <span style={{ position: "relative", top: "-10px", border: "4px solid cyan", borderRadius: "200px", fontWeight: "700" }}>{row.nooftask}</span>
                              </td>
                              <td style={{ whiteSpace: "pre-wrap", maxWidth: '30px' }}>{row.taskSubject}</td>
                              <td style={{ whiteSpace: "pre-wrap", width: "250px", fontSize: "18px" }}><pre style={{ whiteSpace: "pre-wrap" }}>{row.taskDescription}</pre></td>
                              <td style={{ whiteSpace: "pre-wrap", width: "250px", fontSize: "18px" }}><pre style={{ whiteSpace: "pre-wrap" }}>{dateinIndia(row.deadline)}</pre></td>

                              <td style={{ whiteSpace: "pre-wrap" }}>{getUsernameById(row.assignTaskTo)}</td>
                              <td style={{ height: "100%", border: "0px solid green", width: "max-content", display: "flex", flexDirection: "column" }}>
                                <Button style={{ backgroundColor: "aqua", color: "black" }} variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                {checkpermission() && (<Button style={{ backgroundColor: "aqua", borderColor: "black", color: "black", marginLeft: "2%" }} onClick={(e) => {
                                  dispatch(deletetasks(row._id)).then((res) => {
                                    handleFetch(e);
                                  })
                                }} variant="danger" size="sm">
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>)}
                                <Button style={{ backgroundColor: "aqua", color: "black", marginLeft: "2%" }} onClick={() => handleaddhistory(row)}>
                                  Add
                                </Button>
                                {!fromdashboard ? (
                                  <Button style={{ backgroundColor: "aqua", color: "black", marginLeft: "2%" }} onClick={() => handleaddtobucket(row)}>
                                    Add to Bucket
                                  </Button>
                                ) : (<Button style={{ backgroundColor: todaystask.some(task => task._id == row._id) ? 'red' : 'cyan', color: "black", marginLeft: "2%" }} onClick={(e) => {
                                  AddtasktoUserBucket(e, row._id, check()[0]).then((res) => {
                                    dispatch(setTrigger());
                                  })
                                }}>
                                  {todaystask?.some(task => task._id == row._id) ? "Already in bucket" : "Add to Bucket"}
                                </Button>)}

                                <Button
                                  style={{ backgroundColor: "aqua", color: "black", marginLeft: "2%" }}
                                  onClick={() => handleComplete(row._id)}
                                >
                                  {row.taskCompleted ? "Mark incomplete" : "Mark complete"}
                                </Button>

                              </td>
                            </tr>
                          ) : null;
                        })
                    )}

                  </tbody>
                </table>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      {/* edit modal */}
      <Modal show={showModal && editMode} onHide={() => setEditMode(false)}>
        <Modal.Header>
          <Modal.Title>Edit Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="date"
            value={editdeadline}
            onChange={(e) => {
              seteditDeadline(e.target.value)
              // setvieweditfiledate(new Date(e.target.value).toISOString().split("T")[0])
            }}
          />
          <Form.Group className="mb-3" controlId="editDescription">
            <Form.Label>Project name</Form.Label>
            <Form.Select required value={editprojectname} onChange={(e) => setEditprojectname(e.target.value)}>
              <option value="">Select Option</option>

              {pnamearr.map((option, index) => (
                <option key={index} value={option._id}>{option.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Task Subject</Form.Label>
            <Form.Control type="text" value={edittaskSubject} onChange={(e) => setEdittaskSubject(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Task Description</Form.Label>
            <textarea rows="4" cols="50" type="text" value={edittaskDescription} onChange={(e) => setEdittaskDescription(e.target.value)} />
          </Form.Group>

          {/* People */}
          <Form.Group className="mb-3" controlId="editIsActive">
            {users ? (<Multiselect
              selectedValues={editassignTaskTo}
              setSelectedValues={setEditassignTaskTo}
              options={users} />) : (
              <p>loading</p>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


      <ViewTaskHistory handleFetch={handleFetch} project={project} taskid={taskid} history={history} setHistory={setHistory} showModal1={showModal1} setShowModal1={setShowModal1} getUsernameById={getUsernameById} settrigger={settrigger} trigger={trigger} />
      {/* add history */}

      <AddTaskHistory handleFetch={handleFetch} project={project} taskid={taskid} showModal2={showModal2} setShowModal2={setShowModal2} settrigger={settrigger} trigger={trigger} />

      <Modal show={showModal3} onHide={() => {
        setShowModal3(false)
      }}>
        <ModalBody>
          <CreateTasks handleFetch={handleFetch} ptbf={ptbf ? ptbf : ""} />
        </ModalBody>
      </Modal>

      <Modal show={showModal4} onHide={() => {
        setShowModal4(false)
      }}>
        <Modal.Header>
          <Modal.Title>Add to Bucket</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <AddToBucket users={users} taskid={taskid} />
        </ModalBody>

      </Modal>




    </>
  );
}

export default Comp
