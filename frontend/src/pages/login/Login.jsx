import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
//notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//icons
import {LoginOutlined} from '@ant-design/icons';

const Login = () => {
  //notification function
  const errorNotify = (errorMsg) => toast.error(errorMsg, { autoClose: 3000 });
  const successNotify = (successMsg) => toast.success(successMsg, { autoClose: 3000 });

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: values.email
      });

      if (response.status === 200) {
        successNotify(response.data.message);
        setTimeout(() => {
          navigate('/validateLogin');
        }, 3000); // 3 seconds delay
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        errorNotify('Error: ' + error.response.data.error);
      } else {
        // Request was made but no response received
        errorNotify('No response received from server.');
      }
    }
  };


  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-form-content">
        <div className="login-form-logo-conatiner">
          <img src={process.env.PUBLIC_URL + '/img/mmu-evotingeLogoLargeVersion.png'} alt="" />
        </div>
        <h2>Log in</h2>
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!', acctrive: true }]}
          >
            <Input className='large-input' placeholder="Email address" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button large-input">
              Continue
            </Button>
          </Form.Item>
        </Form>
        <div className="signup-link">
          Don't have an account? <Link to="/register">Signup</Link>
        </div>
        <div className="all-rights-reserved">
          © 2025 <span>mmu-evotinge</span> Inc. all rights reserved.
        </div>
      </div>
      <div className="login-form-info">
        <div className="login-form-info-content">
          <h2>Hello,<br />Welcome!</h2>
          <LoginOutlined className='login-form-info-content-icon'/>
          <h4>
          Empowering your voice in democracy with secure, informed, and engaging voting.<br /><br />
          Enter your email address in order to login into mmu-evotinge.<br /><br />
          If you don't have an account go to the signup page.<br />
          </h4>
        </div>
      </div>
    </div>

  );
};

export default Login;
