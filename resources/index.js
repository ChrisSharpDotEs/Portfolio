/*import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';*/

class UIManager {
    constructor(config) {
        if (UIManager.instance) {
            return UIManager.instance;
        }
        UIManager.instance = this;
        this.config = config;
    }
    init() {
        this.config.forEach(metodo => {
            if (typeof this[metodo] === "function") {
                this[metodo]();
            } else {
                console.log(`El método ${metodo} no existe.`);
            }
        })
    }
    navbarToggler() {
        const navbarItems = document.querySelectorAll(".navbar-item");
        if (!navbarItems) return null;
        navbarItems.forEach((item) => {
            item.addEventListener("click", () => {
                navbarItems.forEach((el) => el.classList.remove("active"));
                item.classList.add("active");
            });
        });
    }
    menuHandler() {
        document.querySelectorAll(".menu-button").forEach(item => {
            item.addEventListener('click', () => {
                const mobileMenu = item.parentElement.parentElement.parentElement.querySelector(".mobile-menu");
                if (!item || !mobileMenu) return null;
                if (mobileMenu.getAttribute('aria-expanded') == "true") {
                    mobileMenu.setAttribute('aria-expanded', "false");
                    mobileMenu.style.maxHeight = '0';
                } else {
                    mobileMenu.setAttribute('aria-expanded', "true");
                    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
                }
            });
        });
    }
    toggler() {
        const toggler = document.querySelector('button[data-tw-toggle="theme"]');
        toggler.addEventListener('click', function () {
            document.documentElement.classList.toggle('dark');
            console.log('clicked');
        })
    }
    static accordionHandler() {
        document.querySelectorAll('button[data-accordion]').forEach(item => {
            item.addEventListener('click', () => {
                const content = document.getElementById(item.getAttribute('data-accordion'));
                content.classList.toggle('max-h-0');

                if (content.classList.contains('max-h-0')) {
                    item.setAttribute('aria-expanded', 'false');
                    content.classList.remove('py-2');
                } else {
                    item.setAttribute('aria-expanded', 'true');
                    content.classList.add('py-2');
                }
            });
        });
    }
}
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);

        if (this.modal) {
            this.cerrarModalBtn = this.modal.querySelector('button[data-modal="close"');
            this.abrirModal = this.abrirModal.bind(this);
            this.cerrarModal = this.cerrarModal.bind(this);
            this.manejarClicFueraModal = this.manejarClicFueraModal.bind(this);
        } else {
            throw Error("No se encuentra el modal.");
        }
    }
    initOnLoad() {
        this.abrirModal();
        this.handleEvents();
    }
    initButtonModal(abrirModalBtnId) {
        this.abrirModalBtn = document.getElementById(abrirModalBtnId);
        this.abrirModalBtn.addEventListener('click', this.abrirModal);
        this.handleEvents();
    }
    handleEvents() {
        this.cerrarModalBtn.addEventListener('click', this.cerrarModal);
        window.addEventListener('click', this.manejarClicFueraModal);
    }
    abrirModal() {
        this.modal.classList.remove('hidden');
    }
    cerrarModal() {
        this.modal.classList.add('hidden');
    }
    manejarClicFueraModal(event) {
        if (event.target === this.modal) {
            this.cerrarModal();
        }
    }
}
class CookieModal extends Modal {
    constructor(modalId) {
        super(modalId);
    }
    #setCookie() {
        const ahora = new Date();
        ahora.setTime(ahora.getTime() + (1 * 60 * 1000));
        const fechaExpiracion = ahora.toUTCString();
        document.cookie = `accepted-cookies=false;expires=${fechaExpiracion};path=/;SameSite=Lax;`
    }
    init() {
        if (!document.cookie.includes('accepted-cookies')) {
            this.#setCookie();
            this.initOnLoad();
        }
        this.#cookieManager();
    }
    #cookieManager() {
        const tabs = ['tab1-btn', 'tab2-btn', 'tab3-btn'].map(item => document.getElementById(item));
        const contents = ['tab1-content', 'tab2-content', 'tab3-content'].map(item => document.getElementById(item));

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                contents.forEach(item => item.classList.add('hidden'));
                contents[index].classList.remove('hidden')
            });
        });
    }

}
class CountUp {
    constructor(elemento, valorFinal, opciones = {}) {
        this.elemento = elemento;
        this.valorFinal = valorFinal;
        this.opciones = {
            duration: opciones.duration || 2,
            separator: opciones.separator || ',',
            decimal: opciones.decimal || '.',
            startVal: opciones.startVal || 0,
            decimals: opciones.decimals || 0,
            callback: opciones.callback || null,
        };
        this.valorActual = this.opciones.startVal;
        this.frameRate = 30;
        this.totalFrames = this.opciones.duration * this.frameRate;
        this.frame = 0;
    }

    static initDefault() {
        const elementoContador = document.getElementById('miContador');

        const opciones = {
            duration: 2,
            separator: ',',
            decimal: '.',
        };

        const miContador = new CountUp(elementoContador, 1000, opciones);

        miContador.start();
    }

    start() {
        this.animar();
    }

    animar() {
        if (this.frame < this.totalFrames) {
            this.frame++;
            const progreso = this.frame / this.totalFrames;
            this.valorActual = this.opciones.startVal + (this.valorFinal - this.opciones.startVal) * progreso;
            this.actualizarValor();
            setTimeout(() => this.animar(), 1000 / this.frameRate);
        } else {
            this.valorActual = this.valorFinal;
            this.actualizarValor();
            if (this.opciones.callback) {
                this.opciones.callback();
            }
        }
    }

    actualizarValor() {
        let valorFormateado = this.valorActual.toLocaleString(undefined, {
            minimumFractionDigits: this.opciones.decimals,
            maximumFractionDigits: this.opciones.decimals,
        });

        if (this.opciones.separator !== ',') {
            valorFormateado = valorFormateado.replace(/,/g, this.opciones.separator);
        }
        if (this.opciones.decimal !== '.') {
            valorFormateado = valorFormateado.replace(/\./g, this.opciones.decimal);
        }

        this.elemento.textContent = valorFormateado;
    }
}

function init() {
    document.documentElement.classList.toggle('dark');
    UIManager.accordionHandler();
    try {
        if (document.getElementById('miModal')) {
            const miModal = new CookieModal('miModal');
            miModal.init();
        }

        const uiManager = new UIManager(['navbarToggler', 'menuHandler']);
        uiManager.init();

        if (document.getElementById('mySwiper')) {
            const swiper = new Swiper('#mySwiper', {
                loop: true,
                speed: 5000,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                },
                slidesPerView: 4,
                spaceBetween: 10,
                allowTouchMove: true
            });
        }
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('load', init);