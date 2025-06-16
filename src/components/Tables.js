import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faTrash, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Modal, Form, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Routes } from "../routes";
import { pageVisits, pageTraffic, pageRanking } from "../data/tables";
import transactions from "../data/transactions";
import commands from "../data/commands";
import Multiselect from "../components/Multiselect";

import { baseurl } from "../api";
import ViewTaskHistory from "../pages/components/ViewTaskHistory";
import { fetchAsyncData } from "../features/userslice";
import { getAllBuckets, deleteTaskFromBucket } from "../features/bucketslice";  // Import your action
import { check } from "../checkloggedin"
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../features/projectslice";

// 




export const PageVisitsTable = (props) => {

  //mine
  let { data, handleComplete, setrefreshbucket, refreshbucket, fetchBuckets, handleSaveChanges, filteredBuckets } = props

  //For Fetching Projects

  // const [showModal, setShowModal] = useState(false);
  // const [showModal1, setShowModal1] = useState(false);



  const [history, setHistory] = useState([])
  const [taskthis, settaskthis] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [taskIds, setTaskIds] = useState([]);

  // view task History
  //view add History
  const [taskid, seteditTaskid] = useState("")
  const [texthistory, setaddtexthistory] = useState("")
  const [showModal2, setShowModal2] = useState(false);
  const [pnamearr, setPnamearr] = useState([]);
  const [showModal3, setShowModal3] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedtasks, setcompletedTasks] = useState([]);
  const [incompletedtasks, setincompletedTasks] = useState([]);
  let [iccta, seticcta] = useState([])
  const [buckets, setBuckets] = useState([]);  // Initialize buckets state
  const dispatch = useDispatch();


  const [reverse, setreverse] = useState(false)

  const { user1, loading, error } = useSelector((state) => state.users);
  // for edit modal
  const [editassignTaskTo, setEditassignTaskTo] = useState([])
  const [editprojectname, setEditprojectname] = useState("")
  const [edittaskDescription, setEdittaskDescription] = useState("")
  const [edittaskSubject, setEdittaskSubject] = useState("")
  const [showModal, setShowModal] = useState("")
  // const []

  useEffect(() => {
    fetchBuckets();  // handleComplete the fetch function
    // Fetch users and projects

    iccta = data
    seticcta(data)
  }, [data]);

  useEffect(() => {
    //////console.log(filteredBuckets)
    iccta = data
    seticcta(data)
  }, [reverse, filteredBuckets])

  useEffect(() => {
    // Fetch projects and Users
    dispatch(fetchProjects({
    })).then((resp) => {
      setPnamearr(resp)
      // //////console.log(resp)
    }).catch(error => {
    })


    dispatch(fetchAsyncData()).then((data) => {
      // //console.log(data)
    }).catch((err) => {

    })
  }, [])
  useEffect(() => {
    // //console.log(user1)
  }, [loading])

  const findprojectname = (id) => {
    // //////console.log(id,pnamearr)
    for (let i = 0; i < pnamearr.length; i++) {
      if (pnamearr[i]._id == id) {
        // //////console.log(pnamearr[i].name)
        return pnamearr[i].name
      }
    }
  }
  const sortbydate = () => {
    data = data.reverse()
    setreverse(!reverse)
  }


  const handletaskhistory = async (row) => {
    ////////////////////console.log("hi")
    try {
      // fetching all Histories of one task
      let response = await axios.get(`${baseurl}/history/${row._id}`)
      let temp = []

      for (let i = 0; i < response.data.length; i++) {
        let res = await axios.get(`${baseurl}/history/single/${(response.data)[i]._id}`)
        temp.push(res.data)
        ////////////////////console.log(temp)
      }
      setHistory(temp)


    } catch (error) {
      ////////////////////console.log(error)
    }


    setShowModal1(true)
    settaskthis(true)
  }

  const handleaddtaskhistory = async (row) => {
    ////////////////////console.log(row._id)
    seteditTaskid(row._id)
    //////console.log(row._id)
    setShowModal2(true)

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
      taskSubject: edittaskSubject
    };
    //////////////////console.log(editData)

    try {
      const response = await axios.put(`${baseurl}/task/${taskid}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //////////////////console.log(response.data);
      toast.success("Task updated successfully");
      setShowModal(false);
      seteditTaskid("")
      setEditassignTaskTo([])
      setEditprojectname("")
      setEdittaskDescription("")
      setEdittaskSubject("")
      setrefreshbucket(!refreshbucket)
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  }



  const handleaddhistorysubmit = async (row) => {
    ////////////////////console.log(texthistory)
    const token = localStorage.getItem('token');
    const editData = {
      taskDescription: texthistory,
    };
    ////////////////////console.log(editData)

    try {
      const response = await axios.post(`${baseurl}/history/create/${taskid}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      ////////////////////console.log(response.data);
      // toast.success("History added successfully");
      setShowModal2(false);
      setaddtexthistory("")
    } catch (error) {
      //console.error(error);
      toast.error("Failed to add history");
    }
  }

  const handledeletetaskhistory = async (row) => {

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${baseurl}/history/${row.taskHistory._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("History deleted successfully");
      setShowModal1(false)
    } catch (error) {
      toast.error(error.message)
    }

  }
  const handleedittaskHistory = async (row) => {

    setShowModal2(true)
    setTaskhistoryId(row.taskHistory._id)
    setTextHistory(row.taskHistory.taskDescription)

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
  const handleEditModal = (item) => {
    //////////////////console.log(item)
    let temp = []
    let tempuser = item.assignTaskTo
    for (let j = 0; j < user1.length; j++) {
      if ((tempuser).includes(user1[j]._id)) {
        temp.push({
          id: user1[j]._id,
          name: user1[j].username,
        })
      }
    }
    seteditTaskid(item._id)
    setEditassignTaskTo(temp)
    setEditprojectname(item.projectid)
    setEdittaskDescription(item.taskDescription)
    setEdittaskSubject(item.taskSubject)
    setShowModal(true);
    // setEditMode(true); // Set editMode to true when opening the edit modal
  }


  const TableRow1 = ({ data2, hello }) => {
    // Format the CreatedAt date
    const formattedDate = new Date(data2.CreatedAt).toLocaleDateString('en-GB');

    return (
      <>
        {pnamearr && (
          <tr style={{ maxWidth: "100px", cursor: "pointer", whiteSpace: "pre-wrap" }}>
            <td style={{ width: "2%" }} onClick={() => handletaskhistory(data2)}>{formattedDate}</td>
            <td style={{ width: "2%", textDecoration: "underline", color: "blue", whiteSpace: "pre-wrap" }} onClick={() => handletaskhistory(data2)} scope="row">{findprojectname(data2.projectid)}</td>
            <td style={{ width: "2%", whiteSpace: "pre-wrap" }} onClick={() => handletaskhistory(data2)}>{data2.taskSubject}</td>

            <td style={{ width: "2%", cursor: "pointer", whiteSpace: "pre-wrap" }}
              onClick={() => handletaskhistory(data2)}>
              <pre style={{ whiteSpace: "pre-wrap" }}>{data2.taskDescription}</pre>
            </td>
            <td style={{ width: "2%", whiteSpace: "pre-wrap" }} onClick={() => handletaskhistory(data2)}>{getUsernameById([data2.assignedby])}</td>
            <td style={{ width: "10%" }}>
              <Button style={{ backgroundColor: "black", color: "black" }} variant="info" size="sm" onClick={() => handleEditModal(data2)}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button onClick={() => handleaddtaskhistory(data2)} style={{ color: "black", height: "40px" }}>Add</Button>
              <Button style={{ color: "black", height: "40px" }} onClick={() => handleComplete(data2._id, data2.taskCompleted)}>
                {data2.taskCompleted ? <>Mark incomplete</> : <>Mark complete</>}
              </Button>
              <Button onClick={() => handleSaveChanges(data2)} style={{ color: "black", height: "40px" }}>
                {checkinbuckets(data2._id) === false ? <p>Bucket</p> : <p>Already in Bucket</p>}
              </Button>
            </td>
          </tr>
        )}

      </>
    );
  };

  const checkinbuckets = (taskId) => {
    if (filteredBuckets == undefined || filteredBuckets.length == 0) {
      return false
    }
    else {
      let alltasks = filteredBuckets[0].tasks
      let flag = false
      for (let i = 0; i < alltasks.length; i++) {
        if (alltasks[i]._id == taskId) {
          flag = true
        }
      }
      return (flag)
    }

  }
  return (
    <>
      <Card border="light" className="shadow-sm">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5>Tasks</h5>
            </Col>
            <Col className="text-end">
              <Button variant="secondary" size="sm">See all</Button>
            </Col>
          </Row>
        </Card.Header>
        <Table responsive className="align-items-center table-flush">
          <thead className="thead-light">
            <tr >
              <th scope="col" onClick={() => {
                sortbydate()
              }} style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>Created At</th>
              <th scope="col">Project Name</th>
              <th scope="col">Task subject</th>
              <th scope="col">Task Description</th>
              <th scope="col">Assigned By</th>

              {/* <th scope="col">Add Task Event Mark Task Complete</th> */}
              {/* <th scope="col"></th> */}
              <th></th>

            </tr>
          </thead>
          <tbody>
            {filteredBuckets && (<>
              {iccta.map((data1) => (
                <TableRow1
                  key={data1._id} // Ensure _id is unique for each task
                  data2={data1}
                />
              ))}
            </>)}




          </tbody>

          <ViewTaskHistory history={history} showModal1={showModal1} setShowModal1={setShowModal1} />


          {/* add history */}
          <Modal className="#modal-content" style={{ width: "100%" }} show={showModal2} onHide={() => setShowModal2(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Task History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="editHeading">
                <textarea rows="8" style={{ width: "100%" }} value={texthistory} onChange={(e) => setaddtexthistory(e.target.value)} />
              </Form.Group>


            </Modal.Body>
            <Modal.Footer>

              <Button variant="secondary" onClick={() => setShowModal2(false)}>
                Cancel
              </Button>
              <Button style={{ backgroundColor: "greenyellow" }} variant="secondary" onClick={handleaddhistorysubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>


        </Table>
      </Card>


      {/* edit modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Edit Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {/* <Form.Group className="mb-3" controlId="editDescription">
                       <Form.Label>Project name</Form.Label>
             <Form.Select required value={editprojectname} onChange={(e) => setEditprojectname(e.target.value)}>
                   <option value="">Select Option</option>
                    
                     {pnamearr.map((option, index) => (
                       <option key={index} value={option._id}>{option.name}</option>
                     ))}
                   </Form.Select>
                   </Form.Group> */}
          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Task Description</Form.Label>
            <textarea rows="4" cols="50" type="text" value={edittaskDescription} onChange={(e) => setEdittaskDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editHeading">
            <Form.Label>Task Subject</Form.Label>
            <Form.Control type="text" value={edittaskSubject} onChange={(e) => setEdittaskSubject(e.target.value)} />
          </Form.Group>

          {/* People */}
          <Form.Group className="mb-3" controlId="editIsActive">
            {user1 ? (<Multiselect
              selectedValues={editassignTaskTo}
              setSelectedValues={setEditassignTaskTo}
              options={user1} />) : (
              <p>loading</p>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};


const TableRow = (props) => {
  const { pageName, views, returnValue, bounceRate } = props;
  const bounceIcon = bounceRate < 0 ? faArrowDown : faArrowUp;
  const bounceTxtColor = bounceRate < 0 ? "text-danger" : "text-success";

  return (
    <tr>
      <th scope="row">{pageName}</th>
      <td>{views}</td>
      <td>${returnValue}</td>
      <td>
        <FontAwesomeIcon icon={bounceIcon} className={`${bounceTxtColor} me-3`} />
        {Math.abs(bounceRate)}%
      </td>
    </tr>
  );
};

export const PageTrafficTable = () => {
  const TableRow = (props) => {
    const { id, source, sourceIcon, sourceIconColor, sourceType, category, rank, trafficShare, change } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{id}</Card.Link>
        </td>
        <td className="fw-bold">
          <FontAwesomeIcon icon={sourceIcon} className={`icon icon-xs text-${sourceIconColor} w-30`} />
          {source}
        </td>
        <td>{sourceType}</td>
        <td>{category ? category : "--"}</td>
        <td>{rank ? rank : "--"}</td>
        <td>
          <Row className="d-flex align-items-center">
            <Col xs={12} xl={2} className="px-0">
              <small className="fw-bold">{trafficShare}%</small>
            </Col>
            <Col xs={12} xl={10} className="px-0 px-xl-1">
              <ProgressBar variant="primary" className="progress-lg mb-0" now={trafficShare} min={0} max={100} />
            </Col>
          </Row>
        </td>
        <td>
          <ValueChange value={change} suffix="%" />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0">Traffic Source</th>
              <th className="border-0">Source Type</th>
              <th className="border-0">Category</th>
              <th className="border-0">Global Rank</th>
              <th className="border-0">Traffic Share</th>
              <th className="border-0">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageTraffic.map(pt => <TableRow key={`page-traffic-${pt.id}`} {...pt} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const RankingTable = () => {
  const TableRow = (props) => {
    const { country, countryImage, overallRank, overallRankChange, travelRank, travelRankChange, widgetsRank, widgetsRankChange } = props;

    return (
      <tr>
        <td className="border-0">
          <Card.Link href="#" className="d-flex align-items-center">
            <Image src={countryImage} className="image-small rounded-circle me-2" />
            <div><span className="h6">{country}</span></div>
          </Card.Link>
        </td>
        <td className="fw-bold border-0">
          {overallRank ? overallRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={overallRankChange} />
        </td>
        <td className="fw-bold border-0">
          {travelRank ? travelRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={travelRankChange} />
        </td>
        <td className="fw-bold border-0">
          {widgetsRank ? widgetsRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={widgetsRankChange} />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">Country</th>
              <th className="border-0">All</th>
              <th className="border-0">All Change</th>
              <th className="border-0">Travel & Local</th>
              <th className="border-0">Travel & Local Change</th>
              <th className="border-0">Widgets</th>
              <th className="border-0">Widgets Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRanking.map(r => <TableRow key={`ranking-${r.id}`} {...r} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};


const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const TransactionsTable = () => {
  const totalTransactions = transactions.length;

  const TableRow = (props) => {
    const { invoiceNumber, subscription, price, issueDate, dueDate, status } = props;
    const statusVariant = status === "Paid" ? "success"
      : status === "Due" ? "warning"
        : status === "Canceled" ? "danger" : "primary";

    return (
      <tr>
        <td>
          <Card.Link as={Link} to={Routes.Invoice.path} className="fw-normal">
            {invoiceNumber}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">
            {subscription}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {issueDate}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {dueDate}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            ${parseFloat(price).toFixed(2)}
          </span>
        </td>
        <td>
          <span className={`fw-normal text-${statusVariant}`}>
            {status}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <FontAwesomeIcon icon={faEye} className="me-2" /> View Details
              </Dropdown.Item>
              <Dropdown.Item>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger">
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">#</th>
              <th className="border-bottom">Bill For</th>
              <th className="border-bottom">Issue Date</th>
              <th className="border-bottom">Due Date</th>
              <th className="border-bottom">Total</th>
              <th className="border-bottom">Status</th>
              <th className="border-bottom">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => <TableRow key={`transaction-${t.invoiceNumber}`} {...t} />)}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Prev>
                Previous
              </Pagination.Prev>
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Item>4</Pagination.Item>
              <Pagination.Item>5</Pagination.Item>
              <Pagination.Next>
                Next
              </Pagination.Next>
            </Pagination>
          </Nav>
          <small className="fw-bold">
            Showing <b>{totalTransactions}</b> out of <b>25</b> entries
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export const CommandsTable = () => {
  const TableRow = (props) => {
    const { name, usage = [], description, link } = props;

    return (
      <tr>
        <td className="border-0" style={{ width: '5%' }}>
          <code>{name}</code>
        </td>
        <td className="fw-bold border-0" style={{ width: '5%' }}>
          <ul className="ps-0">
            {usage.map(u => (
              <ol key={u} className="ps-0">
                <code>{u}</code>
              </ol>
            ))}
          </ul>
        </td>
        <td className="border-0" style={{ width: '50%' }}>
          <pre className="m-0 p-0">{description}</pre>
        </td>
        <td className="border-0" style={{ width: '40%' }}>
          <pre><Card.Link href={link} target="_blank">Read More <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" /></Card.Link></pre>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0">
        <Table responsive className="table-centered rounded" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <thead className="thead-light">
            <tr>
              <th className="border-0" style={{ width: '5%' }}>Name</th>
              <th className="border-0" style={{ width: '5%' }}>Usage</th>
              <th className="border-0" style={{ width: '50%' }}>Description</th>
              <th className="border-0" style={{ width: '40%' }}>Extra</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(c => <TableRow key={`command-${c.id}`} {...c} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};