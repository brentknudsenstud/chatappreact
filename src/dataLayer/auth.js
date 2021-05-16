import React, { useState, createContext, useReducer, useContext, useEffect } from 'react';
import Api from './api';
import WS from './ws';
export const AuthContext = createContext({});

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const GlobalActionTypes = {
    addUnreadMessages: 'ADD_UNREAD_MESSAGES',
    removeUnreadMessage: 'REMOVE_UNREAD_MESSAGE'
}

const initialState = {
    unreadMessages: []
};

function globalReducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case GlobalActionTypes.addUnreadMessage:
            return {
                ...state,
                unreadMessages: [...state.unreadMessages, payload]
            };
        case GlobalActionTypes.removeUnreadMessage:
            const newState = {...state};
            const foundMessage = newState.unreadMessages.findIndex(({ id }) => id === payload)
            newState.unreadMessages.splice(foundMessage, 1);
            return newState;
        default:
            throw Error('Incorrect action type.')
    }
}

class Auth {
    static keyword = 'user';
    static isAuthed = () => {
        return Boolean(localStorage.getItem(Auth.keyword));
    }
    static getUser = () => {
        const userInfo = localStorage.getItem(Auth.keyword);
        if (!userInfo) {
            return {};
        }
        try {
            return JSON.parse(userInfo);
        } catch(e) {
            return {};
        }
    }
    static updateUser = async (id, userData) => {
        const user = await Api.put(`/user/${id}`, userData);

        localStorage.setItem(Auth.keyword, JSON.stringify(user));
    }
    static login = async (userInfo) => {
        try {
            const { authenticated, user } = await Api.post('/login', userInfo);
            if (authenticated) {
                localStorage.setItem(Auth.keyword, JSON.stringify(user));
            } else {
                localStorage.removeItem(Auth.keyword);
            }
            return {
                authenticated,
                user
            }
        } catch(e) {
            localStorage.removeItem(Auth.keyword);
            return {
                authenticated: false
            };
        }
    }
    static logout = (cb) => {
        localStorage.removeItem(Auth.keyword);
        cb && cb();
    }
}
const webSocket = new WS();

export function AuthProvider(props) {
    const [state, dispatch] = useReducer(globalReducer, initialState);
    const [isAuthed, setIsAuthed] = useState(Auth.isAuthed());
    const [user, setUser] = useState(Auth.getUser());

    useEffect(() => {
        webSocket.addListener('newDirectMessages', (directMessage) => {
            const isMine = !!directMessage?.users?.find((messageUser) => user.id === messageUser.id);
            if (Auth.isAuthed() && isMine) {
                dispatch({ type: GlobalActionTypes.addUnreadMessage, payload: directMessage})
            }
        });
    }, []);
    return (
        <AuthContext.Provider value={{
            state,
            dispatch,
            isAuthed,
            user,
            webSocket,
            updateUser: (id, user) => {
                setUser(user);
                Auth.updateUser(id, user);
            },
            logout: (cb) => {
                Auth.logout(cb);
                setIsAuthed(Auth.isAuthed());
            },
            login: async ({email, password}) => {
                const { user, authenticated } = await Auth.login({email, password});
                if (authenticated) {
                    setIsAuthed(Auth.isAuthed());
                    setUser(user);
                }
                return {
                    authenticated,
                    user
                };
            }
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}