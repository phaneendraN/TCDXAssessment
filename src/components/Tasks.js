import React, { useState, useEffect} from 'react';
import Header from './Navbar';
// import './Tasks.css';
import { Modal } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Tasks() {

    const [tasks, setTasks] = useState([]);
    const [tempTasks, setTempTasks] = useState([]);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [taskText, setTaskText] = useState('');
    const [taskId, setTaskId] = useState('');
    const [taskStatus, setTaskStatus] = useState(false);

    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        let res = await fetch('http://localhost:5001/tasks', {
            method: 'GET'
        });
        let tasks = await res.json();
        tasks.forEach(x => {
            x.state = x.status == 1 ? true : false;
        })
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
        await fetch(`http://localhost:5001/tasks`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(() => {
            toast.success('Task Added Successfully', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to add task', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
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
        await fetch(`http://localhost:5001/tasks/${obj.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(() => {
            toast.success('Task Updated Successfully', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to update task', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
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
        await fetch(`http://localhost:5001/tasks/${t.id}`, {
            method: 'DELETE'
        }).then(() => {
            toast.success('Task Deleted Successfully', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to delete task', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
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
        await fetch(`http://localhost:5001/tasks/${t.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: task.length > 0 ? JSON.stringify(task[0]) : {}
        }).then(() => {
            toast.success('Task Status Updated Successfully', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(() => {
            toast.warn('Unable to update task', {
                position: "top-right",
                position:"bottom-right",autoClose: 5000,
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
                                        <h4>Tasks
                                        <span className="float-right text-center mr-2">
                                                <button onClick={handleShow} className="btn btn-primary" type="button">+New task</button>
                                            </span>
                                            <span className="float-right text-center mr-2">
                                                <input type="text" onChange={(e) => onSearch(e.target.value)} className="form-control" onKeyUp={(e) => onSearch(e.target.value)} value={search} placeholder="search" />
                                            </span>
                                        </h4>
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
