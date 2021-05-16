import { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import moment from 'moment';
import './style.css';

export function ChatInput({ messages, onPost, isLoading, onDelete }) {
    const [postMessage, setPostMessage] = useState('');

    const handlePostMessage = () => {
        onPost(postMessage);
        setPostMessage('');
    };

    const getDate = (timestamp) => {
        if (moment().isSame(timestamp, 'd')) {
            return moment(timestamp).format('hh:mm');
        } else {
            return moment(timestamp).format('MM/DD hh:mm')
        }
    }

    return (
        <>
            <div className='message-area'>
                    <ul>
                        {messages.map((message, i) => {
                            return (
                                <li key={i}>
                                    <h4>{message.sender.firstName} {message.sender.lastName}</h4>
                                    <p>{message.messageBody}</p>
                                    <span className='date'>{getDate(message.timestamp)}</span>
                                    <i className='delete-message icon-cross' onClick={() => onDelete(message.id)} />
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <Form onSubmit={handlePostMessage} className='chat-input'>
                    <Input
                        size='massive'
                        value={postMessage}
                        onChange={({ target: { value }}) => setPostMessage(value)}
                    />
                    <Button size='massive'>Send</Button>
                </Form>
            
        </>
    );
}