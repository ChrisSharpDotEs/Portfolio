class Chatbox {
    constructor() {
        this.chat = document.getElementById('chat');
        this.sendButton = document.getElementById('client-chatbox-send');
        this.input = document.getElementById('client-chatbox-input');
    }
    init(){
        this.handleEvents();
    }
    handleEvents() {
        this.sendButton.addEventListener('click', async (e) => {
            const value = this.input.value;
            this.chat.append(this.userMessageBox(value));
            this.chat.append(this.typing());
            this.chat.append(this.botResponse(value));
            this.removetyping();
        });
    }
    userMessageBox(message){
        let userMessage = document.createElement('div');
        userMessage.classList.add('message', 'client');
        userMessage.innerHTML = message;
        return userMessage;
    }
    botResponse(input) {
        const saludos = ['Hola', 'Saludos', 'Buenos días', 'Buenas noches'];
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