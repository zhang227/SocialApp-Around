import React from 'react';
import $ from 'jquery';
import { Modal, Button, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm';
import { API_ROOT, TOKEN_KEY, AUTH_PREFIX, POS_KEY } from '../constants';
import { PropTypes } from 'prop-types';

export class CreatePostButton extends React.Component {
    static propTypes = {
        loadNearbyPosts: PropTypes.func.isRequired,
    }
    state = {
        visible: false,
        confirmLoading: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        const form = this.form.getWrapperForm();
        form.validateFields((err, values) => { //high order component检查是否valid
            if (err) { return; }
            console.log('Received values of form: ', values);

            const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
            const formData = new FormData();
            formData.set('lat', lat + Math.random() * 0.1 - 0.05); //为了让post在地图上不重叠
            formData.set('lon', lon + Math.random() * 0.1 - 0.05);
            formData.set('message', form.getFieldValue('message'));
            formData.set('image', form.getFieldValue('image')[0]);

            this.setState({ confirmLoading: true });  //控制lauch的时候转圈效果
            $.ajax({
                method: 'POST',
                url: `${API_ROOT}/post`,
                headers: {
                    Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`, //从local storage提取经纬度
                },
                processData: false,
                contentType: false,
                dataType: 'text',
                data: formData,
            }).then(() => {
                message.success('created a post successfully.');
                form.resetFields();
            },(error) => {
                message.error(error.responseText);
                form.resetFields();
            }).then(() => {
                this.props.loadNearbyPosts().then(() => {
                    //从home传入， succsucc之后重新load post
                    //传来一个ajax call结束之后可以继续then
                    //可以再上传之后自动刷新了
                    this.setState({ visible: false, confirmLoading: false });
                });
            }).catch((e) => {
                message.error('create post failed.');
                console.error(e);
            });
        });
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Post</Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    okText="Create"
                    cancelText="Cancel"
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <WrappedCreatePostForm wrappedComponentRef={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}
