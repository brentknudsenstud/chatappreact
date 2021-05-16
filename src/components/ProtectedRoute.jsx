import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../dataLayer/auth';

export default function ProtectedRoute({ children, ...rest }) {
    const { isAuthed } = useContext(AuthContext);
    return (
        <Route {...rest} render={({ location }) => {
            if (isAuthed) {
                return children;
            }
            return (
                <Redirect to={{
                    pathname: "/login",
                    state: { from: location }
                }} />
            );
        }} />
    )

}