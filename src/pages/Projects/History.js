import React, { useState, useEffect } from "react";
import axios from "axios";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { check, checkloginvailidity, geturl, timeinIndia } from '../../checkloggedin.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { fetchProjects, importquestions, addfiles, deletefiles, OrderUpdate, createStory, getStories, deleteStory, OrderUpdateStory } from "../../features/projectslice";
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus } from "../../api";

const History = ({ project }) => {
    let [isD, setIsD] = useState(false)
    let [stories, setstories] = useState([])
    const Today = new Date().toISOString().split("T")[0];
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [editFileStoryText, setEditFileStoryText] = useState('');
    const [createsdate, setCreatesDate] = useState(Today)
    const [editmode, setEditMode] = useState(false)
    const [editStoryId, setEditStoryId] = useState(0)
    const [editFileStoryDate, setEditFileStoryDate] = useState('');
    const [editFileStoryOrder, setEditFileStoryOrder] = useState('')
    const [temp, settemp] = useState(2)
    const [vieweditfiledate, setvieweditfiledate] = useState(null)

    const [isDisabled, setIsDisabled] = useState(false)
    const [formData, setFormData] = useState([{
        date: Today,
        orderNumber: '0',
        description: ''
    }]);
    const dispatch = useDispatch();
    let [data, setData] = useState([]);


    useEffect(() => {

        let temp = (project.stories).filter((story) => story.isDisabled === false)
        console.log(project.stories)
        setData(project.stories)
        setstories(temp)
    }, [])

    const handleShowModalStory = () => setShowModal3(true);
    const handleCloseModalStory = () => setShowModal3(false);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // dispatch(fetchProjects({
        //     isDisabled: isDisabled == 'true' ? true : false,
        //     id: project._id
        // })).then((resp) => {
        //     setstories(resp[0].stories)
        //     //////console.log(resp)
        // }).catch(error => {

        // })
    };
    const storyadd = (bool) => {
        //////console.log('Boolean parameter:', bool);

        // Check if stories are available in `thisproject`
        if (!project || !project.stories) {
            console.error('No stories found in thisproject.');
            return;
        }

        let Stories = data;
        //////console.log('Original Stories:', Stories);

        if (bool === "") {
            // Set the stories to the original list if bool is empty
            setstories(Stories);
        } else {
            // Filter stories based on the `bool` parameter
            let temp = [];

            for (let i = 0; i < Stories.length; i++) {
                if ((Stories[i].isDisabled).toString() === bool.toString()) {
                    temp.push(Stories[i]);
                }
            }

            //////console.log('Filtered Stories:', temp);
            // Update the state or do something with the filtered stories
            setstories(temp);
        }
    };
    const handleEditModalStory = (item) => {
        setEditMode(true); // Set edit mode to true for editing functionality

        // Set state variables to populate the modal with current file details
        setEditStoryId(item._id); // ID of the file being edited
        setEditFileStoryText(item.storyText);
        setEditFileStoryOrder(item.order); // File order
        setEditFileStoryDate(item.date); // File date
        setvieweditfiledate(new Date(item.date).toISOString().split("T")[0])

        // Show the modal
        setShowModal4(true);
    };
    const handleSubmitStory = async (e, typeofstory) => {
        e.preventDefault();
    
        const storyData = {
          storyText: formData.description,
          date: createsdate,
          order: parseInt(formData.orderNumber, 10),
          type: typeofstory
        };
    
        try {
          // Use the id from useParams directly for creating a story
          await dispatch(createStory(project._id, storyData));
          setFormData({
            date: '',
            orderNumber: '',
            description: '',
          });
          handleCloseModalStory()
          dispatch(fetchProjects({
            isDisabled: isDisabled == 'true' ? true : false,
            id: project._id
          })).then((resp) => {
            data = resp[0].stories
            setData(data)
            if (isD === 'true') {
                storyadd('true')
            } else {
                storyadd('false')
            }
          }).catch(error => {
    
          })
        } catch (error) {
          console.error('Error creating story:', error);
        }
      };
    const handleSaveStory = async () => {
        try {
            // Ensure storyId is correctly used and passed
            const response = await axios.put(
                `${baseurl}/project/updatestories/${project._id}/${editStoryId}`, // Use editStoryId here
                {
                    storyText: editFileStoryText,
                    order: editFileStoryOrder,
                    date: editFileStoryDate
                }
            );
            // Show success toast
            toast.success('Story updated successfully!');
            dispatch(fetchProjects({
                isDisabled: isDisabled == 'true' ? true : false,
                id: project._id
            })).then((resp) => {
                // //////console.log(resp[0].stories)
                let newStories = resp[0].stories
                data = newStories
                setData(newStories)
                if (isD === 'true') {
                    storyadd('true')
                } else {
                    storyadd('false')
                }
            }).catch(error => {
                console.log(error)
            })

        } catch (error) {
            // Show error toast
            toast.error('Error updating story. Please try again.');
            console.error('Error updating story:', error);
        }
        setShowModal4(false);
        // window.location.reload();
    };
    const handleDeleteStory = (pid, sid) => {
        dispatch(deleteStory(pid, sid));
        let temp = data.map(story =>
            story._id === sid ? { ...story, isDisabled: !story.isDisabled } : story
        );
        data = temp
        setData(temp)
        console.log(isD)
        if (isD === 'true') {
            storyadd('true')
        } else {
            storyadd('false')
        }


    };
    return (

        <section>
            <Container>
                <Col xs={12} md={4}>
                    {check() && check()[1] === 'john_doe' ? (
                        <Form.Group id="storystatus" className="mb-4">
                            <Form.Label>isDisabled</Form.Label>
                            <InputGroup>
                                <InputGroup.Text></InputGroup.Text>
                                <Form.Select
                                    value={isD} // Ensure isDisabled is either "true" or "false"
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        setIsD(String(selectedValue));  // Convert to string and update state
                                        storyadd(String(selectedValue)); // Pass the string value to storyadd
                                    }}
                                >
                                    <option value="">Select Option</option>
                                    <option value="true">True</option>  {/* Handle as strings */}
                                    <option value="false">False</option> {/* Handle as strings */}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    ) : (
                        check() ? <p>{check()[1]}</p> : null
                    )}
                </Col>
                <Row>
                    <Col xs={12}>
                        <Card>
                            <Card.Header>Story Management</Card.Header>
                            <Card.Body>
                                {check()?.[0] && (<Button variant="primary" onClick={handleShowModalStory}>
                                    Story Telling
                                </Button>)}

                                {/* Table for displaying stories */}
                                <Table striped bordered hover className="mt-3">
                                    <thead>
                                        <tr>
                                            <th className="unselectable" style={{ cursor: "pointer" }} onClick={() => settemp(temp === 1 ? 2 : 1)} >Date</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stories.length > 0 ? (
                                            stories.sort((a, b) => {
                                                if (temp === 1) {
                                                    return new Date(a.date) - new Date(b.date); // Ascending order
                                                } else if (temp === 2) {
                                                    return new Date(b.date) - new Date(a.date); // Descending order
                                                }
                                                return 0;
                                            }).map((story, index) => (
                                                <tr key={story._id} style={{ backgroundColor: story.disabled ? '#f8d7da' : 'inherit' }}>
                                                    <td>{timeinIndia(story.date)}</td>
                                                    <td style={{ whiteSpace: 'pre-wrap' }}>{story.storyText}</td>
                                                    {check()?.[0] && (<td>
                                                        <Button
                                                            variant="info"
                                                            size="sm"
                                                            onClick={() => handleEditModalStory(story)}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>

                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteStory(project._id, story._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </td>)}

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No stories available
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {/* Client story Form Modal */}
            <Modal show={showModal3} onHide={handleCloseModalStory}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Story</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleSubmitStory(e, "client")}>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={createsdate}
                                onChange={(e) => {
                                    setCreatesDate(e.target.value)
                                    // console.log("hi")
                                }}
                                required
                            />
                        </Form.Group>
                        {/* <Form.Group controlId="formOrderNumber">
            <Form.Label>Order Number</Form.Label>
            <Form.Control
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              required
            />
          </Form.Group> */}
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                cols={10}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModalStory}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
            {/* Edit Client Story Form Modal */}
            <Modal show={showModal4} onHide={() => setShowModal4(false)} style={{ backgroundColor: "transparent" }}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit File Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editFileDate">
                            <Form.Label>Story Date(mm/dd/yyyy)</Form.Label>
                            <Form.Control
                                type="date"
                                value={vieweditfiledate}
                                onChange={(e) => {
                                    setEditFileStoryDate(e.target.value)
                                    setvieweditfiledate(new Date(e.target.value).toISOString().split("T")[0])
                                }}
                            />
                       
                        </Form.Group>
                        <Form.Group controlId="editFileName">
                            <Form.Label>Story Tex</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                cols={5}
                                value={editFileStoryText}
                                onChange={(e) => setEditFileStoryText(e.target.value)}
                            />
                        </Form.Group>
                        {/* <Form.Group controlId="editFileOrder">
            <Form.Label>Order</Form.Label>
            <Form.Control
              type="number"
              value={editFileStoryOrder}
              onChange={(e) => setEditFileStoryOrder(e.target.value)}
            />
          </Form.Group> */}

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal4(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveStory}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </section>
    )
}

export default History