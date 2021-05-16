import { useContext, useMemo, useReducer, useCallback } from 'react';
import { AuthContext } from '../../../../dataLayer/auth';
import Api from '../../../../dataLayer/api';
import { useQuery } from 'react-query';
import { Button, Search, Modal, Label, Icon } from 'semantic-ui-react';
import './style.css';

const initialState = {
    modalVisible: false,
    directMessageToEdit: { users: [] },
    directMessageMode: 'create'
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'setModalVisible':
            return {
                ...state,
                modalVisible: action.payload
            };
        case 'setDirectMessageToEdit':
            return {
                ...state,
                directMessageToEdit: action.payload
            };
        case 'setDirectMessageMode':
            return {
                ...state,
                directMessageMode: action.payload
            };
        case 'startSearch':
            return {
                ...state,
                search: {
                    ...state.search,
                    userSearch: action.payload,
                    loadingSearchResults: true
                }
            };
        case 'filterUsers':
            return {
                ...state,
                search: {
                    ...state.search,
                    userSearchResults: action.payload
                }
            };
        case 'addUser':
            const users = [...state?.directMessageToEdit?.users || []];
            if (users.find(({id}) => id === action.payload.id)) {
                return {...state};
            }
            users.push(action.payload);
            return {
                ...state,
                directMessageToEdit: {
                    users
                }
            };
        default: 
            return {...state}
    }
}

const resultRenderer = ({ firstName, lastName, email }) => <Label content={`${firstName} ${lastName}`} />

export function DirectMessages({ onChangeDirectMessage, selectedDirectMessage }) {
    const { webSocket, user } = useContext(AuthContext);
    const fetchDirectMessages = () => Api.get(`/direct-messages?userId=${user.id}`);
    const fetchUsers = () => Api.get(`/user`);
    const { data: directMessages = [], refetch: refetchDirectMessages } = useQuery(['directMessages'], fetchDirectMessages);
    const { data: users = [] } = useQuery(['users'], fetchUsers);
    const [{modalVisible, directMessageToEdit, directMessageMode, search = {}}, dispatch] = useReducer(reducer, initialState);
    const { userSearch, userSearchResults } = search;

    const handleOpenModal = () => {
        dispatch({
            type: 'setModalVisible',
            payload: true
        });
    };

    const handleCloseModal = () => {
        dispatch({
            type: 'setModalVisible',
            payload: false
        });
        dispatch({
            type: 'setDirectMessageToEdit',
            payload: { users: [] }
        });
        clearSearch();
    };

    const handleAddDirectMessage = () => {
        dispatch({
            type: 'setDirectMessageMode',
            payload: 'create'
        });
        dispatch({
            type: 'setDirectMessageToEdit',
            payload: { users: [user] }
        });
        dispatch({
            type: 'setModalVisible',
            payload: true
        });
    };

    const handleSearchChange = useCallback((e, data) => {
        const filteredResults = users.filter((user) => {
            const values = JSON.stringify(Object.values(user)).toLowerCase();
            return values.includes(data.value.toLowerCase());
        });
        dispatch({ type: 'startSearch', payload: data.value });
        dispatch({ type: 'filterUsers', payload: filteredResults });

    });

    const clearSearch = () => {
        dispatch({ type: 'startSearch', payload: '' });
        dispatch({ type: 'filterUsers', payload: [] });
    };

    useMemo(() => {
        webSocket.addListener('newDirectMessages', () => {
            refetchDirectMessages();
        })
    }, []);

    const handleSaveDirectMessage = async () => {
        if (directMessageMode === 'create') {
            await Api.post('/direct-messages', directMessageToEdit);
        } else {
            await Api.put(`/direct-messages/${directMessageToEdit.id}`, directMessageToEdit);
        }
        refetchDirectMessages();
        handleCloseModal();
    };

    const handleEditDirectMessage = (index) => {
        dispatch({
            type: 'setDirectMessageMode',
            payload: 'edit'
        });
        const directMessageToEdit = directMessages[index];

        dispatch({
            type: 'setDirectMessageToEdit',
            payload: {...directMessageToEdit}
        });

        handleOpenModal();
    }

    const handleDeleteDirectMessage = async (id) => {
        await Api.del(`/direct-messages/${id}`);
        refetchDirectMessages();
    };

    const handleSelectDirectMessage = (id) => {
        onChangeDirectMessage(id);
    };

    const handleSelectUser = (e, data) => {
        console.log(data)
        dispatch({ type: 'addUser', payload: data.result });
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
            <Modal
                onClose={handleCloseModal}
                onOpen={handleOpenModal}
                open={modalVisible}
            >
                <Modal.Header>
                    {directMessageMode === 'create' ? 'Create New Direct Message' : 'Edit Direct Message'}
                </Modal.Header>
                <Modal.Content>
                    <Search
                        placeholder='search'
                        onResultSelect={handleSelectUser}
                        onSearchChange={handleSearchChange}
                        results={userSearchResults}
                        resultRenderer={resultRenderer}
                        value={userSearch}
                    />
                    <ul>
                        {directMessageToEdit?.users?.map((user) => <li key={user.id}>{user.firstName} {user.lastName}</li>)}
                    </ul>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSaveDirectMessage}>Save</Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}