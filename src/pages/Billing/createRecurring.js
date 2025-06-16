import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, companies, toe, banknames } from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { check, timeinIndia } from '../../checkloggedin'
import { getcontacts } from "../../features/contactslice";
import Multiselect from "../../components/Multiselect";
import { fetchProjects } from "../../features/projectslice";
import fileUploader from "../../components/FileUploader";
import handleFileChange from "../../components/HandleFileChange";
import { getexpenseinvoice } from "../../features/expenseInvoiceSlice";
import { validate } from "cron-validator";

const CreateFunction = () => {
  const handleCloseModal = ""
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [stop, setstop] = useState(true)
  const filepath = '../../index.js'
  let [users, setUsers] = useState([])
  const [pname, setPname] = useState('')
  const [pnamearr, setPnamearr] = useState([])
  const [subject, setSubject] = useState(null)
  const [amount, setAmount] = useState(null)
  const [description, setDescription] = useState(null)
  const [person, setPerson] = useState('')
  const token = localStorage.getItem('token');
  const [datee, setdatee] = useState('')
  const [debittype, setdebittype] = useState('')
  const [contacts, setContacts] = useState([])
  const dispatch = useDispatch()
  const [expenseInvoices, setExpenseInvoices] = useState([])
  const [type, setType] = useState('')
  const [frequency, setFrequency] = useState("0 0 1 * *"); // Default to 1st of the month
  const [customFrequency, setCustomFrequency] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState('')
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [vieweditfiledate, setvieweditfiledate] = useState(null)
  const [isDisabled, setisDisabled] = useState(false)
  const [status, setstatus] = useState('active')

  const [editstatus, setEditstatus] = useState('active')
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  let [editdate, seteditdate] = useState(null)
  let [editName, setEditName] = useState(null)
  let [editAmount, setEditAmount] = useState(null)
  let [editType, setEditType] = useState("")
  let [editDescription, setEditDescription] = useState("")
  let [editOwner, setEditOwner] = useState(null)
  let [editfrequency, seteditfrequency] = useState(null)
  let [id, setid] = useState(null)
  let [temp,settemp]=useState(1)
  let [recurring, setRecurring] = useState([])
  const [filename, setfilename] = useState('')

  const predefinedSchedules = [
    { label: "1st of every month", value: "0 0 1 * *" },
    { label: "2nd of every month", value: "0 0 2 * *" },
    { label: "15th of every month", value: "0 0 15 * *" },
    { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
    { label: "Every day at 6 PM", value: "0 18 * * *" },
    { label: "Custom", value: "custom" },
  ];

  useEffect(() => {
    axios.get(`${baseurl}/user`).then(response => {
      users = response.data
      setUsers(response.data);
    })
    handleprojectFetch()
   
    dispatch(getexpenseinvoice()).then((res) => {
      setExpenseInvoices(res)
    })
    dispatch(getcontacts()).then((res) => {
      // console.log(res)
      setContacts(res)
    })
  }, [isDisabled,editstatus]);
  useEffect(() => {
    axios.get(`${baseurl}/recurring/`).then((res) => {
      setRecurring((res.data).filter((item) => item.isDisabled === (isDisabled === "true")))
      // console.log(res.data)
      // setData((res.data).filter((item) => item.status==status))

      setData((res.data).filter((item) => item.isDisabled === (isDisabled === "true") && item.status==status))
    })
  }, [isDisabled,status]);

  const handleEditModal = (item) => {
    setShowModal(true)
    setid(item._id)
    seteditdate(item.date)
    setvieweditfiledate(new Date(item.date).toISOString().split("T")[0])
    setEditName(item.name)
    setEditAmount(item.amount)
    setEditType(item.type)
    setEditDescription(item.description)
    setEditOwner(item.owner)
    setEditProject(item.project)
    seteditfrequency(item.frequency)
    setEditstatus(item.status)
    // seteditdate(item.date);
    // setEditAmount(item.amount);
    // setEditBank(item.bank);
    // setEditPerson(item.person);
    // setEditProject(item.project);
    // setEditSubject(item.subject);
    // setEditDescription(item.description);
    // setEditInvoice(item.invoice);
    // setEdittds(item.tds)
    // setEditgst(item.gst)
  }

  const handleFrequencyChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "custom") {
      setFrequency("");
    } else {
      setFrequency(selectedValue);
      setCustomFrequency("");
      setError("");

    }
  };
  const handleCustomFrequencyChange = (e) => {
    const value = e.target.value;
    setCustomFrequency(value);
    // setFrequency(value);
    // console.log(validate(value))
    // if (value && !validate(value)) {
    //   setError("Invalid cron expression");
    // } else {
    //   setError("");
    // }
  };
  const handleprojectFetch = async () => {
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr(resp)
      // //////////console.log(resp)
    }).catch(error => {

    })
  }
  //For Fetching Users and Projects

  let [selectedFiles, setSelectedFiles] = useState([]);
  const handleUpload = async (e) => {
    e.preventDefault()
    const cronRegex = /^(\*|[0-5]?[0-9]) (\*|[0-1]?[0-9]|2[0-3]) (\*|[1-9]|[12][0-9]|3[01]) (\*|[1-9]|1[0-2]) (\*|[0-6])$/;
    const isValidCron = cronRegex.test(frequency == "" ? customFrequency : frequency);
    if (!isValidCron) {
      toast.error("Invalid cron expression");
      return
    }
    // api call
    try {
      ////////////////console.log(uniqueUrls);
      const body = {
        name: name,
        date: datee == null ? new Date() : datee,
        amount: amount,
        frequency: frequency == "" ? customFrequency : frequency,
        description: description,
        project: pname == '' ? undefined : pname,
        owner: person == '' ? undefined : person,
        type: type,
      };
      const responseFormData = await axios.post(`${baseurl}/recurring/create`, body);
      axios.get(`${baseurl}/recurring/`).then((res) => {
        setData((res.data).filter((item) => item.isDisabled === (isDisabled === "true")))
      })
      // setPerson(null);
      // setAmount(null);
      // setdatee(null);
      // setPname(null);
      // setDescription(null);
      // setFrequency("0 0 1 * *");
      // setCustomFrequency("");
      // setType(null);
    } catch (error) {

    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const cronRegex = /^(\*|[0-5]?[0-9]) (\*|[0-1]?[0-9]|2[0-3]) (\*|[1-9]|[12][0-9]|3[01]) (\*|[1-9]|1[0-2]) (\*|[0-6])$/;
    const isValidCron = cronRegex.test(editfrequency);
    if (!isValidCron) {
      toast.error("Invalid cron expression");
      return
    }
    console.log(isValidCron)
    // api call
    try {
      ////////////////console.log(uniqueUrls);
      const body = {
        name: editName,
        date: editdate,
        amount: editAmount,
        frequency: editfrequency,
        description: editDescription,
        project: editProject,
        owner: editOwner,
        status: editstatus,
        type: editType,
      };
      const responseFormData = await axios.put(`${baseurl}/recurring/${id}`, body);
      axios.get(`${baseurl}/recurring/`).then((res) => {
        setData((res.data).filter((item) => item.isDisabled === (isDisabled === "true")))
      })
      // setPerson(null);
      // setAmount(null);
      // setdatee(null);
      // setPname(null);
      // setDescription(null);
      // setFrequency("0 0 1 * *");
      // setCustomFrequency("");
      // setType(null);
    } catch (error) {

    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseurl}/recurring/${id}`).then((res) => {
      axios.get(`${baseurl}/recurring/`).then((res) => {
        setData((res.data).filter((item) => item.isDisabled === (isDisabled === "true")))
      })
    })
  }
  // redirect to projects page
  let startIndex = currentPage * itemsPerPage;
  let endIndex = (currentPage + 1) * itemsPerPage;
  let currentItems = data.slice(startIndex, endIndex);

  const searchfiles = (searchTerm) => {
    // Create a regex for case-insensitive search
    const regex = new RegExp(searchTerm, 'i');
    // Filter files by checking the IST-converted date
    const filtered = recurring.filter((item) => {
      const istDate = timeinIndia(item.date); // Convert database date to IST
      return (
        regex.test(istDate) ||
        regex.test(item.name) ||
        regex.test(item.description)
      ) // Test the IST date against the regex
    });
    setData(filtered)
    // console.log(filtered);
  };

  const createEntry = async (row, typeofrec) => {
    try {

      let body = {
        project: row.project,
        amount: row.amount,
        recurring: row._id,
        type: row.type,
        person: row.owner,
        subject: row.description,
        typeofrec
      }
      axios.put(`${baseurl}/recurring/centry`, body).then((res) => {
        // setData((res.data).filter((item) => item.isDisabled === (isDisabled === "true")))
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Service</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Tab.Container defaultActiveKey="view">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
              Create Recurring
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="view" className="mb-sm-3 mb-md-0">
              View Recurring
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home" className="py-4">
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
              <Container>
                <form onSubmit={handleUpload}>
                  <Row >
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Creation Date</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Control  type="date" placeholder="Amount" value={datee} onChange={(e) => setdatee(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
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
                    <Col xs={12} md={6}>
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

                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Project Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select value={pname} onChange={(e) => setPname(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {pnamearr.map((option, index) => (
                              <option key={index} value={option._id}>{option.name}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Name</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  type="text" placeholder="Name" value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Frequency</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select
                            value={frequency || "custom"}
                            onChange={handleFrequencyChange}
                          >
                            {predefinedSchedules.map((schedule) => (
                              <option key={schedule.value} value={schedule.value}>
                                {schedule.label}
                              </option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                      {frequency === "" && (
                        <Form.Group id="tasksubject" className="mb-4">
                          <Form.Label>Custom Cron</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                            </InputGroup.Text>
                            <Form.Control  type="text" placeholder="e.g., 0 0 2 * *" value={customFrequency}
                              onChange={handleCustomFrequencyChange}

                            />
                            {error && <p style={{ color: "red" }}>{error}</p>}
                          </InputGroup>
                        </Form.Group>

                      )}
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Type</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {toe.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Contact</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={person} onChange={(e) => setPerson(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {contacts.map((option, index) => (
                              <option key={index} value={option._id}>{option.name}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group id="Taskdescription" className="mb-4">
                        <Form.Label>
                          Description</Form.Label>
                        <InputGroup>
                          <textarea  rows="4" cols="60" type="textarea" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>

                    </Col>
                    <Col className="d-flex justify-content-center"> {/* Centering the submit button */}
                      {stop && (<Button variant="primary" type="submit" className="w-100 mt-3">
                        Submit
                      </Button>)}
                    </Col>

                  </Row>
                </form>
              </Container>
            </section>
          </Tab.Pane>
          {/* Second Pane */}
          <Tab.Pane eventKey="view" className="py-4">
            <Row style={{ width: "100%" }} className="align-items-center">
              <Col xs={12} md={3}>
                {check()[1] == 'john_doe' ? (
                  <Form.Group id="people" >
                    <Form.Label>Is Disabled</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Select value={isDisabled} onChange={(e) => {
                        setisDisabled(e.target.value)
                      }}>
                        {/* <option value="">Select Option</option> */}
                        <option value={true}>True</option>
                        <option value={false}>False</option>

                      </Form.Select>
                    </InputGroup>
                  </Form.Group>) : (null)}
              </Col>
              <Col xs={12} md={4}>
                <Form.Group id="pname" >
                  <Form.Label>Status</Form.Label>
                  <InputGroup>
                    <Form.Select required value={status} onChange={(e) => setstatus(e.target.value)}>
                      <option value="">Select Option</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>

                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <>
                  {/* <Form.Group id="taskstatus" className="mb-4"> */}
                  <Form.Label>Search</Form.Label>
                  <Form.Group controlId="editFileName">
                    <Form.Control
                      
                      required
                      type="text"
                      placeholder="File Name or Date"
                      value={filename}
                      onChange={(e) => {
                        setfilename(e.target.value)
                        searchfiles(e.target.value)
                      }
                      }
                    />
                    {/* </InputGroup> */}
                  </Form.Group>
                </>
              </Col>
              <Col xs={12} md={4}>
                <h1>Sum:{data && data.reduce((acc, curr) => acc + curr.amount, 0)}</h1>
              </Col>

            </Row>
            <Row>
              <Col className="mx-auto">
                <Card style={{ width: "max-content" }} border="light" className="shadow-sm">
                  <Card.Header>

                  </Card.Header>
                  <Table responsive className="align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col" className="unselectable" style={{ cursor: "pointer" }} onClick={() => settemp(temp === 1 ? 2 : 1)}>Date</th>
                        <th scope="col">Name</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Project</th>
                        <th scope="col">Frequency</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {

                        !users && !pnamearr && data.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">loading...</td>
                          </tr>
                        ) : (
                          data.sort((a, b) => {
                            if (temp === 1) {
                                return new Date(a.date) - new Date(b.date); // Ascending order
                            } else if (temp === 2) {
                                return new Date(b.date) - new Date(a.date); // Descending order
                            }
                            return 0;
                          }).
                          map((row, index) => (

                            <tr key={index}>
                              <td>{timeinIndia(row.date)}</td>
                              <td>{row.name}</td>
                              <td>{row.amount}</td>
                              <td>{row.type}</td>
                              <td>{row.description}</td>
                              <td>{contacts && contacts.find((item) => item._id == row.owner)?.name}</td>
                              <td>{pnamearr && pnamearr.find((item) => item._id === row.project)?.name}</td>
                              <td>{row.frequency}</td>

                              <td>
                                <Button onClick={() => createEntry(row, "ExpenseInvoice")}>Create Entry</Button>
                                <Button style={{ backgroundColor: "aqua", color: "black" }} variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button style={{ backgroundColor: "aqua", color: "black" }} variant="info" size="sm" onClick={() => handleDelete(row._id)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>

                              </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                  </Table>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container>


      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false)
      }}>
        <Modal.Header>
          <Modal.Title>Edit Bills</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Creation Date</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Control  required type="date" placeholder="Amount" value={vieweditfiledate} onChange={(e) => {
                seteditdate(e.target.value)
                setvieweditfiledate(new Date(e.target.value).toISOString().split("T")[0])

              }} />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="editDescription">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editDescription">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="text" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Type</Form.Label>
            <InputGroup>
              <Form.Select required value={editType} onChange={(e) => setEditType(e.target.value)}>
                <option value="">Select Option</option>
                {toe.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Description</Form.Label>
            <textarea rows="4" cols="50" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Owner</Form.Label>
            <InputGroup>

              <Form.Select required value={editOwner} onChange={(e) => setEditOwner(e.target.value)}>
                <option value="">Select Option</option>
                {contacts.map((option, index) => (
                  <option key={index} value={option._id}>{option.name}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Projects</Form.Label>
            <InputGroup>

              <Form.Select value={editProject} onChange={(e) => setEditProject(e.target.value)}>
                <option value="">Select Option</option>
                {/* Mapping through the arr array to generate options */}
                {pnamearr.map((option, index) => (
                  <option key={index} value={option._id}>{option.name}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group id="pname" className="mb-4">
            <Form.Label>Status</Form.Label>
            <InputGroup>
              <Form.Select required value={editstatus} onChange={(e) => setEditstatus(e.target.value)}>
                <option value="">Select Option</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>

              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Label>Frequency</Form.Label>

          <Form.Group id="tasksubject" className="mb-4">
            <Form.Label>Custom Cron</Form.Label>
            <InputGroup>
              <InputGroup.Text>
              </InputGroup.Text>
              <Form.Control  type="text" placeholder="e.g., 0 0 2 * *" value={editfrequency}
                onChange={(e) => seteditfrequency(e.target.value)}

              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </InputGroup>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false)
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={(e) => {
            handleEditSubmit(e)
            setShowModal(false)
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
};
export default CreateFunction;


