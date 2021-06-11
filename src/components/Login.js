import React, { useState, useEffect } from 'react';
import './login_module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

export default function Login() {
    let history = useHistory();
    useEffect(() => {
        sessionStorage.clear();
    }, [])

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const onLoginClick = () => {
        if (password == '1234') {
            toast.success('Logged in successfully', {
                position:"bottom-right",autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            sessionStorage.setItem('userName', id);
            history.push('/dashboard');
        } else {
            toast.error('Please login again', {
                position:"bottom-right",autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            history.push('/login');
        }
    }

    return (
        <>
            <div className="wrapper">
                <div className="card mt-md-5 card-block cardWidth">
                    <div className="card-header">
                        <h5>Login</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 form-group">
                                <input type="text" className="form-control" onKeyUp={(e) => setId(e.target.value)} onChange={(e) => setId(e.target.value)} value={id} placeholder="id" />
                            </div>
                            <div className="col-12  form-group">
                                <input type="password" className="form-control" value={password} onKeyUp={(e) => setPassword(e.target.value)} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                            </div>
                            <div className="col-12  form-group">
                                <button onClick={onLoginClick} className="btn btn-primary full-width" type="submit">Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer closeButton={false} position="bottom-right" />
        </>
    )
}