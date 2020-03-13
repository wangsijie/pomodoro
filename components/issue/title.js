import React from 'react';
import { Badge } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './style.less';

const defaultCategory = { title: 'other', color: '#fff', fontColor: '#000' };

export default function IssueTitle({ issue, number, onDeleted, categories }) {
    const category = categories.find(c => c.key === issue.category) || defaultCategory;
    const handleDelete = async (e) => {
        e.stopPropagation();
        await axios.delete(`${process.env.API_ROOT}/api/issues/${issue._id}`);
        onDeleted();
    }
    return <div className="ui-issue-title">
        <div className="title">#{number} {issue.title}</div>
        <div className="remove" onClick={handleDelete}><DeleteOutlined /></div>
        <div className="category"><Badge count={category.title} style={{ backgroundColor: category.color, color: category.fontColor }} /></div>
    </div>
}
