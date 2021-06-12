import React, { useState, useEffect } from 'react';
import Header from './Navbar';
import './Tasks.css';
import { Modal } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip
} from 'recharts';


const COLORS = ['#1890ff', '#808080'];

const RADIAN = Math.PI / 180;

let renderLabel = function (entry) {
    return entry.name;
}

export default function Tasks() {

    const [tasks, setTasks] = useState([]);
    const [tempTasks, setTempTasks] = useState([]);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [taskText, setTaskText] = useState('');
    const [taskId, setTaskId] = useState('');
    const [taskStatus, setTaskStatus] = useState(false);
    const [lastCreated, setLastCreated] = useState([]);
    const [search, setSearch] = useState('');
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
        { name: 'Group E', value: 278 },
        { name: 'Group F', value: 189 },
    ];

    const fetchTasks = async () => {
        let res = await fetch('http://18.188.192.149/dcxservice/tasks', {
            method: 'GET'
        });
        let tasks = await res.json();
        tasks.forEach(x => {
            x.state = x.status == 1 ? true : false;
        })
        let pData = [];
        pData.push({ name: 'Completed', value: tasks.filter(x => x.status == 1).length });
        pData.push({ name: 'Pending', value: tasks.filter(x => x.status == 0).length });
        console.log(pData);
        setPieData(pData);
        setTasks(tasks);
        setTempTasks(tasks);
    }

    const handleClose = () => setShowAddTaskModal(false);
    const handleEditClose = () => setShowEditTaskModal(false);
    const handleShow = () => setShowAddTaskModal(true);
    const handleEditShow = () => setShowEditTaskModal(true);

    const onAddNewTask = async () => {
        let obj = {
            text: newTask,
            status: 1
        }
        await fetch(`http://18.188.192.149/dcxservice/tasks`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(() => {
            toast.success('Task Added Successfully', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to add task', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        fetchTasks();
        handleClose();
    }

    const onUpdateTask = async () => {
        let obj = {
            "text": taskText,
            "status": taskStatus == true ? 1 : 0,
            "id": taskId
        }
        await fetch(`http://18.188.192.149/dcxservice/tasks/${obj.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(() => {
            toast.success('Task Updated Successfully', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to update task', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        fetchTasks();
        handleEditClose();
    }

    const onSearch = (value) => {
        if (value == '' || value == undefined || value == null) {
            setSearch('');
        } else {
            setSearch(value);
        }
        let data = value == '' || value == undefined || value == null ? tempTasks.slice() : tempTasks.filter(x => x.text.toLowerCase().includes(value.toLowerCase())).slice();
        setTasks(data);
    }

    const onEditTask = async (e, t) => {
        setTaskId(t.id);
        setTaskText(t.text);
        setTaskStatus(t.state);
        handleEditShow();
    }

    const onDeleteTask = async (e, t) => {
        await fetch(`http://18.188.192.149/dcxservice/tasks/${t.id}`, {
            method: 'DELETE'
        }).then(() => {
            toast.success('Task Deleted Successfully', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to delete task', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        fetchTasks();
    }

    const changeTaskStatus = async (e, t) => {
        let task = tempTasks.filter(x => x.id === t.id).map(x => ({
            "text": x.text,
            "status": x.status == 1 ? 0 : 1
        }));
        console.log(task);
        await fetch(`http://18.188.192.149/dcxservice/tasks/${t.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: task.length > 0 ? JSON.stringify(task[0]) : {}
        }).then(() => {
            toast.success('Task Status Updated Successfully', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to update task', {
                position: "top-right",
                position: "bottom-right", autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        fetchTasks();
    }


    return (
        <>
            <Header />
            <div className="row">
                <div className="col-xl-4 col-md-4 col-12">
                    <div style={{ height: '160px' }} className="card">
                        <div style={{ backgroundColor: 'lightgray' }} className="card-body text-center">
                            <p className="mt-0">Tasks Completed</p>
                            <h1 className="mb-0">{tempTasks.filter(x => x.status == 1).length}<small>/{tempTasks.length}</small></h1>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-4 col-12">
                    <div style={{ height: '160px' }} className="card">
                        <div style={{ backgroundColor: 'lightgray' }} className="card-body">
                            <h5 className="text-center">Created Tasks: </h5>
                            <div className="text-center">
                                <ul className="">
                                    {tempTasks.sort((a, b) => {
                                        return a.id - b.id;
                                    }).slice(0, 3).map(listitem => (
                                        listitem.status == 1 ? <li key={listitem.id}><s>{listitem.text}</s></li> :
                                            <li key={listitem.id} className="">
                                                {listitem.text}
                                            </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-4 col-12">
                    <div style={{ height: '160px' }} className="card">
                        <div style={{ backgroundColor: 'lightgray' }} className="card-body">
                            <ResponsiveContainer width="99%" height="80%" minHeight={120}>
                                <PieChart>
                                    <Pie
                                        dataKey="value"
                                        isAnimationActive={false}
                                        data={pieData}
                                        fill="#8884d8"
                                        label={renderLabel}
                                        labelLine={false}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                dataKey="name"
                                                key={index}
                                                fill={COLORS[index]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {(tasks.length === 0 && search == '') ? (
                    <div className="row">
                        <div className="col-md-4 offset-md-4 col-12">
                            <div style={{ borderRadius: '8px' }} className="card">
                                <div className="card-body">
                                    <div className="text-center">
                                        <h4>You Have No Task</h4>
                                        <button onClick={handleShow} className="btn btn-primary" type="button">+New task</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                    :
                    (
                        <div className="row mt-3">
                            <div className="col-md-12 col-12 col-xl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-8 col-xl-8 col-8">
                                                <h4>Tasks</h4>
                                            </div>
                                            <div className="col-md-2  col-xl-2 col-4 float-right">
                                                <button onClick={handleShow} style={{ display: 'inline-block' }} className="btn btn-primary mr-2" type="button">+New task</button>
                                            </div>
                                            <div className="col-md-2  col-xl-2 col-12 float-right  text-center">
                                                <input type="text" onChange={(e) => onSearch(e.target.value)} style={{ display: 'inline-block' }} className="form-control" onKeyUp={(e) => onSearch(e.target.value)} value={search} placeholder="search" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <tbody>
                                                            {
                                                                (tasks.length === 0) ? (
                                                                    <tr>
                                                                        <td colSpan="2">
                                                                            <label className="form-control text-center">
                                                                                No Data Found
                                                                        </label>
                                                                        </td>
                                                                    </tr>
                                                                ) :
                                                                    (
                                                                        tasks.map((task) =>
                                                                            <tr key={task.id}>
                                                                                <td>
                                                                                    <input type="checkbox" defaultChecked={task.status == 1 ? true : false} onChange={(e) => changeTaskStatus(e, task)} />{task.text}
                                                                                </td>
                                                                                <td>
                                                                                    <button className="btn btn-link mr-2" onClick={(e) => onEditTask(e, task)} title="Edit" type="button"><FaEdit /></button>
                                                                                    <button className="btn btn-link mr-2" onClick={(e) => onDeleteTask(e, task)} title="Remove" type="button"><FaTrash /></button>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </>

            <Modal show={showAddTaskModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>+ New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" placeholder="Task Name" className="form-control" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={onAddNewTask} type="button">Add Task</button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditTaskModal} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Task Id - {taskId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" placeholder="Task Name" className="form-control" value={taskText} onKeyUp={(e) => setTaskText(e.target.value)} onChange={(e) => setTaskText(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={onUpdateTask} type="button">Update Task</button>
                </Modal.Footer>
            </Modal>
            <ToastContainer closeButton={false} position="bottom-right" />
        </>
    )
}
