import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './verifyEmailPhone.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
// notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Alert, Space } from 'antd';

const VerifyEmailPhone = () => {
  const navigate = useNavigate();

  // Notification functions
  const errorNotify = (errorMsg) => toast.error(errorMsg, { autoClose: 3000 });
  const successNotify = (successMsg) => toast.success(successMsg, { autoClose: 3000 });

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify`, {
        email: values.email,
        emailCode: values.emailCode,
        phoneCode: values.phoneCode,
      });

      if (response.status === 200) {
        successNotify(response.data.message);
        // Redirect to the login page
        setTimeout(() => {
          navigate('/');
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
    <div className="verify-container">
      <ToastContainer />
      <div className="verify-form-content">
        <h2>Verify Email and Phone</h2>
        <Space
          direction="vertical"
          style={{
            width: '80%',
          }}
        >
          <Alert
            className='info-container'
            message="Informational Notes"
            description="verification codes are sent to your email and phone."
            type="info"
            showIcon
          />

        </Space>
        <Form
          name="verify_email_phone"
          className="verify-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input className="large-input" placeholder="Email address" />
          </Form.Item>
          <Form.Item
            name="emailCode"
            rules={[{ required: true, message: 'Please input the Email Verification Code!' }]}
          >
            <Input className="large-input" placeholder="Email Verification Code" />
          </Form.Item>
          {/* <Form.Item
            name="phoneCode"
            rules={[{ required: true, message: 'Please input the Phone Verification Code!' }]}
          >
            <Input className="large-input" placeholder="Phone Verification Code" />
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="verify-form-button large-input">
              Verify
            </Button>
          </Form.Item>
          <div className="all-rights-reserved">
            © 2025 <span>mmu-evotinge</span> Inc. all rights reserved.
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VerifyEmailPhone;