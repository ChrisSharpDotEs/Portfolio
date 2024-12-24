import '../scss/app.scss';
import { Modal } from 'bootstrap';

class CookieController {
    constructor() {
        this.cookieContent = document.querySelectorAll('.cookie-content');
    }
    init() {
        if (!this.existsCookie('acepted-cookies')) {
            const modal = new CookieModal('cookie-settings', this.cookieContent);
            modal.buildModal();
            this.confirm();
        }
    }
    setCookie(name, value, days, hours, minutes) {
        let expires = "";
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000));

        expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + (value || "") + expires + "; path=/" + ";SameSite=Lax;";
    }
    existsCookie(name) {
        return document.cookie.includes(name);
    }
    confirm() {
        let that = this;
        let choices = document.getElementById('cookie-consent-choices');
        let allCookies = document.getElementById('cookie-consent-all');

        choices.addEventListener('click', function () {
            let selectedCookies = [...document.getElementById('cookie-settings')
                .getElementsByTagName('input')]
                .filter(item => item.checked).map(item => item.getAttribute('id'));

            that.setCookie('acepted-cookies', JSON.stringify([selectedCookies]), 0, 0, 1);
        });
        allCookies.addEventListener('click', function () {
            let selectedCookies = [...document.getElementById('cookie-settings')
                .getElementsByTagName('input')].map(item => item.getAttribute('id'));

            that.setCookie('acepted-cookies', selectedCookies, 0, 0, 1);
        });
    }
}
class CookieModal {
    #myModal;
    constructor(id, cookieContent) {
        this.#myModal = new Modal(document.getElementById(id));
        this.cookieContent = cookieContent;
    }
    buildModal() {
        this.#myModal.show();
        this.addEventHandler();
    }
    addEventHandler() {
        document.querySelectorAll('#cookie-settings .border-start').forEach((item, index, array) => {
            item.addEventListener('click', () => {
                this.cookieContent.forEach(
                    item => { if (!item.classList.contains('d-none')) item.classList.add('d-none') }
                );
                array.forEach(item => {
                    if (item.classList.contains('border-primary')) {
                        item.classList.replace('border-primary', 'border-white');
                    }
                });
                this.cookieContent.item(index).classList.remove('d-none');
                item.classList.replace('border-white', 'border-primary');
            });
        });
    }
}
const loader = () => {
    const canvas = document.getElementById('spinnerCanvas');
    const ctx = canvas.getContext('2d');

    let startAngle = 0;
    let endAngle = Math.PI / 4; 
    let angleDelta = 0.05; 
    let rotationSpeed = 0.1; 

    function drawSpinner() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); 

      ctx.save(); 
      ctx.translate(canvas.width / 2, canvas.height / 2); 

      ctx.rotate(startAngle); 
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, endAngle, false); 
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#3498db'; 
      ctx.stroke();

      ctx.restore(); 

      
      startAngle += rotationSpeed;

      
      endAngle += angleDelta;
      if (endAngle > Math.PI * 1.5 || endAngle < Math.PI / 6) {
        angleDelta *= -1; 
      }

      
      requestAnimationFrame(drawSpinner);
    }

    drawSpinner(); 
}
window.addEventListener('load', function () {

    loader();

    const video = document.getElementsByTagName('video')[0];
    const spinner = document.getElementById('loader-container');

    try {
        let cookie = new CookieController();
        cookie.init();
        ['canplay', 'error'].forEach(item => video.addEventListener(item, () => spinner.style.display = 'none'));
    } catch(error) {
        console.log(error);
    }
});