import React, { useState } from 'react'
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import Multiselect from "../../components/Multiselect";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { baseurl, ProjectStatus, companies } from "../../api";

const addToBucket = ({ users,taskid }) => {
    const [selectedValues, setSelectedValues] = useState([]);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // const userId = check()[0]; // Assuming this returns the userId

        if (!taskid) {
            toast.error("Please select a task");
            return;
        }
        console.log(selectedValues)
        for(let i=0;i<selectedValues.length;i++){
            const userId = selectedValues[i].id; // Assuming selectedValues contains objects with an 'id' property

            // Generate the current date
            const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

            try {
            // Send taskId as an array since the backend expects "tasks" to be an array
            const response = await axios.post(`${baseurl}/bucket/buckets/${userId}`, {
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
    };
    return (
        <>
            <div style={{ width: "100%", border: "1px solid black", padding: "10px" }}>
                {users ? (<Multiselect
                    selectedValues={selectedValues}
                    setSelectedValues={setSelectedValues}
                    options={users} />) : (
                    <p>loading</p>
                )}

                <Button variant="secondary" onClick={() => setEditMode(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={(e)=>handleSubmit(e)}>
                    Save Changes
                </Button>
            </div>

        </>
    )
}

export default addToBucket