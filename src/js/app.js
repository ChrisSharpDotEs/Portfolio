import '../scss/app.scss';
import { Modal } from 'bootstrap';

class CookieController {
    value = {};
    configs = {
        expires: { days: 0, hours: 0, minutes: 1 },
        samesite: 'Lax'
    };
    constructor(cookieName, value, path = '', configs) {
        this.cookieName = cookieName;
        this.path = path;
        if (value) {
            this.value = value;
        }
        if (configs) {
            this.configs = configs;
        }
    }
    init() {
        if (!this.existsCookie()) {
            this.setCookie(this.value);
        }
    }
    getExpireTime() {
        const factor = { days: 86400000, hours: 3600000, minutes: 60000 };
        const customTime = Object.keys(this.configs.expires).map(key =>
            this.configs.expires[key] * factor[key]).reduce((acc, current) => acc += current, 0);
        let date = new Date();
        date.setTime(date.getTime() + customTime);
        return `expires=${date.toUTCString()};`;
    }
    getSameSite() {
        return `SameSite=${this.configs.samesite};`;
    }
    getPath() {
        return `path=/${this.path};`;
    }
    setValue(value){
        this.value = value;
        this.setCookie();
    }
    setCookie() {
        const jsonvalue = JSON.stringify(this.value);
        const cookieConfig = this.getExpireTime().concat(this.getPath(), this.getSameSite());
        document.cookie = `${this.cookieName}=${jsonvalue};${cookieConfig}`;
    }
    existsCookie() {
        return document.cookie.includes(this.cookieName);
    }
    deleteCooKie() {
        if(this.existsCookie()) {
            console.log('cookie borrada');
            document.cookie = `${this.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;${this.getPath()};`;
        }
    }
}
class ConsentCookieModal {
    constructor(id, cookieName) {
        this.myModal = new Modal(document.getElementById(id));
        this.cookie = new CookieController(cookieName);
        this.tabs = document.querySelectorAll('.cookie-content');
    }
    init() {
        if (true || !this.cookie.existsCookie()) {
            this.myModal.show();
            this.toggleTabs();
            this.confirm();
        }
    }
    toggleTabs() {
        document.querySelectorAll('#cookie-settings .border-start').forEach((item, index, array) => {
            item.addEventListener('click', () => {
                this.tabs.forEach(
                    item => { if (!item.classList.contains('d-none')) item.classList.add('d-none') }
                );
                array.forEach(item => {
                    if (item.classList.contains('border-primary')) {
                        item.classList.replace('border-primary', 'border-white');
                    }
                });
                this.tabs.item(index).classList.remove('d-none');
                item.classList.replace('border-white', 'border-primary');
            });
        });
    }
    confirm() {
        let choices = document.getElementById('cookie-consent-choices');
        let allCookies = document.getElementById('cookie-consent-all');

        choices.addEventListener('click', () => {
            let selectedCookies = [...document.getElementById('cookie-settings')
                .getElementsByTagName('input')]
                .filter(item => item.checked).map(item => item.getAttribute('id')); 
            this.cookie.setValue(JSON.stringify([selectedCookies]), 0, 0, 1);
        });
        allCookies.addEventListener('click', () => {
            let selectedCookies = [...document.getElementById('cookie-settings')
                .getElementsByTagName('input')].map(item => item.getAttribute('id'));
            this.cookie.setValue(selectedCookies, 0, 0, 1);
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
        let cookie = new ConsentCookieModal('cookie-settings', 'consent-cookie');
        cookie.init();
        ['canplay', 'error'].forEach(item => video.addEventListener(item, () => spinner.style.display = 'none'));
    } catch (error) {
        console.log(error);
    }
});