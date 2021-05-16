import { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../../../../dataLayer/auth';
import Api from '../../../../dataLayer/api';
import { useQuery } from 'react-query';
import { Button, Form, Icon, Modal} from 'semantic-ui-react';

export function Channels({ onChangeChannel, selectedChannel }) {
    const fetchChannels = () => Api.get(`/channels`);
    const { isLoading: isLoadingChannels, data: channels = [], refetch: refetchChannels } = useQuery(['channels'], fetchChannels);
    const [modalVisible, setModalVisible] = useState(false);
    const [channelToEdit, setChannelToEdit] = useState({ title: '' });
    const [channelMode, setChannelMode] = useState('create');
    const { webSocket } = useContext(AuthContext);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setChannelToEdit({ title: '' });
    };

    const handleAddChannel = () => {
        setChannelMode('create');
        setChannelToEdit({ title: '' });
        handleOpenModal();
    };

    useMemo(() => {
        webSocket.addListener('newChannels', () => {
            refetchChannels();
        })
    });


    const handleChangeChannel = (e) => {
        const { target: { value, name } } = e;
        setChannelToEdit({
            ...channelToEdit,
            [name]: value
        });
    };

    const handleSaveChannel = async () => {
        if (channelMode === 'create') {
            await Api.post('/channels', channelToEdit);
        } else {
            await Api.put(`/channels/${channelToEdit.id}`, channelToEdit);
        }
        refetchChannels();
        handleCloseModal();
    };

    const handleEditChannel = (index) => {
        setChannelMode('edit');
        const channelToEdit = channels[index];
        setChannelToEdit({...channelToEdit});
        handleOpenModal();
    }

    const handleDeleteChannel = async (id) => {
        await Api.del(`/channels/${id}`);
        refetchChannels();
    };

    const handleSelectChannel = (id) => {
        onChangeChannel(id);
    };

    return (
        <>
            <div className='channel section'>
                <h3>
                    <span>Channels</span>
                    <Icon link onClick={handleAddChannel} name='add' />
                </h3>
                <ul>
                    {channels.map(({ title, id }, i) => (
                        <li className={id === selectedChannel ? 'selected' : ''} onClick={() => handleSelectChannel(id)} key={id}>
                            <span className='title'>{title}</span>
                            <span className='list-item-actions'>
                                <i onClick={() => handleEditChannel(i)} className='icon-pencil' />
                                <i onClick={() => handleDeleteChannel(id)} className='icon-cross' />
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
                    {channelMode === 'create' ? 'Create New Channel' : 'Edit Channel'}
                </Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Channel Title</label>
                            <input name='title' value={channelToEdit.title} onChange={handleChangeChannel} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSaveChannel}>Save</Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}