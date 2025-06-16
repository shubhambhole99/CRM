import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllBuckets, deleteTaskFromBucket } from "../../features/bucketslice";  // Import your action
import axios from "axios";
import { baseurl, ProjectStatus, companies } from "../../api";
import { check } from "../../checkloggedin"
import { fetchProjects } from "../../features/projectslice";
import { fetchAsyncData } from '../../features/userslice'
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { setToday } from "../../features/bucketslice";


const Comp = ({ fromdashboard }) => {
  const dispatch = useDispatch();
  const [buckets, setBuckets] = useState([]);  // Initialize buckets state
  const [showModal, setShowModal] = useState(false);
  let [selectedBucket, setSelectedBucket] = useState(null);  // To store the selected bucket details
  const [selectedTasks, setSelectedTasks] = useState([]); // New state for selected tasks
  const [taskId, setTaskId] = useState(''); // For storing the selected task ID
  const [pname, setPname] = useState('');
  const [data, setData] = useState([]);
  const [newTasks, setNewTasks] = useState([]); // New state to handle selected tasks
  const [companyname, setCompanyName] = useState('')
  const [people, setPeople] = useState(check()[0]);
  const [pnamearr, setPnamearr] = useState([]);
  const [isActive, setIsActive] = useState(null)
  const [users, setUsers] = useState([]);
  const [filteredBuckets, setFilteredBuckets] = useState([]);
  // const [createdate, setCreateDate] = useState(Date.now())
  const Today = new Date().toISOString().split("T")[0];
  const [createdate, setCreateDate] = useState(Today)
  const [project, setProject] = useState(null)
  const [trigger1, setTrigger1] = useState(false)

  const trigger = useSelector(state => state.bucket.trigger);

  const { user1 } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await dispatch(fetchProjects({
          company: companyname || null,
          status: isActive || null
        }));
        setPnamearr(response);
        // //////console.log(response); // Uncomment if needed for debugging
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjectData();
  }, [dispatch, companyname, isActive]);



  useEffect(() => {


    dispatch(getAllBuckets()).then((res) => {
      const today = res.filter(bucket => new Date(bucket.date).toLocaleDateString() === new Date(Today).toLocaleDateString() &&
      bucket.user._id == check()[0])
      if(today.length>0){
      dispatch(setToday(today[today.length-1].tasks))
      }
      console.log(today)
      setBuckets(res);   // Set the fetched buckets to local state

    })  // Await the dispatch to get the data



  }, [trigger, trigger1]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.put(`${baseurl}/task/filter`, {
          projectid: pname || undefined,
          assignTaskTo: people ? [people] : undefined,
          // taskCompleted: taskstatus || undefined
        });
        // Check if the response status is 200
        setData(response.data);
        // //////console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
    dispatch(fetchAsyncData());
    if (user1.length !== 0) {
      setUsers(user1);
    }
  }, [user1.length]);

  const handleEdit = (bucket) => {
    setSelectedBucket(bucket);  // Set the selected bucket
    setSelectedTasks(bucket.tasks);  // Initialize the selected tasks with the current bucket tasks
    setShowModal(true);  // Open the modal
  };

  const handleDeleteTask = (taskId) => {
    // Remove the task from the selectedTasks state
    setSelectedTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));

    // Dispatch deleteTaskFromBucket action to remove the task from the backend
    if (selectedBucket) {
      dispatch(deleteTaskFromBucket(selectedBucket.user._id, selectedBucket._id, taskId));

    }
    // setShowModal(false);
    setFilteredBuckets(buckets);
  };


  const handleDeleteTasks = (userid, bucketid, taskId) => {

    // Dispatch deleteTaskFromBucket action to remove the task from the backend
    if (selectedBucket) {
      dispatch(deleteTaskFromBucket(userid, bucketid, taskId));

    }
    // setShowModal(false);
    setFilteredBuckets(buckets);
  };

  const handleAddTask = (e) => {
    const selectedTask = data.find(task => task._id === e.target.value);
    if (selectedTask && !selectedTasks.some(task => task._id === selectedTask._id)) {
      setSelectedTasks((prevTasks) => [...prevTasks, selectedTask]);  // Add the selected task to the list
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedBucket) return;
    try {
      // Assuming `selectedTasks` is the correct task ID you want to add
      const newTask = selectedTasks // Ensure the correct task ID is added
      // Other task properties can be added here if needed
      selectedBucket.tasks = newTask
      // Create the updated bucket object with the new tasks array
      const updatedBucket = selectedBucket
      //////console.log(updatedBucket); // Log the updated bucket object
      // Call the API to update the bucket
      const response = await axios.put(
        `${baseurl}/bucket/buckets/${selectedBucket.user._id}/${selectedBucket._id}`,
        updatedBucket
      );
      // Check if the response is successful and show a success message
      if (response.status === 200) {
        toast.success("Bucket updated successfully!");
      } else {
        throw new Error("Failed to update bucket");
      }
      // Close the modal after a successful update
      setShowModal(false);
    } catch (error) {
      console.error("Error updating bucket:", error);
      toast.error("Failed to update bucket");
    }
  };
  const handleCloseModal = () => setShowModal(false);  // Close the modal

  const handleFilterBuckets = (e) => {
    e.preventDefault(); // Prevent form submission reload
    let filtered = buckets; // Start with all buckets
    if (people) {
      // Filter by selected person
      filtered = filtered.filter(bucket => bucket.user._id === people);
    }
    if (createdate) {
      // Filter by selected date (Assuming `selectedDate` is a date string in the same format as bucket dates)
      filtered = filtered.filter(bucket => {
        // Assuming the bucket date is stored as a Date object or ISO string, adjust the comparison accordingly
        return new Date(bucket.date).toLocaleDateString() === new Date(createdate).toLocaleDateString();
      });
    }
    setFilteredBuckets(filtered); // Update the filteredBuckets state with the new filtered results
  };


  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const todayBuckets = buckets.filter(bucket =>
      new Date(bucket.date).toLocaleDateString() === today
    );
    setFilteredBuckets(todayBuckets);
  }, [buckets]);

  const findprojectname = (id) => {
    //////////////////console.log(id,pnamearr)
    for (let i = 0; i < pnamearr.length; i++) {
      if (pnamearr[i]._id === id) {
        return pnamearr[i].name
      }
    }
  }




  return (
    <>
      <ToastContainer />
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Bucket</Breadcrumb.Item>
            <Breadcrumb.Item active>View Buckets</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <form onSubmit={handleFilterBuckets}>
        {!fromdashboard && (<Form.Group id="people" className="mb-4">
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
        </Form.Group>)}
        {!fromdashboard && (<><Form.Group id="pname" className="mb-4">
          <Form.Label>Date</Form.Label>
          <InputGroup>
            <InputGroup.Text></InputGroup.Text>
            <Form.Control type="date" placeholder="date" value={fromdashboard ? new Date().toISOString().split("T")[0] : createdate} onChange={(e) => setCreateDate(e.target.value)} />
          </InputGroup>
        </Form.Group>
          <Button style={{ height: "70%" }} variant="primary" type="submit" className="w-100 mt-3">
            Submit
          </Button>
        </>)
        }
      </form>
      <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
        <Container style={{ width: "100%" }}>
          <Card style={{ width: '100%' }} border="light" className="shadow-sm">
            <Card.Header>
              <Row style={{ width: "100%" }} className="align-items-center">
                <Col>
                  <h5>Tasks List</h5>
                </Col>
                <Col style={{ width: "100%" }} className="text-end">
                </Col>
              </Row>
            </Card.Header>



            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>User</th>
                  <th >Tasks</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>

                {users?.map((option, index) => {
                  return (
                    <>
                      {buckets?.filter(bucket => bucket.user._id === option._id &&
                        (!people || bucket.user._id === people) &&
                        (!fromdashboard ? (new Date(bucket.date).toLocaleDateString() === new Date(Today).toLocaleDateString()) : (!createdate || new Date(bucket.date).toLocaleDateString() === new Date(createdate).toLocaleDateString()))
                      ).map((bucket, index) => (
                        <>
                          {bucket.tasks.map((task, taskIndex) => (
                            <tr key={task._id}>
                              <td>{index + 1}</td>
                              <td>{new Date(bucket.date).toLocaleDateString()}</td>
                              <td>{bucket.user.username}</td>
                              <td style={{ maxWidth: "200px" }}>
                                <pre style={{ whiteSpace: "pre-wrap" }}>{task.taskSubject}
                                  {findprojectname(task.projectid)} - {task.projectName}
                                </pre>


                              </td>
                              <td>

                                <Button variant="danger" className="me-2" onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(deleteTaskFromBucket(option._id, bucket._id, task._id)).then((res) => {
                                    setTrigger1(!trigger1)
                                  })

                                }

                                } >
                                  Delete
                                </Button>
                                <Button
                                  style={{ color: "white" }}
                                  onClick={(e) => {
                                    handleComplete(task._id, task.taskCompleted)
                                    switchstatus(bucket, task._id)
                                    ////////console.log(task.taskCompleted)
                                  }}
                                >
                                  {task.taskCompleted ? "Mark Incomplete" : "Mark Complete"}
                                </Button>

                                {(check()[1]=="john_doe" || check()[1]=="pbhole" || check()[1]=="mbhole") && (<Button variant="primary" onClick={() => handleEdit(bucket)} className="me-2">
                                  Edit
                                </Button>)}
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  );
                })}



                {/* {filteredBuckets.map((bucket, index) => (
                <tr key={bucket._id}>
                  <td>{index + 1}</td>
                  <td>{new Date(bucket.date).toLocaleDateString()}</td>
                  <td>{bucket.user.username}</td>
                  <td>
                    <ul>
                      {bucket.tasks.map((task, taskIndex) => (
                        <li key={task._id}>
                          <p><strong>Task Subject:</strong> {task.taskSubject}</p>
                          <p><strong>Project:</strong> {findprojectname(task.projectid)} - {task.projectName}</p>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(bucket)} className="me-2">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))} */}
              </tbody>
            </Table>
          </Card>

        </Container>
      </section>


      {/* Modal for Editing Bucket */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bucket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBucket && (
            <>
              <Form>
                <Form.Group controlId="formBucketDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={new Date(selectedBucket.date).toLocaleDateString()}
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId="formBucketUser">
                  <Form.Label>User</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={selectedBucket.user.username}
                    readOnly
                  />
                </Form.Group>

                <Form.Group id="taskstatus" className="mb-4">
                  <Form.Label>Task</Form.Label>
                  <InputGroup>
                    <Form.Select value={taskId} onChange={handleAddTask}>
                      <option value="">Select Task</option>
                      {/* Mapping through the data array to generate options */}
                      {data.map((task, index) => (
                        <option key={index} value={task._id}>
                          {findprojectname(task.projectid)} - {task.taskSubject} - {task.projectName}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="formBucketTasks">
                  <Form.Label>Selected Tasks</Form.Label>
                  {selectedTasks.map((task, index) => (
                    <Row key={task._id} className="mb-2">
                      <Col md={10}>
                        <Form.Control
                          type="text"
                          value={`${task.projectName} - ${task.taskSubject} - ${task.taskprojectid}`}
                          readOnly
                        />
                      </Col>
                      <Col md={2}>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteTask(task._id)}  // Handle task deletion
                          className="w-100"
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Comp