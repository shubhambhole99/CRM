import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, companies, toe } from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { check } from '../../checkloggedin'
import { getcontacts } from "../../features/contactslice";
import Multiselect from "../../components/Multiselect";
import { fetchProjects } from "../../features/projectslice";
import fileUploader from "../../components/FileUploader";
import handleFileChange from "../../components/HandleFileChange";

const CreateFunction = () => {
  const handleCloseModal = ""
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const itemsPerPage = 5; // Define itemsPerPage
  // State variables for edit modal
  const [stop, setstop] = useState(true)
  ////mine
  const [key, setKey] = useState("");
  const filepath = '../../index.js'
  let history = useHistory();
  // for this file only
  const [users, setUsers] = useState([])
  const [pname, setPname] = useState('')
  const [pnamearr, setPnamearr] = useState([])
  // for this create invoice only
  const [subject, setSubject] = useState(null)
  const [amount, setAmount] = useState(null)
  const [description, setDescription] = useState(null)
  const [person, setPerson] = useState('')
  const [status,setstatus]=useState("Not Paid")
  const token = localStorage.getItem('token');
  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  let [selectedFiles, setSelectedFiles] = useState([]);
  // Edit Modal

  // date
  const [createdate, setCreateDate] = useState('')
  const [debittype, setdebittype] = useState('')
  const [recurring, setRecurring] = useState([])
  const [recur, setrecur] = useState(null)
  const dispatch = useDispatch()
  const [contacts,setcontacts]=useState([])
  // const { contacts, loading, error } = useSelector((state) => state.contact);




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

  useEffect(() => {
    dispatch(getcontacts())
  }, [contacts.length]);

  //For Fetching Users and Projects
  useEffect(() => {
    //////////////////////console.log(check())
    axios.get(`${baseurl}/user`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        //console.error(error);
      });
    axios.get(`${baseurl}/recurring/`).then((res) => {
      setRecurring((res.data).filter((item) => item.isDisabled === ("asd" === "true")))

    })

    dispatch(getcontacts()).then((res) => {
      // console.log(res)
      setcontacts(res)
    }).catch(err => {
      
    })


    handleprojectFetch()
  }, []);



  const handleUpload = async (e) => {
    e.preventDefault()
    console.log(selectedFiles)
    await fileUploader(selectedFiles).then(async (res) => {
      let files = []
      for (let i = 0; i < res.length; i++) {
        files.push({
          filename: res[i][1],
          current: res[i][0]
        })
      }

      // api call
      try {
        ////////////////console.log(uniqueUrls);
        const body = {
          createdAt: createdate == null ? new Date() : createdate,
          amount: amount,
          amount_paid: 0,
          person: person == '' ? undefined : person,
          company: companyname,
          type: debittype,
          project: pname == '' ? undefined : pname,
          description: description,
          subject: subject,
          status:"Not Paid",
          files: files
        };
        const responseFormData = await axios.post(`${baseurl}/expenseinvoice/create`, body);
        setPerson(null);
        setCompanyName(null);
        setdebittype(null);
        setCreateDate(null);
        setIsActive(null);
        setPname(null);
        setSubject(null);
        setAmount(null);
      } catch (error) {

      }
    })
  };
  

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
      <Tab.Container defaultActiveKey="home">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
              Create Debit Invoice
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
                          <Form.Control required  type="date" placeholder="Amount" value={createdate} onChange={(e) => setCreateDate(e.target.value)} />
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
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Type of Debit</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={debittype} onChange={(e) => {
                            setdebittype(e.target.value)
                          }}>
                            {toe.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </Form.Select>
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
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Recurring</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Select value={recur} onChange={(e) => setrecur(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {recurring.filter(r => pname === "" || r.project === pname).map((option, index) => (
                              <option key={index} value={option._id}>{option.name}-{pnamearr.find(p => p._id === option.project)?.name}</option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="tasksubject" className="mb-4">
                        <Form.Label>Subject</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control  type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
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
                    {/* <Col xs={12} md={6}>
                      {person ? (<Form.Group id="Project Image" className="mb-4">
                        <Form.Label>File if Required</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                          </InputGroup.Text>
                          <Form.Control
                            type="file"
                            onChange={async (e) => {
                              let folderName = contacts.find(contact => contact._id == person).name
                              await handleFileChange(e, folderName, setstop).then((temp) => {
                                selectedFiles = temp
                                setSelectedFiles(temp)
                              })

                            }}
                            placeholder="Upload Image"
                          />
                        </InputGroup>
                      </Form.Group>) : (null)}
                    </Col> */}
                    <Col xs={12} md={6}>
                      <Form.Group id="Taskdescription" className="mb-4">
                        <Form.Label>Invoice Description</Form.Label>
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

        </Tab.Content>
      </Tab.Container>
     

    </>
  );
};
export default CreateFunction;


