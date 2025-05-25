import React from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './validateLogin.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
// notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//context
import { useAuth } from '../../AuthContext';

const ValidateLogin = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  // Notification functions
  const errorNotify = (errorMsg) => toast.error(errorMsg, { autoClose: 3000 });
  const successNotify = (successMsg) => toast.success(successMsg, { autoClose: 3000 });

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-login`, {
        email: values.email,
        loginId: values.loginId,
        loginPassword: values.loginPassword,
      });

      if (response.status === 200) {
        // Save user and token in localStorage
        login(response.data.user,response.data.token)
        successNotify(response.data.message);
        setTimeout(() => {
          navigate('/home');
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
    <div className="validate-login-container">
      <ToastContainer />
      <div className="validate-login-form-content">
        <h2>Validate Login</h2>
        <Space
          direction="vertical"
          style={{
            width: '80%',
          }}
        >
          <Alert
            className='info-container'
            message="Informational Notes"
            description="Login ID and password are sent to your email and phone."
            type="info"
            showIcon
          />
        </Space>
        <Form
          name="validate_login"
          className="validate-login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input className="large-input" placeholder="Email address" />
          </Form.Item>
          <Form.Item
            name="loginId"
            rules={[{ required: true, message: 'Please input your Login ID!' }]}
          >
            <Input className="large-input" placeholder="Login ID" />
          </Form.Item>
          <Form.Item
            name="loginPassword"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password className="large-input" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="validate-login-form-button large-input">
              Validate
            </Button>
          </Form.Item>
          <div className="try-again">
            Didn't receive credentials? <Link to="/">Try again</Link>
          </div>
          <div className="all-rights-reserved">
            © 2025 <span>mmu-evotinge</span> Inc. all rights reserved.
          </div>
        </Form>
      </div>
      <div className="validate-form-info">  
      </div>
    </div>
  );
};

export default ValidateLogin;
