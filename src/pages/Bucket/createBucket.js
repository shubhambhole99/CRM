import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { baseurl } from "../../api";
import { check } from "../../checkloggedin"

export default ({fromdashboard}) => {
    const [data, setData] = useState([]);
    const [taskId, setTaskId] = useState(''); // For storing the selected task ID
    const [pname, setPname] = useState('');



    // Fetch tasks based on the project or other filters (optional)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.put(`${baseurl}/task/filter`, {
                    projectid: pname || undefined,
                });
                setData(response.data); // Set the task data from the response
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast.error("Failed to load tasks");
            }
        };

        fetchData();
    }, []);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = check()[0]; // Assuming this returns the userId

        if (!taskId) {
            toast.error("Please select a task");
            return;
        }

        // Generate the current date
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        try {
            // Send taskId as an array since the backend expects "tasks" to be an array
            const response = await axios.post(`${baseurl}/bucket/bucket/${userId}`, {
                date: currentDate,
                tasks: [taskId],  // Send taskId as an array
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
    };



    return (
        <>
            <ToastContainer />
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
                <div className="d-block mb-4 mb-xl-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                        <Breadcrumb.Item>Bucket</Breadcrumb.Item>
                        <Breadcrumb.Item active>Create Bucket</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
                <Container>
                    <form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} md={10}>
                                <Form.Group id="taskstatus" className="mb-4">
                                    <Form.Label>Task</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text></InputGroup.Text>
                                        <Form.Select
                                            value={taskId}
                                            onChange={(e) => setTaskId(e.target.value)} // Update the task ID
                                        >
                                            <option value="">Select Task</option>
                                            {/* Mapping through the data array to generate options */}
                                            {data.map((task, index) => (
                                                <option key={index} value={task._id}>
                                                    {task.projectName} -/- {task.taskSubject}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </Container>
            </section>
        </>
    );
};
