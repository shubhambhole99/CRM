import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus, banknames, types, Agency } from "../../api";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { check } from '../../checkloggedin'
import Multiselect from "../../components/Multiselect";
import { useDispatch, useSelector } from "react-redux";
import { getcontacts } from "../../features/contactslice";
import { getinvoice } from "../../features/invoiceSlice"
import { fetchProjects } from "../../features/projectslice";
import { getConsolidated, disableConsolidated } from "../../features/consolidatedSlice";


export default () => {

  const [imageUrl, setImageUrl] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [type, settype] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const itemsPerPage = 5; // Define itemsPerPage

  // State variables for edit modal

  const [editIsActive, setEditIsActive] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [arr, setArr] = useState([]);

  ////mine
  const [key, setKey] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  let [selectedFiles, setSelectedFiles] = useState([]);
  const [fileExtension, setFileExtension] = useState('');
  const filepath = '../../index.js'

  let history = useHistory();


  // for this file only
  const [users, setUsers] = useState([])
  let [person, setPerson] = useState("")
  let [pname, setPname] = useState("")
  const [pnamearr, setPnamearr] = useState([])
  const [invoice, setInvoice] = useState(null)
  const [selectedusers, setSelectedusers] = useState([])
  // for this create invoice only
  const [subject, setSubject] = useState(null)
  const [amount, setAmount] = useState(0)
  let [paymenttype, setPaymenttype] = useState("")

  const [credittype, setcredittype] = useState(null)
  const [bankaccount, setbankaccount] = useState(null)
  let [editUrls, setEditUrls] = useState([])
  let [editmode, seteditmode] = useState(false)


  const dispatch = useDispatch()
  const { contacts, loading, error } = useSelector((state) => state.contact);
  const { invoices, loading1, error1 } = useSelector((state) => state.invoice)
  let [invoices1, setInvoices] = useState([])
  const token = localStorage.getItem('token');





  // project filtering
  let [isActive, setIsActive] = useState(null);
  let [companyname, setCompanyName] = useState('')
  let [isActives, setIsActives] = useState(null)
  let [amounttbrecieved, setAmounttbRecieved] = useState(0)
  let [amountrecieved, setAmountRecieved] = useState(0)
  let [consoid, setconsoid] = useState("")

  const fileInputRef = useRef(null);
  const [paymentproof, setPaymentproof] = useState(false)

  // for Consolidated
  let [conso, setConso] = useState([])

  let [id, setid] = useState('')
  let [description, setDescription] = useState('')

  // let [editproject,setEditProject]=useState('')

  let [editDescription, setEditDescription] = useState('')


  let [questions, setQuestions] = useState([])
  let [isDisabled, setisDisabled] = useState(false)




  const handleUpload = async (e) => {
    e.preventDefault()

    try {
      const body = {
        question: description,
        type: type
      };
      const responseFormData = await axios.post(`${baseurl}/question/create`, body);
      ////////console.log(responseFormData);
      toast.success('Question Added successfully'); // Call toast.success after successful addition
      axios.get(`${baseurl}/question`)
        .then(response => {
          //////console.log(response.data)
          setQuestions(response.data)
        })
      setDescription('')
    } catch (error) {
      //console.error(error);
      // Assuming res is not defined, use //console.error instead
      //console.error({ message: "backend error", data: error });
    }
  };





  ////////////////////////////////////////////

  const handleprojectFetch = async () => {
    //////////////////////console.log(companyname)
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: isActive ? isActive : null
    })).then((resp) => {
      setPnamearr(resp)
      // //////////console.log(resp)
    }).catch(error => {

    })

  }

  const sortbyorder = () => {
    let arr = questions
    //console.log(questions)
    arr.sort((a, b) => a.order - b.order);
    setQuestions(arr)
  }
  useEffect(() => {
    //////////////////////console.log(check())
    axios.get(`${baseurl}/question`)
      .then(response => {
        questions = response.data
        sortbyorder()
      })
      .catch(error => {
        //console.error(error);
      }, []);



    // dispatch(getcontacts())
    // dispatch(getinvoice())
    dispatch(getConsolidated()).then((res) => {
      //////console.log(res)
      setConso(res)
    }).catch(err => {
      //////console.log(err)
    })
    setInvoices(invoices)
    //////////////////console.log(contacts)
    ////////////console.log(invoices)
  }, [contacts.length, invoices.length]);


  const fetchquestions = (isd) => {
    let body = {
      isDisabled: isd
    }
    //////console.log(body)
    axios.put(`${baseurl}/question/`, body)
      .then(response => {
        //////console.log(response.data)
        // let arr = response.data
        // arr.sort((a, b) => a.order - b.order);
        setQuestions(response.data)

      })
      .catch(error => {
        //console.error(error);
      });
  }






  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    //////console.log("here",id)
    axios.delete(`${baseurl}/question/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        //////////////////////console.log('Record deleted successfully:', response.data);
        // setData(prevData => prevData.filter(item => item.id !== id));
        toast.success('Record deleted successfully'); // Display success toast
      })
      .catch(error => {
        //console.error('Error deleting record:', error);
        toast.error('Failed to delete record'); // Display error toast
      });
  }
  // Calculate the index of the first item to display based on the current page and items per page



  const changeorder = (id, value) => {
    try {

      //////console.log(id, value)
    } catch (err) {

    }

  }

  const findprojectname = (project) => {
    //////////////////console.log(project,"Find project name")
    // //////////////////////console.log(pnamearr)
    let str = ""
    for (let i = 0; i < pnamearr.length; i++) {
      // //////////////////console.log(pnamearr[i])
      if (pnamearr[i]._id == project) {
        str = str + "{" + pnamearr[i].name + "}"
        break
      }

    }
    // for(let i=0;i<projects.length;i++){
    //////////////////////console.log(projects[i])
    //     for(let j=0;j<pnamearr.length;j++){
    //   if(pnamearr[j]._id==projects[i]){
    //     str=str+"{"+pnamearr[j].name+"}"
    //     break
    //   }
    //     }
    //   }
    return str
  }
  // https://officecrm560.s3.ap-south-1.amazonaws.com/Imtiaz+Bandra++41./Lucky+Realty+Bandra1717420102462.xlsx
  // https://officecrm560.s3.ap-south-1.amazonaws.com/Imtiaz+Bandra++41./Lucky+Realty+Bandra1717419135299.xlsx
  const handleEditModal = (item) => {
    //////console.log(item)
    setid(item._id)
    setEditDescription(item.question)
    settype(item.type)
    setShowModal(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
  }


  const handleEditSubmit = async (e) => {
    e.preventDefault()

    try {


      const ids = selectedusers.map(user => user.id);
      const body = {
        question: editDescription,
        type: type

      };
      //////console.log(body)



      const responseFormData = await axios.put(`${baseurl}/question/${id}`, body);
      ////////console.log(responseFormData);
      toast.success('Edited successfully'); // Call toast.success after successful addition
      axios.get(`${baseurl}/question`)
        .then(response => {
          questions = response.data
          let arr = questions
          arr.sort((a, b) => a.order - b.order);
          setQuestions(arr)
        })
        .catch(error => {
          //console.error(error);
        })


      setShowModal(false)

      setSelectedFiles([])
    } catch (error) {
      //console.error(error);
      // Assuming res is not defined, use //console.error instead
      //console.error({ message: "backend error", data: error });
    }
  }
  const handleEditOrder = async (id, order) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question._id === id ? { ...question, order: order } : question
      ));

    try {


      const ids = selectedusers.map(user => user.id);
      const body = {
        order: order,

      };
      //////console.log(body)



      const responseFormData = await axios.put(`${baseurl}/question/${id}`, body);
      ////////console.log(responseFormData);
      toast.success('Edited successfully'); // Call toast.success after successful addition
      // axios.get(`${baseurl}/question`)
      //   .then(response => {
      //     let arr = response.data
      //     //console.log(questions)
      //     arr.sort((a, b) => a.order - b.order);
      //     setQuestions(arr)

      //   })
      //   .catch(error => {
      //     //console.error(error);
      //   })


      setShowModal(false)

      setSelectedFiles([])
    } catch (error) {
      //console.error(error);
      // Assuming res is not defined, use //console.error instead
      //console.error({ message: "backend error", data: error });
    }
  }
  // redirect to projects page

  let startIndex = currentPage * itemsPerPage;
  let endIndex = (currentPage + 1) * itemsPerPage;
  let currentItems = data.slice(startIndex, endIndex);

  const checkon = (e, id) => {
    e.preventDefault()
    // set
    //////console.log(id)
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
      <Tab.Container defaultActiveKey="profile">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">

              Create Project
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
              Table
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
                      <Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Question</Form.Label>
                      </Form.Group>
                      <textarea rows="4" cols="60" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group id="pname" className="mb-4">
                        <Form.Label>Link/Text</Form.Label>
                        <InputGroup>
                          <InputGroup.Text></InputGroup.Text>
                          <Form.Select value={type} onChange={(e) => {
                            settype(e.target.value)
                          }}>
                            <option value="">Select Option</option>
                            <option value="Text">Text</option>
                            <option value="Link">Link</option>

                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col className="d-flex justify-content-center"> {/* Centering the submit button */}
                      <Button style={{ height: "100px" }} variant="primary" type="submit" className="w-100 mt-3">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </form>
              </Container>
            </section>
          </Tab.Pane>
          <Tab.Pane eventKey="profile" className="py-4">
            <Card border="light" className="shadow-sm">
              {/* Second Pane */}
              <Row>

                <Col xs={12} md={4}>

                  {check()[1] == 'john_doe' ? (<Form.Group id="taskstatus" className="mb-4">

                    <Form.Label>isDisabled</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Select value={isDisabled} onChange={(e) => {
                        isDisabled = e.target.value
                        setisDisabled(e.target.value);
                        fetchquestions(e.target.value)
                      }}>
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>) : (<p>{check()[1]}</p>)}
                </Col>

              </Row>
              <Button variant="secondary" style={{ width: "60px" }} size="sm" onClick={(e) => seteditmode(true)}>Edit</Button>
              <Button variant="secondary" style={{ width: "80px" }} size="sm" onClick={(e) => sortbyorder()}>Sort By Order</Button>
              {editmode ? (<Button variant="secondary" style={{ width: "80px" }} size="sm" onClick={(e) => {
                seteditmode(false)
                axios.get(`${baseurl}/question`)
                  .then(response => {
                    questions = response.data
                    let arr = questions
                    arr.sort((a, b) => a.order - b.order);
                    setQuestions(arr)
                  })
                  .catch(error => {
                    //console.error(error);
                  });
              }}>Submit</Button>) : (null)}

              <Table responsive style={{ width: "maxWidth" }} className="align-items-center table-flush">
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col">#</th> */}
                    <th scope="col">Order</th>
                    <th scope="col">Type</th>
                    <th scope="col" colSpan={7}>Question</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((row, index) => (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}
                      <td>{editmode ? (
                        <Form.Control className="w-20" type="textarea" value={row.order}
                          onChange={(e) => handleEditOrder(row._id, e.target.value)}
                        />
                      ) : (<p>{row.order}</p>)}</td>
                      <td scope="col">{row.type}</td>
                      <td scope="col" colSpan={7}>{row.question}</td>

                      <td>
                        <Button style={{ backgroundColor: "aqua", color: "black" }} variant="info" size="sm" onClick={() => handleEditModal(row)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button style={{ borderColor: "black", backgroundColor: "aqua", color: "black", marginLeft: "2%" }} onClick={() => handleDelete(row._id)} variant="danger" size="sm">
                          <FontAwesomeIcon icon={faTrash} />
                        </Button></td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Edit Consolidated Bills</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Question</Form.Label>
          </Form.Group>
          <textarea rows="4" cols="50" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />

          <Form.Group id="pname" className="mb-4">
            <Form.Label>Link/Text</Form.Label>
            <InputGroup>
              <InputGroup.Text></InputGroup.Text>
              <Form.Select value={type} onChange={(e) => {
                settype(e.target.value)
              }}>
                <option value="">Select Option</option>
                <option value="Text">Text</option>
                <option value="Link">Link</option>

              </Form.Select>
            </InputGroup>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={(e) => handleEditSubmit(e)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
