import { useContext, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../../dataLayer/auth';
import { Form, Button } from 'semantic-ui-react';

export function Login() {
    const [redirect, setRedirect] = useState(false);
    const [loginForm, setLoginForm] = useState({});
    const [loginStatus, setLoginStatus] = useState('');
    const { isAuthed, login, logout } = useContext(AuthContext);
    const { state } = useLocation();

    if (redirect) {
        return <Redirect to={state?.from || "/"} />;
    }
    if (isAuthed) {
        return (
            <button onClick={() => logout(() => setRedirect(false))}>Log out</button>
        );
    }

    const handleChange = (e) => {
        const { target: { value, name } } = e;
        setLoginForm({
            ...loginForm,
            [name]: value
        });
    }

    const handleLogin = async () => {
        setLoginStatus('Attempting to log in.');
        const { authenticated } = await login(loginForm);
        if (!authenticated) {
            setLoginStatus('Email or password is incorrect');
        } else {
            setLoginStatus('');
            setRedirect(true);
        }
    }

    return (
        <Form style={{
            width: 400,
            margin: '32px auto'
        }} onSubmit={handleLogin}>
            <Form.Field>
                <label>Email Address</label>
                <input name='email' placeholder='email' onChange={handleChange} />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input name='password' type='password' placeholder='password' onChange={handleChange} />
            </Form.Field>
            {loginStatus && (<p>{loginStatus}</p>)}
            <Button type='submit'>Submit</Button>
        </Form>
    );
}