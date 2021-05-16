import { Icon, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../dataLayer/auth';


export function MainHeader({ location }) {
    const { isAuthed, user, logout, state } = useAuthContext();

    return (
      <header>
        <Menu>
            <Menu.Item
                name='about'
                active={location.pathname.includes('/about')}
            >
                <Link to="/about">About</Link>
            </Menu.Item>
            {isAuthed ? (
            <>
                <Menu.Item
                    name='profile'
                    active={location.pathname.includes('/profile')}
                >
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item
                    name='users'
                    active={location.pathname.includes('/users')}
                >
                    <Link to="/users">Users</Link>
                </Menu.Item>
                <Menu.Item
                    name='chat'
                    active={location.pathname.includes('/chat')}
                >
                    <Link to="/chat">Chat</Link>
                </Menu.Item>

                <Menu.Item
                name='logout'
                onClick={() => logout()}
                >
                Log out
                </Menu.Item>
            </>
            ) : (
            <Menu.Item
                active={location.pathname.includes('/login')}
                name='login'
            >
                <Link to="/login">Log In</Link>
            </Menu.Item>
            )}
            <Menu.Item>
                <Icon name='user circle' />
            </Menu.Item>
        </Menu>
    </header>
    );
}