import { useReducer, useMemo } from 'react';
import { useAuthContext, GlobalActionTypes } from '../../../../dataLayer/auth';
import Api from '../../../../dataLayer/api';
import { Button, Modal, Icon, Search, Label } from 'semantic-ui-react';
import { useQuery } from 'react-query';

const ActionTypes = {
    toggleModal: 'TOGGLE_MODAL',
    openModal: 'OPEN_MODAL',
    closeModal: 'CLOSE_MODAL',
    changeMode: 'CHANGE_MODE',
    updateDirectMessageToEdit: 'UPDATE_DIRECT_MESSAGE',
    addUserToDirectMessageToEdit: 'ADD_USER_TO_DIRECT_MESSAGE_TO_EDIT',
    updateSearchText: 'UPDATE_SEARCH_TEXT',
    updateSearchResults: 'UPDATE_SEARCH_RESULTS',
    clearSearch: 'CLEAR_SEARCH'
}

const store = {
    modalVisible: false,
    mode: 'create',
    directMessageToEdit: { users: [] },
    search: {
        results: [],
        text: ''
    }
};

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case ActionTypes.toggleModal:
            const newState = {...state};
            newState.modalVisible = !newState.modalVisible;
            return newState;
        case ActionTypes.openModal:
            return {
                ...state,
                modalVisible: true
            };
        case ActionTypes.closeModal:
            return {
                ...state,
                modalVisible: false
            };
        case ActionTypes.changeMode:
            return {
                ...state,
                mode: payload
            };
        case ActionTypes.updateDirectMessageToEdit:
            return {
                ...state,
                directMessageToEdit: payload
            };
        case ActionTypes.updateSearchText:
            return {
                ...state,
                search: {
                    ...state.search,
                    text: payload
                }
            };
        case ActionTypes.updateSearchResults:
            return {
                ...state,
                search: {
                    ...state.search,
                    results: payload
                }
            };
        case ActionTypes.clearSearch:
            return {
                ...state,
                search: {
                    text: '',
                    results: []
                }
            };
        case ActionTypes.addUserToDirectMessageToEdit:
            const { directMessageToEdit: { users = [] } = {} } = {...state};
            if (!users.find(({ id }) => id === payload.id)) {
                users.push(payload);
            }
            return {
                ...state,
                directMessageToEdit: {
                    ...state.directMessageToEdit,
                    users
                }
            }
        default:
            return {...state};
    }

}


export function DM ({ selectedDirectMessage, onChangeDirectMessage }) {
    const { webSocket, user, dispatch: globalDispatch } = useAuthContext();
    const fetchDirectMessages = () => Api.get(`/direct-messages?userId=${user.id}`);
    const fetchUsers = () => Api.get(`/user`);
    const { data: directMessages = [], refetch: refetchDirectMessages } = useQuery(['directMessages'], fetchDirectMessages);
    const { data: users = [] } = useQuery(['users'], fetchUsers);
    const [state, dispatch] = useReducer(reducer, store);
    const { modalVisible, mode, search, directMessageToEdit } = state;

    useMemo(() => {
        webSocket.addListener('newDirectMessages', () => {
            refetchDirectMessages();
        });
    }, []);

    const clearSearch = () => {
        dispatch({type: ActionTypes.clearSearch});
    };

    const handleToggleModal = () => {
        dispatch({type: ActionTypes.toggleModal});
        clearSearch();
    };

    const handleAddDirectMessage = () => {
        dispatch({type: ActionTypes.openModal});
        dispatch({type: ActionTypes.changeMode, payload: 'create'});
        dispatch({type: ActionTypes.updateDirectMessageToEdit, payload: { users: [user] }});
    };

    const handleSelectDirectMessage = (id) => {
        onChangeDirectMessage(id);
        globalDispatch({ type: GlobalActionTypes.removeUnreadMessage, payload: id })
    };

    const handleEditDirectMessage = (index) => {
        const directMessage = directMessages[index];
        dispatch({type: ActionTypes.openModal});
        dispatch({type: ActionTypes.changeMode, payload: 'update'});
        dispatch({type: ActionTypes.updateDirectMessageToEdit, payload: {...directMessage}});
    };

    const handleDeleteDirectMessage = async (id) => {
        await Api.del(`/direct-messages/${id}`);
        refetchDirectMessages();
    };

    const handleSearchChange = (e, data) => {
        const searchValue = data.value.toLowerCase();
        const resultSet = users?.filter((user) => {
            return JSON.stringify(Object.values(user)).toLowerCase().includes(searchValue);
        });
        dispatch({ type: ActionTypes.updateSearchText, payload: data.value })
        dispatch({ type: ActionTypes.updateSearchResults, payload: resultSet })
    };

    const handleSelectResult = (e, data) => {
        dispatch({ type: ActionTypes.addUserToDirectMessageToEdit, payload: data.result });
        clearSearch();
    }

    const handleSaveDirectMessage = async () => {
        if (mode === 'create') {
            await Api.post('/direct-messages', directMessageToEdit);
        } else {
            await Api.put(`/direct-messages/${directMessageToEdit.id}`, directMessageToEdit);
        }
        dispatch({type: ActionTypes.updateDirectMessageToEdit, payload: { users:[user] }});
        dispatch({type: ActionTypes.closeModal});
        refetchDirectMessages();
        clearSearch();
    }

    return (
        <>
            <div className='direct-message section'>
                <h3>
                    <span>Direct Messages</span>
                    <Icon link onClick={handleAddDirectMessage} name='add' />
                </h3>
                <ul>
                    {directMessages.map(({ users = [], id }, i) => (
                        <li className={id === selectedDirectMessage ? 'selected' : ''} onClick={() => handleSelectDirectMessage(id)} key={id}>
                            <span className='title'>{users.map(({ firstName, lastName, id }) => <span>{firstName} {lastName}</span>)}</span>
                            <span className='list-item-actions'>
                                <i onClick={() => handleEditDirectMessage(i)} className='icon-pencil' />
                                <i onClick={() => handleDeleteDirectMessage(id)} className='icon-cross' />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <Modal open={modalVisible}>
                <Modal.Header>
                    {mode === 'create' ? 'Create New Direct Message' : 'Update Direct Message'}
                </Modal.Header>
                <Modal.Content>
                    <Search
                        value={search?.text}
                        onSearchChange={handleSearchChange}
                        onResultSelect={handleSelectResult}
                        resultRenderer={(user) => <Label>{user.firstName} {user.lastName}</Label>}
                        results={search?.results}
                    />
                    <ul>
                        {directMessageToEdit?.users?.map((user) => <li key={user.id}>{user.firstName} {user.lastName}</li>)}
                    </ul>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleToggleModal}>Cancel</Button>
                    <Button onClick={handleSaveDirectMessage}>Save</Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}