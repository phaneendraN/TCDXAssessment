import React from 'react';
import { Navbar,Button } from 'react-bootstrap';
import pic from './../images/pic.jpg';
import { useHistory } from 'react-router-dom';

export default function Header() {
    let history = useHistory();
    const redirectToLogin = () => {
        sessionStorage.clear();
        history.push('/login');
    }
    return (
        <>
            <Navbar bg="light">
                <Navbar.Brand href="#">
                    <img
                        src={pic}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
                <h5>{sessionStorage.getItem('userName') == undefined || sessionStorage.getItem('userName') == '' || sessionStorage.getItem('userName') == null ? 'Ali' : sessionStorage.getItem('userName')}</h5>
                <Button type="button" onClick={redirectToLogin} className="pull-right ml-auto">
                    Logout
                </Button>
            </Navbar>
        </>
    )
}
