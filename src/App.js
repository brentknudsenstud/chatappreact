import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { About, Login } from './views/public';
import { Profile, Chat, Users } from './views/protected';
import ProtectedRoute from './components/ProtectedRoute';
import { MainHeader } from './components/MainHeader';
import './App.css';
import { Message } from 'semantic-ui-react';
import { useAuthContext } from './dataLayer/auth';

function App() {
  const location = useLocation();
  const { state } = useAuthContext();
  const { unreadMessages = [] } = state;

  console.log('unreadMessages', unreadMessages)

  return (
    <>
      <MainHeader
        location={location}
      />
      <div className='chat-app-content'>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <ProtectedRoute path="/profile">
            <Profile />
          </ProtectedRoute>
          <ProtectedRoute path="/users">
            <Users />
          </ProtectedRoute>
          <ProtectedRoute path="/chat/:type?/:id?">
            <Chat />
          </ProtectedRoute>
          <Route path="*">
            404
          </Route>
        </Switch>
      </div>
      <footer>
        <span className='copyright'>&copy; 2021</span>
        {unreadMessages?.length && (
          <Message className='global-alert'>
            <Message.Header>You Have {unreadMessages.length} Unread Messages</Message.Header>
            <Message.Content>
              {unreadMessages.map((message) => (
                <Link key={message.id} to={`/chat/direct-messages/${message.id}`}>
                  {message.users.map(({ firstName, lastName, id }) => <span key={id}>{firstName} {lastName}</span>)}
                </Link>
              ))}
            </Message.Content>
          </Message>
        )}
      </footer>
    </>
  );
}

export default App;
