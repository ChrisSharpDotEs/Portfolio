import 'bootstrap';
import { Modal } from 'bootstrap';

class CookieController {
    constructor() {
        let cookieContent = document.querySelectorAll('.cookie-content');
        let existCookies = this.existsCookie('acepted-cookies');

        if (!existCookies) {
            let modal = new CookieModal('cookie-settings', cookieContent);

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
    cookieContent;

    constructor(id, cookieContent) {
        this.#myModal = new Modal(document.getElementById(id));
        this.cookieContent = cookieContent;
        this.buildModal();
    }
    buildModal() {
        this.#myModal.show();
        this.addEventHandler();
    }
    addEventHandler() {
        let that = this;
        document.querySelectorAll('.cookie-nav').forEach((item, index, array) => {
            item.addEventListener('click', function () {
                that.cookieContent.forEach(
                    item => { if (!item.classList.contains('d-none')) item.classList.add('d-none') }
                );
                array.forEach(item => {
                    if (item.classList.contains('active-border')) {
                        item.classList.remove('active-border');
                    }
                });
                that.cookieContent.item(index).classList.remove('d-none');
                item.classList.add('active-border');
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

    video.addEventListener('canplay', () => {
      spinner.style.display = 'none';
    });

    video.addEventListener('error', () => {
      spinner.style.display = 'none';
      alert('Error al cargar el video');
    });

    try {
        let cookie = new CookieController();
    } catch(error) {
        console.log(error);
    }
});