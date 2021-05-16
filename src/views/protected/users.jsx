import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../dataLayer/auth'
import { Form, Button } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import Api from '../../dataLayer/api';
import './users.css';

const initialUser = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
}

export function Users() {
    const { user, updateUser, webSocket } = useContext(AuthContext);
    const { isLoading, refetch, data: users = [] } = useQuery('users', () => Api.get('/user'))
    const [profileForm, setProfileForm] = useState({});

    useMemo(() => {
        webSocket.addListener('newUser', () => {
            refetch()
        });
        webSocket.addListener('updatedUser', () => {
            refetch()
        });
        webSocket.addListener('removedUser', () => {
            refetch()
        });
    });

    const handleSave = async () => {
        if (profileForm.id === user.id) {
            updateUser(profileForm.id, profileForm)
        } else if (profileForm.isNew) {
            const user = await Api.post('/user', profileForm);
            setProfileForm(user);
        } else {
            Api.put(`/user/${profileForm.id}`, profileForm);
        }
    };

    const handleChange = (e) => {
        const { target: { value, name } } = e;
        setProfileForm({
            ...profileForm,
            [name]: value
        });
    };

    const handleAddNewUser = () => {
        setProfileForm({
            isNew: true,
            ...initialUser
        });
    };

    const handleDeleteUser = (id) => {
        Api.del(`/user/${id}`);
        setProfileForm({
            ...initialUser
        });
    };

    return (
        <div className='users-manager'>
            <div className='side-panel users'>
                <h2>Users</h2>
                <ul>
                    {users.map(user => (
                        <li className={profileForm.id === user.id ? 'selected' : ''} key={user.id} onClick={() => setProfileForm(user)}>
                            {user.firstName} {user.lastName} <span onClick={() => handleDeleteUser(user.id)} className='delete'>X</span>
                        </li>
                    ))}
                </ul>
                <Button onClick={handleAddNewUser}>+ Add User</Button>
            </div>
            <div className='panel user-panel'>
                {profileForm && (
                    <Form onSubmit={handleSave}>
                        <Form.Field>
                            <label>First Name</label>
                            <input name='firstName' placeholder='first name' value={profileForm.firstName} onChange={handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Last Name</label>
                            <input name='lastName' placeholder='last name' value={profileForm.lastName} onChange={handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Email</label>
                            <input name='email' type='email' placeholder='email' value={profileForm.email} onChange={handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Phone</label>
                            <input name='phone' placeholder='phone' value={profileForm.phone} onChange={handleChange} />
                        </Form.Field>
                        {profileForm.isNew && (
                            <Form.Field>
                                <label>Password</label>
                                <input name='password' type='password' placeholder='password' value={profileForm.password} onChange={handleChange} />
                            </Form.Field>
                        )}
                        <Button type='submit'>Save User</Button>
                    </Form>
                )}
            </div>
        </div>
    
    );
}
