class Chatbox {
    constructor() {
        this.chat = document.getElementById('chat');
        this.form = document.getElementById('chat-form');
        this.sendButton = document.getElementById('client-chatbox-send');
        this.input = document.getElementById('client-chatbox-input');
    }
    init(){
        this.handleEvents();
    }
    handleEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendButton.click();
        });
        this.sendButton.addEventListener('click', async (e) => {
            const value = this.input.value.trim().toLowerCase();
            this.chat.append(this.userMessageBox(value));
            this.chat.append(this.typing());
            setTimeout(() => {
                this.chat.append(this.botResponse(value));
                this.removetyping();
            }, 2000);
        });
    }
    userMessageBox(message){
        let userMessage = document.createElement('div');
        userMessage.classList.add('message', 'client');
        userMessage.innerHTML = message;
        return userMessage;
    }
    botResponse(input) {
        const saludos = ['hola', 'saludos', 'buenos días', 'buenas noches'];
        const precios = ['precios', 'coste', 'cuánto'];

        let message = "Para cualquier aclaración adicional contacte con soporte";

        if (saludos.includes(input)) {
            message = 'Hola ¿En qué puedo ayudarte?';
        } else if(precios.includes(input)) {
            message = 'Para conocer nuestros precios actuales envíe un email a example@email.com y nos pondremos en contacto lo más pronto posible';
        }
        return this.botMessageBox(message);
    }
    botMessageBox(message) {
        let userMessage = document.createElement('div');
        userMessage.classList.add('message');
        userMessage.innerHTML = message;
        return userMessage;
    }
    typing() {
        let message = document.createElement('div');
        message.classList.add('message');
        message.setAttribute('data-chatbot', 'bot-typing');
        
        for(let i in [1, 2, 3]) {
            let typing = document.createElement('div');
            typing.classList.add('typing', 'typing-' + i);
            message.append(typing);
        }
        return message;
    }
    removetyping() {
        document.querySelector('div[data-chatbot="bot-typing"]').remove();
    }
}

window.addEventListener('load', function () {
    const chat = new Chatbox();
    chat.init();
});