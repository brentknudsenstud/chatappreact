import { Component, useContext, useState } from 'react';
import { AuthContext } from '../../dataLayer/auth'
import { Form, Button } from 'semantic-ui-react';

export function Profile() {
    const { user, updateUser } = useContext(AuthContext);
    const [profileForm, setProfileForm] = useState(user);

    const handleSave = () => {
        updateUser(user.id, profileForm)
    };

    const handleChange = (e) => {
        const { target: { value, name } } = e;
        setProfileForm({
            ...profileForm,
            [name]: value
        });
    }

    return (
        <div>
            <h1>Profile</h1>
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
                <Button type='submit'>Save User</Button>
            </Form>
        </div>
    );
}

export class ProfileClass extends Component {
    state = { profileForm: {} }
    static contextType = AuthContext;
    componentDidMount() {
        const { user } = this.context || {};

        this.setState({
            profileForm: { ...user }
        })
    }

    handleSave = () => {
        const { user, updateUser } = this.context
        updateUser(user.id, this.state.profileForm)
    }

    handleChange = (e) => {
        const { target: { value, name } } = e;
        this.setState({
            ...this.state,
            profileForm: {
                ...this.state.profileForm,
                [name]: value
            }
        });
    }

    render () {
        return (
            <div>
                <h1>Profile</h1>
                <Form onSubmit={this.handleSave}>
                    <Form.Field>
                        <label>First Name</label>
                        <input name='firstName' placeholder='first name' value={this.state.profileForm.firstName} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <input name='lastName' placeholder='last name' value={this.state.profileForm.lastName} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Email</label>
                        <input name='email' type='email' placeholder='email' value={this.state.profileForm.email} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Phone</label>
                        <input name='phone' type='phone' placeholder='phone' value={this.state.profileForm.phone} onChange={this.handleChange} />
                    </Form.Field>
                    <Button type='submit'>Save User</Button>
                </Form>
            </div>
        );
    }
}