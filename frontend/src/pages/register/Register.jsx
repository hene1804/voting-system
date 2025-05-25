import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
// notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//icons
import {FormOutlined} from '@ant-design/icons';

const Register = () => {
  const navigate = useNavigate();

  // Notification functions
  const errorNotify = (errorMsg) => toast.error(errorMsg, { autoClose: 3000 });
  const successNotify = (successMsg) => toast.success(successMsg, { autoClose: 3000 });

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        // phoneNumber: values.phoneNumber,
      });

      if (response.status === 201) {
        successNotify(response.data.message);
        setTimeout(() => {
          navigate('/verifyEmailPhone');
        }, 3000); // 3 seconds delay
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 201 range
        errorNotify('Error: ' + error.response.data.error);
      } else {
        // Request was made but no response received
        errorNotify('No response received from server.');
      }
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="register-form-content">
        <h2>Register</h2>
        <Form
          name="register"
          className="register-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Please input your First Name!' }]}
          >
            <Input className="large-input" placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Please input your Last Name!' }]}
          >
            <Input className="large-input" placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input className="large-input" placeholder="Email address" />
          </Form.Item>
          {/* <Form.Item
            name="phoneNumber"
            initialValue="+212" 
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input className="large-input" placeholder="Phone Number" />
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button large-input">
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="login-link">
          You already have an account? <Link to="/">Log in</Link>
        </div>
        <div className="all-rights-reserved">
          © 2025 <span>mmu-evotinge</span> Inc. all rights reserved.
        </div>
      </div>
      <div className="register-form-info">
        <div className="register-form-info-content">
          <h2>Hello,<br />Welcome!</h2>
          <FormOutlined className='register-form-info-content-icon'/>
          <h4>
          Empowering your voice in democracy with secure, informed, and engaging voting.<br /><br />
          Enter your first name, last name, email and phone number in order to register into mmu-evotinge.<br /><br />
          If you already have an account go to the login page.<br />
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Register;
