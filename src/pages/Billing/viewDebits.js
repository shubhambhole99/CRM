import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit, faRadiation, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { baseurl, ProjectStatus, banknames, toi, tds, gst, companies, toe } from "../../api";
import { getbill, disableBill, fetchbillsafterdisable } from '../../features/billslice'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import React, { useState, useEffect } from "react";
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useSelector, useDispatch } from 'react-redux';
import { getcontacts, deleteContact } from '../../features/contactslice'
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { check, timeinIndia } from '../../checkloggedin';
import Multiselect from "../../components/Multiselect";
import { getinvoice, disableinvoice } from '../../features/invoiceSlice'
import '../../style.css'; // Import the CSS file where your styles are defined
import { fetchProjects } from "../../features/projectslice";
import { getConsolidated } from "../../features/consolidatedSlice";
import { getexpenseinvoice } from "../../features/expenseInvoiceSlice";
import fileUploader from "../../components/FileUploader";
import handleFileChange from "../../components/HandleFileChange";
import { getexpense } from '../../features/expenseSlice';


const ViewDebits = () => {
    const dispatch = useDispatch();
    const [typebill, setTypebill] = useState("invoice")
    const [companyname, setCompanyName] = useState("")
    const [pnamearr, setPnamearr] = useState([])
    const [person, setPerson] = useState('')
    const [contacts, setContacts] = useState([])
    const [bank, setBank] = useState("")
    const [fgst, setgst] = useState('')
    const [ftds, settds] = useState('')
    const [isDisabled, setisDisabled] = useState(false)
    const [expenseInvoices, setExpenseInvoices] = useState([])
    const [expense, setExpense] = useState([])
    let [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showModal1, setShowModal1] = useState(false)
    const [id, setid] = useState('')
    const [editAmount, setEditAmount] = useState('')
    const [editBank, setEditBank] = useState('')
    const [editCompany, setEditCompany] = useState('')
    const [editDate, setEditDate] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editInvoice, setEditInvoice] = useState('')
    let [editPerson, setEditPerson] = useState('')
    const [editProject, setEditProject] = useState('')
    const [editSubject, setEditSubject] = useState('')
    const [editType, setEditType] = useState(null)
    const [edittds, setEdittds] = useState('')
    const [editgst, setEditgst] = useState('')
    const [editdate, seteditdate] = useState('')
    const [recurring, setRecurring] = useState([])
    const [rec, setrec] = useState("")
    const [stop, setstop] = useState(true)
    const [status, setStatus] = useState("")
    const [editrec, setEditrec] = useState("")
    const [editstatus, setEditStatus] = useState('')
    let [selectedFiles, setSelectedFiles] = useState([]);
    const [fileno, setfileno] = useState(null)
    let [editfiles, setEditfiles] = useState([])
    const [vieweditfiledate, setvieweditfiledate] = useState(null)

    let [pname, setPname] = useState('')
    let [isActive, setIsActive] = useState(null)
    const handleprojectFetch = async () => {
        dispatch(fetchProjects({
            company: companyname ? companyname : null,
            status: isActive ? isActive : null
        })).then((resp) => {
            setPnamearr(resp)
        }).catch(error => {
        })
    }
    useEffect(() => {
        handleprojectFetch();
        dispatch(getcontacts()).then((res) => {
            setContacts(res)
        })
        dispatch(getexpenseinvoice()).then((res) => {
            setExpenseInvoices(res)
            setData(res.filter((item) => item.isDisabled === (isDisabled === "true")))
        })
        dispatch(getexpense()).then((res) => {
            setExpense(res)
        })
        axios.get(`${baseurl}/recurring/`).then((res) => {
            setRecurring((res.data).filter((item) => item.isDisabled == false))
        })


    }, []);

    const handleFilter = () => {

        if (typebill == 'invoice') {
            setData(expenseInvoices.filter((item) =>
                // (companyname === "" || item.company === companyname) &&
                (pname === "" || item.project === pname) &&
                (bank === "" || item.bank === bank) &&
                (person === "" || item.person === person) &&
                (status === "" || item.status === status) &&
                (rec === "" || item.recurring === rec) &&
                (isDisabled === "" || item.isDisabled === (isDisabled === "true"))
                // (credittype === "" || item.type === credittype) &&
                // (fgst === "" || item.gst === fgst) &&
                // (ftds === "" || item.tds === ftds) &&
            ))

            // console.log("expenseInvoices ==> ", expenseInvoices);
        }
        else {
            setData(expense)
        }
    }
    const handleEditModal = (item) => {
        if (typebill == 'expense') {
            setid(item._id)
            seteditdate(item.date);
            setEditAmount(item.amount);
            setEditBank(item.bank);
            setEditPerson(item.person);
            setEditProject(item.project);
            setEditSubject(item.subject);
            setEditDescription(item.description);
            setEditInvoice(item.invoice);
            setEdittds(item.tds)
            setEditgst(item.gst)
            setEditfiles(item.files)
        }
        if (typebill == 'invoice') {
            setid(item._id)
            seteditdate(item.date);
            setEditAmount(item.amount);
            setEditPerson(item.person);
            setEditProject(item.project);
            setEditSubject(item.subject);
            setEditDescription(item.description);
            setvieweditfiledate(new Date(item.date).toISOString().split("T")[0])
            setEditType(item.type)
            setEditfiles(item.files)
            setEditStatus(item.status)
            setEditrec(item.recurring)


        }
    }
    const handleEditSubmit = async (e) => {
        console.log(selectedFiles, fileno);
        e.preventDefault();

        try {
            await fileUploader(selectedFiles).then(async (res) => {
                console.log(res);

                // Clone editfiles to ensure mutability
                let newEditFiles = Array.isArray(editfiles) ? editfiles.map(file => ({ ...file })) : [];

                // Ensure fileno is within a valid range
                if (res.length > 0) {



                    // Clone the specific file object before modifying it
                    if (!newEditFiles[fileno]) {
                        newEditFiles[fileno] = {
                            prevlinks: [],
                            current: "",
                            filename: "",
                            uploaddate: new Date(),
                            date: new Date(),
                            isDisabled: false,
                            recurring: setEditrec
                        };
                    } else {
                        // Deep clone prevlinks to ensure it’s a mutable array
                        newEditFiles[fileno] = { ...newEditFiles[fileno], prevlinks: [...(newEditFiles[fileno].prevlinks || [])] };
                    }

                    // Move old current to prevlinks before updating
                    if (newEditFiles[fileno].current) {
                        newEditFiles[fileno].prevlinks.push(newEditFiles[fileno].current);
                    }

                    // Update current file link
                    newEditFiles[fileno].current = res[0][0];
                }
                ////////////////console.log(uniqueUrls);
                const body = {
                    date: editdate,
                    amount: editAmount,
                    person: editPerson,
                    subject: editSubject,
                    description: editDescription,
                    project: editProject,
                    type: editType,
                    files: newEditFiles,
                    status: editstatus

                };
                // console.log(newEditFiles)
                await axios.put(`${baseurl}/expenseinvoice/${id}`, body).then((res) => {
                    dispatch(getexpenseinvoice()).then((res) => {
                        setExpenseInvoices(res)
                        setData(res.filter((item) =>
                            (companyname === "" || item.company === companyname) &&
                            (pname === "" || item.project === pname) &&
                            (bank === "" || item.bank === bank) &&
                            (person === "" || item.person === person) &&
                            (isDisabled === "" || item.isDisabled === (isDisabled === "true"))



                        ))
                    })
                })

                // setPerson(null);
                // setAmount(null);
                // setdatee(null);
                // setPname(null);
                // setDescription(null);
                // setFrequency("0 0 1 * *");
                // setCustomFrequency("");
                // setType(null);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleDelete = async (id) => {
        await axios.delete(`${baseurl}/expenseinvoice/${id}`).then((res) => {
            dispatch(getexpenseinvoice()).then((res) => {
                setExpenseInvoices(res)
                setData(res.filter((item) => item.isDisabled === (isDisabled === "true")))
            })
        })
    }
    const downloadFile = async (fileUrl, fileName) => {
        try {
            // Fetch the file
            const urlParts = fileUrl.split('/');
            // Replace the domain part (e.g., officecrm560)
            urlParts[2] = urlParts[2].replace(/^[^\.]+/, "officecrm560");
            fileUrl = urlParts.join('/');
            console.log(fileUrl)
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch file");
            }
            const blob = await response.blob();

            // Create a link element and download the file with a custom name
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName; // Specify the custom file name here
            document.body.appendChild(a);
            a.click();

            // Cleanup
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    }
    // const downloadFile = async (fileUrl) => {
    //     try {
    //         // Fetch the file
    //         const urlParts = fileUrl.split('/');
    //         // Replace the domain part (e.g., officecrm560)
    //         urlParts[2] = urlParts[2].replace(/^[^\.]+/, "officecrm560");
    //         fileUrl = urlParts.join('/');
    //         console.log(fileUrl)
    //         const response = await fetch(fileUrl);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch file");
    //         }
    //         const blob = await response.blob();

    //         // Extract the filename from the URL
    //         const fileName = urlParts[urlParts.length - 1];

    //         // Create a link element and download the file with the extracted name
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement("a");
    //         a.href = url;
    //         a.download = fileName; // Use the extracted file name
    //         document.body.appendChild(a);
    //         a.click();

    //         // Cleanup
    //         a.remove();
    //         window.URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error("Error downloading the file:", error);
    //     }
    // }

    return (
        <>
            {/* Filter */}
            <form onSubmit={(e) => {
                handleFilter()
                e.preventDefault()
            }
            }>
                <Row>
                    <Col xs={12} md={3} >
                        <Form.Group id="pname" className="mb-4">
                            <Form.Label>Type</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={typebill} onChange={(e) => {
                                    setTypebill(e.target.value);
                                    // changeData(e.target.value);

                                }}>
                                    <option value="">Select Option</option>
                                    <option value="invoice">Invoice</option>
                                    <option value="expense">Expense</option>
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
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
                    <Col xs={12} md={3}>
                        <Form.Group id="taskstatus" className="mb-4">
                            <Form.Label>Project Status</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={isActive} onChange={(e) => {
                                    setIsActive(e.target.value);
                                    handleprojectFetch();
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
                    <Col xs={12} md={3}>
                        <Form.Group id="pname" className="mb-4">
                            <Form.Label>Project name</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={pname} onChange={(e) => {
                                    setPname(e.target.value)
                                }}>
                                    <option value="">Select Option</option>
                                    {pnamearr.map((option, index) => (
                                        <option key={index} value={option._id}>{option.name}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group id="people" className="mb-4">
                            <Form.Label>People</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={person} onChange={(e) => setPerson(e.target.value)}>
                                    <option value="">Select Option</option>
                                    {contacts.map((option, index) => (
                                        <option key={index} value={option._id}>{option.name}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group id="people" className="mb-4">
                            <Form.Label>Recurring</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={rec} onChange={(e) => setrec(e.target.value)}>
                                    <option value="">Select Option</option>
                                    {recurring.map((option, index) => (
                                        <option key={index} value={option._id}>{option.name}-{pnamearr.find(p => p._id === option.project)?.name}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group id="people" className="mb-4">
                            <Form.Label>Status</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">Select Option</option>
                                    <option value="Not Paid">Not Paid</option>
                                    <option value="Paid">Paid</option>
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    {/* <Col xs={12} md={3}>
                        <Form.Group id="people" className="mb-4">
                            <Form.Label>Bank</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={bank} onChange={(e) => setBank(e.target.value)}>
                                    <option value="">Select Option</option>
                                    {banknames.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group id="people" className="mb-4">
                            <Form.Label>TDS</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={ftds} onChange={(e) => {
                                    settds(e.target.value)
                                }}>
                                    <option value="">Select Option</option>
                                    {tds.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group id="people" className="mb-4">
                            <Form.Label>GST</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select value={fgst} onChange={(e) => {
                                    setgst(e.target.value)
                                }}>
                                    <option value="">Select Option</option>
                                    {gst.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col> */}
                    {/* isDisabled */}
                    <Col xs={12} md={3}>
                        {check()[1] == 'john_doe' ? (
                            <Form.Group id="people" className="mb-4">
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
                    <Col xs={12} md={3} className="d-flex justify-content-center">
                        <Button style={{ height: "70px" }} variant="primary" type="submit" className="w-100 mt-3">
                            Submit
                        </Button>
                    </Col>
                    <Col xs={12} md={3} style={{alignItems:"center"}} className="d-flex justify-content-center">
                                <h1>Sum:{data.reduce((acc, curr) => acc + curr.amount, 0)}</h1>
                    </Col>
                </Row>
            </form>
            {/* Table */}

            <Card style={{ width: "max-content" }} border="light" className="shadow-sm">
                <Card.Header>
                    <Row style={{ width: "max-content" }} className="align-items-center">
                        <Col>
                            <h5>Service List</h5>
                        </Col>
                        <Col style={{ width: "100%" }} className="text-end">
                            <Button variant="secondary" size="sm">See all</Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Table responsive className="align-items-center table-flush">
                    {typebill == "invoice" ? (
                        <><thead className="thead-light">
                            <tr>
                                <th scope="col" className="unselectable" style={{ cursor: "pointer" }}>Created At</th>

                                <th scope="col">Status</th>
                                <th scope="col">Type</th>
                                <th scope="col">Recurring</th>

                                <th scope="col">Amount</th>
                                <th scope="col">Person</th>
                                <th scope="col">Company</th>
                                <th scope="col">Project</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Description</th>
                                <th scope="col">Link to Files</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                            <tbody>
                                {data && data.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid black" }}>{timeinIndia(row.date)}</td>
                                        <td style={{ border: "1px solid black" }}>{row.status}</td>
                                        <td style={{ border: "1px solid black" }}>{row.type}</td>
                                        <td style={{ border: "1px solid black" }}>{recurring.find((x) => x._id == row.recurring)?.name}</td>
                                        <td style={{ border: "1px solid black" }}>{row.amount}</td>
                                        <td style={{ border: "1px solid black" }}>{contacts.find((x) => x._id == row.person)?.name}</td>
                                        <td style={{ border: "1px solid black" }}>{row.company}</td>
                                        <td style={{ border: "1px solid black" }}>{pnamearr.find((x)=>row.project==x._id)?.name}</td>
                                        <td style={{ border: "1px solid black" }}>{row.subject}</td>
                                        <td style={{ border: "1px solid black" }}>{row.description}</td>
                                        <td style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                                            <div href="/invoice" style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%",
                                                textDecoration: "none",
                                                color: "inherit"
                                            }}>
                                                <span
                                                    onClick={() => {
                                                        handleEditModal(row)
                                                        setShowModal1(true)
                                                        setfileno(0)
                                                    }}
                                                    style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>Invoice</span>

                                                {row.files[0] && (<Button onClick={() => {
                                                    let pawan = (row.files[0]?.current).split(".")
                                                    downloadFile(row.files[0]?.current, 'Invoice' + '.' + pawan[pawan.length - 1])
                                                }} variant="primary" size="sm">
                                                    <FontAwesomeIcon icon={faFileDownload} />
                                                </Button>)}
                                            </div>


                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%",
                                                textDecoration: "none",
                                                color: "inherit"
                                            }}>
                                                <span
                                                    onClick={() => {
                                                        handleEditModal(row)
                                                        setShowModal1(true)
                                                        setfileno(1)
                                                    }}
                                                    style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>Payment Proof</span>
                                                {row.files[1] && <Button onClick={() => {
                                                    let pawan = (row.files[1]?.current).split(".")
                                                    downloadFile(row.files[1]?.current, 'Invoice' + '.' + pawan[pawan.length - 1])
                                                }} variant="primary" size="sm">
                                                    <FontAwesomeIcon icon={faFileDownload} />
                                                </Button>}
                                            </div>


                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%",
                                                textDecoration: "none",
                                                color: "inherit"
                                            }}>
                                                <span
                                                    onClick={() => {
                                                        handleEditModal(row)
                                                        setShowModal1(true)
                                                        setfileno(2)

                                                    }}
                                                    style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>Payment Slip</span>
                                                {row.files[2] && <Button onClick={() => {
                                                    let pawan = (row.files[2]?.current).split(".")
                                                    downloadFile(row.files[2]?.current, 'Invoice' + '.' + pawan[pawan.length - 1])
                                                }} variant="primary" size="sm">
                                                    <FontAwesomeIcon icon={faFileDownload} />
                                                </Button>}
                                            </div>

                                        </td>
                                        <td style={{ border: "1px solid black" }}>
                                            <Button variant="primary" size="sm"
                                                onClick={() => {
                                                    handleEditModal(row);
                                                    setShowModal(true);
                                                }}
                                            ><FontAwesomeIcon icon={faEdit} /></Button>
                                            <Button onClick={() => handleDelete(row._id)} variant="primary" size="sm"><FontAwesomeIcon icon={faTrash} /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    ) : (
                        <><thead className="thead-light">
                            <tr>
                                <th scope="col" className="unselectable" style={{ cursor: "pointer" }}>Created At</th>
                                <th scope="col">InvoiceId</th>
                                <th scope="col">Type</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Amount Paid</th>
                                <th scope="col">Person</th>
                                <th scope="col">Company</th>
                                <th scope="col">Project</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Description</th>
                                <th scope="col">Link to Files</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                            <tbody>
                                {data && data.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid black" }}>{row.date}</td>
                                        <td style={{ border: "1px solid black" }}></td>
                                        <td style={{ border: "1px solid black" }}>{row.type}</td>
                                        <td style={{ border: "1px solid black" }}>{row.amount}</td>
                                        <td style={{ border: "1px solid black" }}>{row.amount_paid}</td>
                                        <td style={{ border: "1px solid black" }}>{row.person}</td>
                                        <td style={{ border: "1px solid black" }}>{row.company}</td>
                                        <td style={{ border: "1px solid black" }}>{row.project}</td>
                                        <td style={{ border: "1px solid black" }}>{row.subject}</td>
                                        <td style={{ border: "1px solid black" }}>{row.description}</td>
                                        <td style={{ border: "1px solid black" }}>


                                        </td>
                                        <td style={{ border: "1px solid black" }}>
                                            <Button variant="primary" size="sm"
                                                onClick={() => {
                                                    handleEditModal(row)
                                                    setShowModal(true)
                                                }}
                                            ><FontAwesomeIcon icon={faEdit} /></Button>
                                            <Button variant="primary" size="sm"><FontAwesomeIcon icon={faTrash} /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                </Table>
            </Card>
            {/* Modal */}
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
                                setvieweditfiledate(e.target.value)
                            }} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editDescription">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="pname" className="mb-4">
                        <Form.Label>Contact</Form.Label>
                        <InputGroup>
                            <Form.Select required value={editPerson} onChange={(e) => setEditPerson(e.target.value)}>
                                <option value="">Select Option</option>
                                {/* Mapping through the arr array to generate options */}
                                {contacts.map((option, index) => (
                                    <option key={index} value={option._id}>{option.name}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group id="pname" className="mb-4">
                        <Form.Label>Type</Form.Label>
                        <InputGroup>
                            <Form.Select required value={editType} onChange={(e) => setEditType(e.target.value)}>
                                <option value="">Select Option</option>
                                {/* Mapping through the arr array to generate options */}
                                {toe.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Project</Form.Label>
                        <Form.Select value={editProject} onChange={(e) => setEditProject(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {pnamearr.map((option, index) => (
                                <option key={index} value={option._id}>{option.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Recurring</Form.Label>
                        <Form.Select value={editrec} onChange={(e) => setEditrec(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {recurring.filter(r => pname === "" || r.project === pname).map((option, index) => (
                                <option key={index} value={option._id}>{option.name}-{pnamearr.find(p => p._id === option.project)?.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Payment Status</Form.Label>
                        <Form.Select value={editstatus} onChange={(e) => setEditStatus(e.target.value)}>
                            <option value="Not Paid">Not Paid</option>
                            <option value="Paid">Paid</option>
                            {/* Mapping through the arr array to generate options */}

                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Subject</Form.Label>
                    </Form.Group>
                    <textarea rows="4" cols="50" type="text" value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
                    <Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Description</Form.Label>
                    </Form.Group>
                    <textarea rows="4" cols="50" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />

                    {typebill == "expense" ? (<Form.Group className="mb-3" controlId="editDescription">
                        <Form.Label>Bank</Form.Label>
                        <Form.Select value={editBank} onChange={(e) => setEditBank(e.target.value)}>
                            <option value="">Select Option</option>
                            {banknames.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>) : (null)}
                    {typebill == "expense" ? (
                        <Form.Group className="mb-3" controlId="editHeading">
                            <Form.Label>TDS</Form.Label>
                            <Form.Select value={edittds} onChange={(e) => setEdittds(e.target.value)}>
                                <option value="">Select Option</option>
                                {/* Mapping through the arr array to generate options */}
                                {tds.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    ) : null}
                    {typebill == "expense" ? (
                        <Form.Group className="mb-3" controlId="editHeading">
                            <Form.Label>GST</Form.Label>
                            <Form.Select value={editgst} onChange={(e) => setEditgst(e.target.value)}>
                                <option value="">Select Option</option>
                                {/* Mapping through the arr array to generate options */}
                                {gst.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    ) : null}
                    {typebill == "expense" ? (<Form.Group className="mb-3" controlId="editHeading">
                        <Form.Label>Invoice</Form.Label>
                        <Form.Select value={editInvoice} onChange={(e) => setEditInvoice(e.target.value)}>
                            <option value="">Select Option</option>
                            {/* Mapping through the arr array to generate options */}
                            {expenseInvoices.map((option, index) => (
                                <option key={index} value={option._id}>{option._id}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>) : (null)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false)
                        // setSelectedFiles([])
                    }}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={(e) => {
                        handleEditSubmit(e)
                        setShowModal(false)
                        // setSelectedFiles([])
                    }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* File Upload Modal */}
            <Modal show={showModal1} onHide={() => {
                setShowModal1(false)
            }}>
                <Modal.Header>
                    <Modal.Title>File Upload-Make Sure There is Contact alloted to Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editPerson ? (<Form.Group id="Project Image" className="mb-4">
                        <Form.Label>Upload</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                            </InputGroup.Text>
                            <Form.Control
                                type="file"
                                onChange={async (e) => {
                                    let folderName = contacts.find(contact => contact._id == editPerson).name
                                    await handleFileChange(e, folderName, setstop).then((temp) => {
                                        selectedFiles = temp
                                        setSelectedFiles(temp)
                                    })

                                }}
                                placeholder="Upload Image"
                            />
                        </InputGroup>
                    </Form.Group>) : (null)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal1(false)
                        // setSelectedFiles([])
                    }}>
                        Cancel
                    </Button>
                    {stop && (<Button variant="primary" onClick={(e) => {
                        handleEditSubmit(e)
                        setShowModal1(false)
                        // setSelectedFiles([])
                    }}>
                        Save Changes
                    </Button>)}
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default ViewDebits