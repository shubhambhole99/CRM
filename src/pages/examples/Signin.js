import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import { GoogleButton } from 'react-google-button';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import BgImage from "../../assets/img/illustrations/signin.svg";
import { baseurl } from '../../api';
import { check } from '../../checkloggedin'

//absjdhasojh
export default () => {

  // for local
  // const [email, setEmail] = useState('john_doe');
  // const [password, setPassword] = useState('password123');
  // const [role, setRole] = useState('admin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  let history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestData = {
      username: email,
      password: password,
      role: role
    };

    try {
      const response = await axios.post(`${baseurl}/user/login`, requestData);
      const token = response.data.token;
      const username = response.data.username; // Assuming username is part of the response data

      // Display success message
      toast.success('Login Successfully');

      // Store token and username in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username); // Store username

      // Clear form fields
      setEmail('');
      setPassword('');

      // Redirect to dashboard
      history.push('/dashboard/overview');
    } catch (error) {
      // Display error message
      toast.error('Wrong Credentials');
    }
  };

  const handleSignup = () => {
    history.push('/sign-up');
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to our platform</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Username</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      {/* type="email" */}
                      <Form.Control  required placeholder="example@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      {/* <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                      </Form.Check> */}
                      {/* <Card.Link className="small text-end" onClick={handleSignup}>Create New User</Card.Link> */}
                    </div>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100" style={{ color: 'white' }}>
                    Sign In
                  </Button>
                  {/* <Button onClick={handleSignup} variant="secondary" type="button" className="w-100 mt-2" style={{ color: 'white' }}>
                    Sign Up
                  </Button>
                  <GoogleButton style={{ margin: "auto", marginTop: "20px", borderRadius: "10px", padding: "1%", paddingBottom: "13%" }} onClick={() => { window.location.href = 'http://localhost:3000/auth/google'; }} /> */}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <ToastContainer />
    </main>
  );
};
