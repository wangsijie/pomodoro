import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Editor from './editor';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};

export default function AddIssue({ onAdded, categories }) {
    const [visible, setVisible] = useState(false);
    const [time, setTime] = useState(0);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        await axios.post(process.env.API_ROOT + '/api/issues', values);
        setLoading(false);
        setVisible(false);
        onAdded && onAdded();
    };

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        if (visible) {
            setTime(0);
            setLoading(false);
            const timer = setInterval(() => setTime(prev => prev + 1), 1000);
            return () => clearInterval(timer);
        }
    }, [visible])

    const notification = useRef(null);
    const formatedTime = useMemo(() => {
        let m = Math.floor(time / 60);
        if (m < 10) {
            m = '0' + String(m);
        } else {
            m = String(m);
        }
        let s = time % 60;
        if (s < 10) {
            s = '0' + String(s);
        } else {
            s = String(s);
        }
        return `${m}:${s}`;
    }, [time]);
    useEffect(() => {
        if (time > 25 * 60) {
            notification.current = new Notification(
                '🍅Pomodoro Due',
                { body: formatedTime },
            );
        }
    }, [time])

    return <>
        <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setVisible(true)} />
        <Modal
            visible={visible}
            onCancel={() => setVisible(false)}
            title={`添加🍅${formatedTime}`}
            footer={null}
            width={800}
            style={{ top: '24px' }}
        >
            <Form
                {...layout}
                name="add-issue"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="类别"
                    name="category"
                    rules={[{ required: true }]}
                >
                    <Select>
                        {categories.map(item => <Select.Option key={item.key} value={item.key}>
                            {item.title}
                        </Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="笔记"
                    name="content"
                >
                    <Editor />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
}
