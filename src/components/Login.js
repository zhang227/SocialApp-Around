import React from 'react';
import $ from 'jquery';
import { Form, Icon, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { API_ROOT } from '../constants';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //ajax call来handle login promise 2个function
                $.ajax({
                    url: `${API_ROOT}/login`,
                    method: 'POST',
                    data: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    })
                }).then((response) => {
                    this.props.handleLogin(response);
                }, (error) => {
                    message.error(error.responseText);
                }).catch((error) => {
                    message.error(error);
                });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}
export const Login = Form.create()(NormalLoginForm);
