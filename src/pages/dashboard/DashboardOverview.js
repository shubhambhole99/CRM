import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faTrash, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Table, InputGroup, Button, Dropdown, ButtonGroup, Modal } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { CounterWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";
import Navbar from "../../components/Navbar";
import { check } from "../../checkloggedin"
import { baseurl, ProjectStatus, companies } from "../../api";
import Multiselect from "../../components/Multiselect";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS
import { fetchProjects } from "../../features/projectslice";
import { useDispatch, useSelector } from "react-redux";
import { faBitbucket } from "@fortawesome/free-brands-svg-icons";
import { getAllBuckets, deleteTaskFromBucket } from "../../features/bucketslice";  // Import your action
import { Routes } from "../../routes";
import { Route } from "react-router-dom";

export default (props) => {
  let [buckets, setBuckets] = useState([]);  // Initialize buckets state
  const [customers, setCustomers] = React.useState([]);
  let [completedtasks, setcompletedTasks] = useState([]);
  let [finalcompletedtasks, setfinalcompletedTasks] = useState([]);

  let [incompletedtasks, setincompletedTasks] = useState([]);
  let [finalincompletedtasks, setfinalincompletedTasks] = useState([]);

  let [completedfiltertask, setcompletedfiltertask] = useState([])
  let [incompletedfiltertask, setincompletedfiltertask] = useState([])

  const [contacts, setContacts] = React.useState([]);
  const [bucketsData, setBucketsData] = useState([]);
  let [isActive, setIsActive] = useState([])

  let [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showModal, setshowModal] = useState(false)
  const [edittaskDescription, setEdittaskDescription] = useState("")
  let [filteredBuckets, setFilteredBuckets] = useState([])
  // Task
  let [companyname, setCompanyName] = useState("")
  const [pnamearr, setPnamearr] = useState([])
  const [pnamearr1, setPnamearr1] = useState([])
  let [pname, setPname] = useState("")
  const [tasksubject, setTaskSubject] = useState()
  const [selectedusers, setSelectedusers] = useState([])
  const uid = check()[0]

  const username = localStorage.getItem('username');

  const dispatch = useDispatch();
  let [refreshbucket, setrefreshbucket] = useState(false)
  let [pname1, setPname1] = useState("")
  const { user1, loading, error } = useSelector((state) => state.users);

  const userId = check()[0]


  useEffect(() => {
    // Fetch users and projects
    fetchBuckets().then((data) => {
      // filterbucket()
      let temp = data.filter(bucket => {
        const bucketDate = formatDate(bucket.date); // Format bucket date as dd-mm-yyyy
        const filterDate = formatDate(selectedDate); // Format selectedDate as dd-mm-yyyy
        //////console.log(selectedDate)
        return bucketDate === filterDate && bucket.user._id == userId; // Compare the formatted dates
      });
      ////console.log(temp)
      if (temp.length == 0) {
        return
      }
      setFilteredBuckets([temp[0]])
      // // ////console.log(temp,"----------------")
      // if(temp.length!=0){
      // } 
    });  // handleComplete the fetch function
    //console.log(Routes)

  }, [refreshbucket]);
  useEffect(() => {
    dispatch(fetchProjects({

    })).then((resp) => {
      setPnamearr(resp)
      setPnamearr1(resp)
      // ////////////console.log(resp)
    }).catch(error => {

    })
    fetchtask()

  }, [refreshbucket])
  const filterbucket = async (selectedDate) => {
    let temp = buckets.filter(bucket => {
      const bucketDate = formatDate(bucket.date); // Format bucket date as dd-mm-yyyy
      const filterDate = formatDate(selectedDate); // Format selectedDate as dd-mm-yyyy
      //////console.log(selectedDate)
      return bucketDate === filterDate && bucket.user._id == userId; // Compare the formatted dates
    });
    ////console.log(temp, "----------------")
    // if(temp.length)
    if (temp.length == 0) {
      setFilteredBuckets([])
      toast.error("No buckets for this day")
      return
    }
    filteredBuckets = temp[0]
    setFilteredBuckets([temp[0]])
    ////console.log(filteredBuckets)
  }

  const findTask = (id) => {
    for (let i = 0; i < incompletedtasks.length; i++) {
      if (incompletedtasks[i]._id === id) {
        return incompletedtasks[i];
      }
      ////////console.log(incompletedtasks);
    }
  }
  const fetchtask = () => {
    const userId = check()[0]; // Assuming check() returns the user ID
    //////console.log(userId,"--------------------------")
    // Fetching incomplete tasks
    axios.get(`${baseurl}/task/incomplete/${userId}`)
      .then(response => {
        // let temp=(response.data).reverse()
        ////console.log(response.data)
        setincompletedTasks(response.data.reverse());
        setfinalincompletedTasks(response.data.reverse())
      })
      .catch(error => {
        ////console.error('Error fetching incomplete tasks:', error);
      });
    axios.get(`${baseurl}/task/complete/${userId}`)
      .then(response => {
        setcompletedTasks(response.data.reverse());
        setfinalcompletedTasks(response.data.reverse());
        ////console.log(response.data)
      })
      .catch(error => {
        ////console.error('Error fetching complete tasks:', error);
      });
  }
  const handleComplete = async (id, taskCompleted) => {

    try {
      ////////console.log(id)
      const response = await axios.put(`${baseurl}/task/complete/${id}`);
      const updatedTask = response.data.task;
      ////console.log(taskCompleted,id)
      if (taskCompleted) {
        // Task was completed, now mark it as incomplete
        // let temp=completedtasks.filter(task => task._id !== id)
        // completedtasks=temp
        // setcompletedTasks(completedtasks.filter(task => task._id !== id))
        // setfinalcompletedTasks(temp)
        // setincompletedTasks(prevIncompleted => [...prevIncompleted, updatedTask]);
        // setcompletedTasks(temp)
        // finalcompletedtasks=temp
        // handlefiltertask("complete")
        setcompletedTasks(prevcompleted =>
          prevcompleted.filter(task => task._id !== id)
        );
        setfinalcompletedTasks(prevcompleted =>
          prevcompleted.filter(task => task._id !== id))
        setincompletedTasks(previnCompleted => [...previnCompleted, updatedTask]);
        setfinalincompletedTasks(previnCompleted => [...previnCompleted, updatedTask]);
        // handlefiltertask("incomplete")
        // toast.success("Task marked as incomplete");
      } else {
        // Task was incomplete, now mark it as completed
        setincompletedTasks(prevIncompleted =>
          prevIncompleted.filter(task => task._id !== id)
        );
        setfinalincompletedTasks(
          prevIncompleted =>
            prevIncompleted.filter(task => task._id !== id)
        )
        setcompletedTasks(prevCompleted => [...prevCompleted, updatedTask]);
        setfinalcompletedTasks(prevCompleted => [...prevCompleted, updatedTask]);
        // handlefiltertask("incomplete")
        // handlefiltertask("complete")
        // toast.success("Task marked as complete");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };
  const handleprojectFetch = async () => {
    //////////////////console.log(companyname)
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr1(resp)
      ////////console.log(resp)
    }).catch(error => {

    })
  }

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const fetchBuckets = async () => {
    const userId = check()[0];
    try {
      const fetchedBuckets = await dispatch(getAllBuckets());  // Await the dispatch to get the data
      buckets = fetchedBuckets
      setBuckets(fetchedBuckets);   // Set the fetched buckets to local state
      return (buckets)
      // setrefreshbucket(!refreshbucket)
      ////////console.log(buckets)
      // ////////console.log(fetchedBuckets, "from table")
      // ////////console.log(buckets, "from table")
      // let temp = fetchedBuckets.filter(bucket => {
      //   const bucketDate = formatDate(bucket.date); // Format bucket date as dd-mm-yyyy
      //   const filterDate = formatDate(selectedDate); // Format selectedDate as dd-mm-yyyy
      //   return  bucket.user._id==userId && bucketDate === filterDate  // Compare the formatted dates
      // });
      //  temp=temp.filter((bucket)=>{
      //   return bucket.user._id==userId
      //  })


    } catch (error) {
      // toast.error("Error fetching buckets");
    }
  };
  const handlefiltertask = (type) => {
    ////console.log(type, pname)
    if (type == "incomplete") {
      if (pname == "") {
        // ////console.log(pname,incompletedtasks,"here")
        // finalincompletedtasks=incompletedtasks
        setfinalincompletedTasks(incompletedtasks)
        return
      }
      let temp = incompletedtasks.filter((data) => data.projectid == pname)
      setfinalincompletedTasks(temp)
    }
    else {
      if (pname == "") {
        // ////console.log(pname,incompletedtasks,"here")
        // finalincompletedtasks=incompletedtasks
        setfinalcompletedTasks(completedtasks)
        return
      }
      let temp = completedtasks.filter((data) => data.projectid == pname)
      setfinalcompletedTasks(temp)
    }
  }
  const handleSaveChanges = async (row) => {
    ////////console.log(row, buckets)
    // Get the userId from check()
    const userId = check()[0]; // Assuming check() returns the user ID you need
    // ////////console.log('User ID from check:', userId);

    // Check if buckets array is populated
    if (!buckets || buckets.length === 0) {
      ////console.error('Buckets array is empty or undefined');
      toast.error('No buckets available to update');
      return; // Exit early if buckets array is empty
    }

    // Get today's date in YYYY-MM-DD format in IST
    const today = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const localDate = new Date(today.getTime() + istOffset).toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    // const localDate1 = formatDate(selectedDate);
    //////console.log('Current Date in IST:', localDate);

    // Debugging: Log all buckets
    // ////////console.log('Buckets:', buckets);

    // Find the bucket by both today's date in IST and userId
    const bucket = buckets.find(bucket => {
      // Convert bucket date to IST and format it as YYYY-MM-DD
      const bucketDate = new Date(new Date(bucket.date).getTime() + istOffset).toISOString().split('T')[0];

      // ////////console.log('Checking Bucket:', bucket); // Log each bucket for debugging
      // ////////console.log('Bucket Date in IST:', bucketDate); // Log the formatted bucket date
      // ////////console.log('Bucket User ID:', bucket.user._id); // Log the user ID in the bucket for debugging

      // Check if the bucket date and userId match
      const isMatch = bucketDate === localDate && bucket.user._id === userId;
      // ////////console.log(`Matching Result: Date Match (${bucketDate === localDate}), User Match (${bucket.user._id === userId})`);

      return isMatch; // Match both date and userId
    });
    ////console.log(bucket)
    if (bucket == undefined) {
      ////console.error('No matching bucket found for today\'s date and user.');
      ////////console.log(row._id)
      const updatedTasks = row._id ? [row._id] : []
      const payload = {
        userId: userId,
        date: localDate,
        tasks: updatedTasks, // Updated key to "tasks" as per the backend's requirement
      };
      try {
        const response = await axios.post(`${baseurl}/bucket/buckets/${userId}`, payload);
        // ////////console.log('Bucket updated with tasks:', response.data);
        // setTaskIds(updatedTasks); // Update state with new task IDs
        // setSelectedTask(""); // Optionally reset selected task
        // toast.success('Tasks successfully added to bucket');
        setrefreshbucket(!refreshbucket)
        return
      }
      catch (err) {
        ////////console.log(err)
      }


    }
    else {

      const bucketId = bucket._id;
      // ////////console.log('Found Bucket ID:', bucketId);

      let temp = bucket.tasks.map((data) => data._id)
      ////////console.log(temp)
      if ((temp).includes(row._id)) {
        // toast.error("Task Already exists in the bucket")
        return
      }

      // Add the new task ID to the existing array of task IDs
      const updatedTasks = [...bucket.tasks, row._id]; // Add the new task to the existing tasks array

      const payload = {
        userId: userId,
        date: localDate,
        tasks: updatedTasks, // Updated key to "tasks" as per the backend's requirement
      };

      try {
        const response = await axios.put(`${baseurl}/bucket/buckets/${userId}/${bucketId}`, payload);
        // ////////console.log('Bucket updated with tasks:', response.data);

        toast.success('Tasks successfully added to bucket');
        setrefreshbucket(!refreshbucket)
      } catch (error) {
        // ////console.error('Error updating bucket with tasks:', error.response?.data || error);
        toast.error('Error updating bucket');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      ////console.log(taskId)
      // Find the bucket that contains the task to delete
      const bucketWithTask = buckets.find(bucket =>
        bucket.tasks.some(task => task._id === taskId)
      );
      ////////console.log(bucketWithTask, taskId)

      if (!bucketWithTask) {
        toast.error("Task not found in any bucket");
        return;
      }

      // Get the bucket ID and user ID
      const bucketId = bucketWithTask._id;
      const userId = bucketWithTask.user._id; // Assuming the user ID is stored inside the bucket

      // Dispatch the action to delete the task from the backend
      await dispatch(deleteTaskFromBucket(userId, bucketId, taskId));

      // Update the local state by filtering out the deleted task from the bucket
      let temp = bucketWithTask
      temp.tasks = (temp.tasks).filter((task) => task._id != taskId)
      ////////console.log(temp)
      setFilteredBuckets([temp])
      // toast.success("Task deleted successfully");

    } catch (error) {
      ////console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };
  const switchstatus = (bucket, taskiddd) => {
    // Log the original bucket and task ID for debugging
    ////////console.log(bucket, taskiddd);

    // Update the bucket's tasks
    const updatedBucket = {
      ...bucket,
      tasks: bucket.tasks.map(task => {
        // Check if the task ID matches the provided taskiddd
        if (task._id === taskiddd) {
          // Toggle the taskcompleted status
          return {
            ...task,
            taskCompleted: !task.taskCompleted,
          };
        }
        // Return the task unchanged if the ID doesn't match
        return task;
      }),
    };

    // Log the updated bucket for debugging
    // filteredBuckets = updatedBucket
    ////////console.log(updatedBucket);
    setFilteredBuckets([updatedBucket])
  }

  const addtask = async (userid) => {
    try {
      const ids = selectedusers.map(user => user.id);
      const body = {
        projectid: pname1,
        assignTaskTo:ids,
        taskSubject: tasksubject,
        assignedby: check()[0]
      };
      ////////////////////////console.log(body)
      // Example: Posting additional form data using Axios
      // const responseFormData = await axios.post(`${baseurl}/project/create`,body, {
      //   headers: {
      //     Authorization: `${token}`,
      //     'Content-Type': 'multipart/form-data', // Set appropriate content type
      //   },
      // });
      const responseFormData = await axios.post(`${baseurl}/task/create`, body);
      ////////////////////////console.log(responseFormData);
      // toast.success('Task added successfully'); // handleComplete toast.success after successful addition
      // window.location.reload()
      // setSelectedFile(null)
      fetchtask()
      setshowModal(false)
    } catch (error) {
      //////console.error(error);
      // Assuming res is not defined, use //////console.error instead
      //////console.error({ message: "backend error", data: error });
    }
    ////////console.log(userid)
    const getUsernameById = (assignTaskTo) => {
      let str = "";
      for (let i = 0; i < assignTaskTo.length; i++) {
        for (let j = 0; j < user1.length; j++) {
          if (user1[j]._id === assignTaskTo[i]) {
            str = str + user1[j].username + " ";
            break;
          }
        }
      }
      return str;
    };

  }
  return (
    <>
      <ToastContainer />
      <Row className="justify-content-md-center">
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category=" Tasks Completed"
            title={completedtasks.length.toString()}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Tasks Incompleted"
            title={incompletedtasks.length.toString()}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Bucket"
            // title={buckets.length.toString()}
            icon={faBitbucket}
            iconColor="shape-tertiary"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col className="mb-4">
              {/* row */}
              {filteredBuckets && (
                <Row>
                  <Col xs={12} className="mb-4" style={{ position: 'relative' }}>
                    <h1> Today's Bucket</h1>

                    {(() => {
                      const loggedInUser = localStorage.getItem('username'); // Fetch the logged-in username from local storage
                      if (!loggedInUser) {
                        return <p>No user logged in.</p>;
                      }
                      const findprojectname = (id) => {
                        ////////console.log(id, pnamearr)
                        for (let i = 0; i < pnamearr.length; i++) {
                          if (pnamearr[i]._id == id) {
                            // ////////console.log(pnamearr[i].name)
                            return pnamearr[i].name
                          }
                        }
                      }
                      const getUsernameById = (assignTaskTo) => {
                        let str = "";
                        for (let i = 0; i < assignTaskTo.length; i++) {
                          for (let j = 0; j < user1.length; j++) {
                            if (user1[j]._id === assignTaskTo[i]) {
                              str = str + user1[j].username + " ";
                              break;
                            }
                          }
                        }
                        return str;
                      };

                      return (
                        <>
                          {isDatePickerOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                zIndex: 999,
                                backgroundColor: 'white', // Ensure it's visible over the table
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional shadow for better visibility
                                padding: '10px', // Optional padding
                                borderRadius: '5px', // Optional rounded corners
                              }}
                            >
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                  selectedDate = date
                                  setSelectedDate(date); // Update the selected date
                                  setDatePickerOpen(false); // Close the date picker after selecting a date
                                  filterbucket(selectedDate)
                                }}
                                inline
                                dateFormat="yyyy/MM/dd"
                                onClickOutside={() => setDatePickerOpen(false)} // Close on outside click
                              />
                            </div>
                          )}
                          <Table striped bordered hover>
                            <thead>
                              <tr>

                                <th onClick={() => setDatePickerOpen(!isDatePickerOpen)} style={{ cursor: 'pointer', textDecoration: "underline", color: "blue" }}>Date</th>
                                <th>Project</th>
                                <th>Task Subject</th>
                                <th>Task Description</th>
                                <th>Assignedby</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredBuckets.length === 0 ? (
                                <tr>
                                  <td >No data available</td>
                                </tr>
                              ) : (
                                filteredBuckets
                                  .filter(bucket => bucket.user.username === username) // Filter by username from localStorage
                                  .map(bucket => (
                                    bucket.tasks.length === 0 ? (
                                      <tr key={bucket._id}>
                                        {/* <td>{bucket._id}</td> */}
                                        {/* <td>{formatDate(bucket.date)}</td> */}
                                        {/* <td>{bucket.user.username}</td>  */}

                                      </tr>
                                    ) : (
                                      bucket.tasks.map(task => (
                                        <tr key={task._id}>
                                          {/* <td>{bucket._id}</td> */}

                                          <td colSpan={1} style={{ width: "30px" }}>{formatDate(task.CreatedAt)}</td>
                                          <td scope="col">{findprojectname(task.projectid)}</td>
                                          <td scope="col">{task.taskSubject}</td>
                                          <td scope="col" style={{ whiteSpace: "pre-wrap", width: "30%" }}>{task.taskDescription}</td>
                                          <td scope="col" style={{ whiteSpace: "pre-wrap", width: "30%" }}>{getUsernameById([task.assignedby])}</td>
                                          <td>
                                            <Button variant="danger" className="me-2" onClick={() => handleDeleteTask(task._id)} >
                                              Delete
                                            </Button>
                                            <Button
                                              style={{ color: "black" }}
                                              onClick={(e) => {
                                                handleComplete(task._id, task.taskCompleted,)
                                                switchstatus(bucket, task._id)
                                                ////////console.log(task.taskCompleted)
                                              }}
                                            >
                                              {task.taskCompleted ? "Mark Incomplete" : "Mark Complete"}
                                            </Button>
                                          </td>
                                        </tr>
                                      ))
                                    )
                                  ))
                              )}
                            </tbody>
                          </Table>
                        </>
                      );
                    })()}
                  </Col>
                </Row>
              )}
              {/* row */}
              <br />
              <br />
              <br />
              <br />
              <br />

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
                  <Form.Group id="pname" className="mb-4">
                    <Form.Label>Project name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Select value={pname} onChange={(e) => {
                        pname = e.target.value
                        setPname(e.target.value)
                        handlefiltertask("incomplete")
                      }}>
                        <option value="">Select Option</option>
                        pnamearr
                        {pnamearr1 != undefined ? pnamearr1.map((option, index) => (
                          <option key={index} value={option._id}>{option.name}</option>
                        )) : null}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col
                  xs={12} className="mb-4">
                  <h1>Task Incomplete</h1>
                  <Col className="text-start">
                    <Button onClick={() => setshowModal(true)}
                      variant="secondary" size="sm">Quick Add Task</Button>
                  </Col>
                  <PageVisitsTable
                    data={finalincompletedtasks}
                    refreshbucket={refreshbucket}
                    setrefreshbucket={setrefreshbucket}
                    handleComplete={handleComplete}
                    fetchBuckets={fetchBuckets}
                    handleSaveChanges={handleSaveChanges}
                    filteredBuckets={filteredBuckets}
                  />
                </Col>
              </Row>
              <br />
              <br />
              <br />
              <br />
              <br />
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
                  <Form.Group id="pname" className="mb-4">
                    <Form.Label>Project name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Select value={pname} onChange={(e) => {
                        pname = e.target.value
                        setPname(e.target.value)
                        handlefiltertask("complete")
                      }}>
                        <option value="">Select Option</option>
                        pnamearr
                        {pnamearr1 != undefined ? pnamearr1.map((option, index) => (
                          <option key={index} value={option._id}>{option.name}</option>
                        )) : null}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs={12} className="mb-4">
                  <h1>Task Completed</h1>
                  {completedtasks && (
                    <PageVisitsTable
                      data={finalcompletedtasks}
                      handleComplete={handleComplete}
                      fetchBuckets={fetchBuckets}
                      handleSaveChanges={handleSaveChanges}
                      filteredBuckets={filteredBuckets}
                    />)}

                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setshowModal(false)}>
        <Modal.Header>
          <Modal.Title>Add Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Company Name</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Select value={companyname} onChange={(e) => {
                companyname = e.target.value
                setCompanyName(e.target.value)
                dispatch(fetchProjects({
                  company: companyname ? companyname : null,
                })).then((resp) => {
                  setPnamearr(resp)
                  // ////////////console.log(resp)
                }).catch(error => {

                })
              }}>
                <option value="">Select Option</option>
                {companies.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>

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

          <Form.Group id="pname" className="mb-4">
            <Form.Label>Project name</Form.Label>
            <InputGroup>
              <InputGroup.Text>
              </InputGroup.Text>
              <Form.Select value={pname1} onChange={(e) => setPname1(e.target.value)}>
                <option value="">Select Option</option>
                {/* Mapping through the arr array to generate options */}
                {pnamearr1.map((option, index) => (
                  <option key={index} value={option._id}>{option.name}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="editDescription">
                              <Form.Label>Project name</Form.Label>
                    <Form.Select required value={editprojectname} onChange={(e) => setEditprojectname(e.target.value)}>
                          <option value="">Select Option</option>
                           
                            {pnamearr.map((option, index) => (
                              <option key={index} value={option._id}>{option.name}</option>
                            ))}
                          </Form.Select>
                          </Form.Group> */}
          <Form.Group id="tasksubject" className="mb-4">
            <Form.Label>Task Subject</Form.Label>
            <InputGroup>
              <InputGroup.Text>
              </InputGroup.Text>
              <Form.Control  type="text" placeholder="Task Subject" value={tasksubject} onChange={(e) => setTaskSubject(e.target.value)} />
            </InputGroup>
          </Form.Group>
          {/* users */}
          <Form.Group id="ptype" className="mb-4">
            <Form.Label>Assign Task To</Form.Label>
            {user1 ? (<Multiselect
              selectedValues={selectedusers}
              setSelectedValues={setSelectedusers}
              options={user1} />) : (
              <p>loading</p>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setshowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => addtask(uid)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};
