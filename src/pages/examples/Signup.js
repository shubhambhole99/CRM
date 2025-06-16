
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import axios from "axios";
import {baseurl} from "../../api";
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
import { useHistory } from 'react-router-dom';






export default () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let history = useHistory();

  const handleSubmit=async () => {

    try {
      
      // const ids = selectedusers.map(user => user.id);
      const body = {
        username: username,
        email: email,
        password: password,
      };
      ////////////////////console.log(body)
      
      const responseFormData = await axios.post(`${baseurl}/user/create`,body);
      ////////////////////console.log(responseFormData);
      toast.success('User registered');
      setEmail('')
      setUsername('')
      setPassword('')
      // history.push("/sign-in");
    } catch (error) {
      ////////////////////console.log(error);
      toast.error('User Already Exists');
      
    }
  };

  const handleSignin = ()=>{
    // history.push('/sign-in');
  }
  
  return (
    <main>
      <ToastContainer/>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Create an account</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control   required value={email} type="email" placeholder="example@company.com" onChange={(e) => setEmail(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Username</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control  required value={username} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Your Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control value={password} required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <FormCheck type="checkbox" className="d-flex mb-4">
                    <FormCheck.Input required id="terms" className="me-2" />
                    <FormCheck.Label htmlFor="terms">
                      I agree to the <Card.Link>terms and conditions</Card.Link>
                    </FormCheck.Label>
                  </FormCheck>

                  <Button oncvariant="primary" type="submit" className="w-100">
                    Sign up
                  </Button>
                </Form>

                {/* <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">or</span>
                </div>
                <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                    <FontAwesomeIcon icon={faTwitter} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                    <FontAwesomeIcon icon={faGithub} />
                  </Button>
                </div> */}
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal" onClick={handleSignin}>
                    Already have an account?
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
