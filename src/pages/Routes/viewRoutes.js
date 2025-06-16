import React, { useState, useEffect } from "react";
import { Routes } from "../../routes";
import axios from 'axios';
import { Col, Row, Form, Table, InputGroup, Button, Dropdown, ButtonGroup, Modal } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

import { baseurl } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsyncData } from "../../features/userslice";

export default () => {
    let [user, setuser] = useState(null);
    let [userd, setuserd] = useState(null);
    let [changes, setchanges] = useState(false)
    let { user1, loading, error } = useSelector((state) => state.users);

    const check = async () => {
        //console.log(user1);
        await axios.post(`${baseurl}/user/add-paths`, {
            newPaths: Routes
        });
    };

    const setuserdetails = (e) => {
        if(changes){
            toast.error("Save Changes First")
            return
        }
        user = e.target.value
        setuser(e.target.value);
        let temp = user1.find((data) => data._id == user);
        //console.log(temp);
        setuserd(temp);
    };

    const handleCheckboxChange = (index) => {
        // Update the isActive status of the selected path entry
        setchanges(true)
        setuserd((prevUserd) => ({
            ...prevUserd,
            paths: {
                ...prevUserd.paths,
                [index]: {
                    ...prevUserd.paths[index],
                    isActive: !prevUserd.paths[index].isActive
                }
            }
        }));

        // Update user1 to reflect the change
        // //console.log(index)
        // for(let i=0;i<user1.length;i++){
        //     if(user1[i]._id==user){
        //         user1[i].paths[index].isActive=!user1[i].paths[index].isActive
        //     }
        // }

        // //console.log((user1.find((users) => users._id === user)).paths)
    }

    const handleEditchange = () => {

    }
    const SaveChanges = async () => {
        if (!user) {
            return
        }
        try {
            await axios.put(`${baseurl}/user/${user}/paths`, { paths: userd.paths });
            setchanges(false)
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("Failed to save changes.");
        }
    }

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAsyncData());
    }, []);

    useEffect(() => { }, [loading]);

    return (
        <>
            <ToastContainer />
            <h1>View Routes</h1>
            <Form.Group id="ptype" className="mb-4">
                <Form.Label>Select User</Form.Label>
                {user1 ? (
                    <Form.Select
                        value={user}
                        onChange={(e) => {
                            
                            setuserdetails(e);
                        }}
                    >
                        <option value="">Select Option</option>
                        {user1.map((option, index) => (
                            <option key={index} value={option._id}>{option.username}</option>
                        ))}
                    </Form.Select>
                ) : (
                    <p>Loading...</p>
                )}
            </Form.Group>
            <Button onClick={()=>check()} variant="primary" type="submit" className="w-100 mt-3">
                Import New Routes
            </Button>
            <Button onClick={() => SaveChanges()} variant="primary" type="submit" className="w-100 mt-3">
                Save Changes
            </Button>

            <Table striped bordered hover>
                {userd && (
                    <>
                        <thead>
                            <tr>
                                <th>Path</th>
                                <th>isActive</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userd?.paths && Object.entries(userd.paths).map(([key, pathEntry], index) => (
                                <tr key={key}>
                                    <td>{pathEntry.path}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={pathEntry.isActive}
                                            onChange={() => handleCheckboxChange(key)}
                                        />
                                        {pathEntry.isActive ? 'Yes' : 'No'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                )}
            </Table>



        </>
    );
}
