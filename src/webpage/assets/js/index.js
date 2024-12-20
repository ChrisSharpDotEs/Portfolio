class CookieModal {
    #myModal;
    cookieContent;

    constructor(id, cookieContent) {
        this.#myModal = new bootstrap.Modal(document.getElementById(id));
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
window.addEventListener('load', () => {
    let cookie = new CookieController();
});
