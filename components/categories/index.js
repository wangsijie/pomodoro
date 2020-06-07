import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Popover, Badge, message } from 'antd';
import { ProjectOutlined, MinusCircleOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.less';
import { $post, $get, $patch, $delete } from '../../helper/remote';

const colors = [
    {
        label: 'pink',
        color: '#eb2f96',
        fontColor: '#fff',
    },
    {
        label: 'red',
        color: '#f5222d',
        fontColor: '#fff',
    },
    {
        label: 'yellow',
        color: '#fadb14',
        fontColor: '#000',
    },
    {
        label: 'orange',
        color: '#fa8c16',
        fontColor: '#fff',
    },
    {
        label: 'cyan',
        color: '#13c2c2',
        fontColor: '#fff',
    },
    {
        label: 'green',
        color: '#52c41a',
        fontColor: '#fff',
    },
    {
        label: 'blue',
        color: '#1890ff',
        fontColor: '#fff',
    },
    {
        label: 'purple',
        color: '#722ed1',
        fontColor: '#fff',
    },
    {
        label: 'geekblue',
        color: '#2f54eb',
        fontColor: '#fff',
    },
    {
        label: 'magenta',
        color: '#eb2f96',
        fontColor: '#fff',
    },
    {
        label: 'volcano',
        color: '#fa541c',
        fontColor: '#fff',
    },
    {
        label: 'gold',
        color: '#faad14',
        fontColor: '#fff',
    },
    {
        label: 'lime',
        color: '#a0d911',
        fontColor: '#000',
    },
];

const weekDays = [
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日',
];

export default function Categories({ categories, onChange }) {
    const [visible, setVisible] = useState(false);
    const [colorIndex, setColorIndex] = useState(0);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        if (visible) {
            setColorIndex(Math.floor(Math.random() * colors.length))
            setChanged(false);
        }
    }, [visible]);

    const color = colors[colorIndex];

    const handleClose = async () => {
        setVisible(false);
        if (changed) {
            setLoading(true);
            for (const item of categories) {
                // await $patch(`/categories/${item._id}`, { targets: item.targets });
                await $post(`/categories/${item.id}`, { targets: item.targets });
            }
            setLoading(false);
        }
    }

    const addCategory = async () => {
        if (!title) {
            message.error('请输入标题');
            return;
        }
        setLoading(true);
        await $post('/categories', {
            title,
            color: color.color,
            fontColor: color.fontColor,
        });
        const categories = await $get('/categories');
        onChange(categories)
        setLoading(false);
    }

    const addTarget = async (id, index) => {
        onChange(prev => prev.map(item => {
            if (item.id !== id) {
                return item;
            }
            return {
                ...item,
                targets: item.targets.map((v, i) => {
                    if (i === index) {
                        return v + 1;
                    }
                    return v;
                })
            }
        }));
        setChanged(true);
    }

    const minusTarget = async (id, index) => {
        onChange(prev => prev.map(item => {
            if (item.id !== id) {
                return item;
            }
            return {
                ...item,
                targets: item.targets.map((v, i) => {
                    if (i === index) {
                        return v - 1;
                    }
                    return v;
                })
            }
        }));
        setChanged(true);
    }

    const handleDelete = async (id) => {
        const category = categories.find(c => c.id === id);
        setLoading(true);
        await $delete(`/categories/${category.id}`);
        onChange(prev => prev.filter(c => c.id !== category.id));
        setLoading(false);
    }

    return <>
        <Button loading={loading} icon={<ProjectOutlined />} onClick={() => setVisible(true)}></Button>
        <Modal
            visible={visible}
            onCancel={handleClose}
            title="分类管理"
            footer={null}
        >
            <div className="ui-categories">
                <div className="target-titles">
                    {weekDays.map(day => <div key={day} className="title">{day}</div>)}
                </div>
                {categories.map(item => <div className="category-row" key={item.id}>
                    <div className="remove" onClick={() => handleDelete(item.id)}><DeleteOutlined /></div>
                    <div className="title">
                        <Badge count={item.title} style={{ backgroundColor: item.color, color: item.fontColor }} />
                    </div>
                    <div className="targets">
                        {item.targets.map((value, index) => <div className="target" key={index}>
                            <Popover trigger="hover" title="调整🍅目标" content={
                                <div className="ui-category-target-popover">
                                    <Button icon={<PlusCircleOutlined />} onClick={() => addTarget(item.id, index)}></Button>
                                    <Button disabled={value === 0} icon={<MinusCircleOutlined />} onClick={() => minusTarget(item.id, index)}></Button>
                                </div>
                            }>
                                {value}
                            </Popover>
                        </div>)}
                    </div>
                </div>)}
                <div className="add-new">
                    <Input placeholder="分类标题" style={{ width: 200 }} value={title} onChange={e => setTitle(e.target.value)} />
                    <Popover trigger="click" title="选择颜色" content={
                        <div className="ui-categories-color-select">
                            {colors.map((color, index) => <div
                                key={color.label}
                                className="color-item"
                                onClick={() => setColorIndex(index)}
                                style={{ background: color.color, color: color.fontColor }}
                            >
                                {color.label}
                            </div>)}
                        </div>
                    }>
                        <div className="color" style={{ background: color.color }}></div>
                    </Popover>
                    <Button type="primary" onClick={addCategory} loading={loading}>添加分类</Button>
                </div>
            </div>
        </Modal>
    </>
}
