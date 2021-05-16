
export default class ChatStorage {
    storageKey = 'chat-storage';
    messages = [];
    constructor() {
        this.getMessages();
    }

    getMessages = () => {
        const messagesJson = localStorage.getItem(this.storageKey);
        try {
            if (messagesJson) {
                this.messages = JSON.parse(messagesJson);
            } else {
                this.messages = [];
            }
        } catch(e) {
            this.messages = [];
        }
    }

    setMessages = (messages) => {
        if (messages) {
            this.messages = messages;
        }
        localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
    }

    clearMessages = () => {
        this.setMessages([])
    }
}