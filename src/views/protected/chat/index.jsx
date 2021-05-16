import { useState, useMemo, useEffect } from 'react';
import { useAuthContext, GlobalActionTypes } from '../../../dataLayer/auth';
import { ChatInput } from './ChatInput';
import Api from '../../../dataLayer/api';
import { useQuery } from 'react-query';
import { useRouteMatch, useHistory } from 'react-router-dom';
import './chat.css';
import { Channels } from './Channels';
import { DM } from './DM';

export function Chat() {
    const { params: { id, type } } = useRouteMatch();
    const history = useHistory();
    const [url, setUrl] = useState(() => `/messages/${type}/${id}`)
    const fetchMessages = () => Api.get(url);
    const { isLoading: isLoadingMessages, data: messages = [], refetch: refetchMessages } = useQuery(['messages', url], fetchMessages);
    const { user, webSocket, dispatch } = useAuthContext();

    useEffect(() => {
        setUrl(`/messages/${type}/${id}`);
        if (type === 'direct-messages') {
            dispatch({ type: GlobalActionTypes.removeUnreadMessage, payload: +id })
        }
    },[type, id])

    useMemo(() => {
        webSocket.addListener('newMessages', () => {
            refetchMessages();
        })
    }, []);

    const handlePostMessage = async (postMessage) => {
        if (!postMessage) {
            return;
        }
        await Api.post(url, {
            sender: user,
            messageBody: postMessage,
            timestamp: Date.now()
        });
        refetchMessages();
    };

    const handleDeleteMessage = async (id) => {
        await Api.del(`${url}/${id}`);
        refetchMessages();
    };

    const handleChangeChannel = (type, id) => {
        history.push(`/chat/${type}/${id}`);
    };

    return (
        <div className='chat-area'>
            <section className='side-panel'>
                <Channels
                    selectedChannel={type === 'channels' ? +id : -1}
                    onChangeChannel={(id) => handleChangeChannel('channels', id)}
                />
                <DM
                    selectedDirectMessage={type === 'direct-messages' ? +id : -1}
                    onChangeDirectMessage={(id) => handleChangeChannel('direct-messages', id)}
                />
            </section>
            <section className='chat-panel'>
                <ChatInput messages={messages} onPost={handlePostMessage} onDelete={handleDeleteMessage} />
            </section>
        </div>
    );
}