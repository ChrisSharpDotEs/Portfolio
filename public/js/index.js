const NavbarHighlighter = function () {
    const navbarItems = document.querySelectorAll(".navbar-item");

    navbarItems.forEach((item) => {
        item.addEventListener("click", () => {
            navbarItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
        });
    });
};

const Swiper = function () {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    let index = 0;

    function showSlide(i) {
        index = (i + slides.length) % slides.length;
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    prevButton.addEventListener("click", () => showSlide(index - 1));
    nextButton.addEventListener("click", () => showSlide(index + 1));
};

const MobileViewHandler = function () {
    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("max-h-0");
        mobileMenu.classList.toggle("max-h-full");
    });
};
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.cerrarModalBtn = this.modal.querySelector('button');
        this.abrirModal = this.abrirModal.bind(this);
        this.cerrarModal = this.cerrarModal.bind(this);
        this.manejarClicFueraModal = this.manejarClicFueraModal.bind(this);
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

function init() {
    const miModal = new Modal('miModal');
    miModal.initOnLoad();
    
    NavbarHighlighter();
    Swiper();
    MobileViewHandler();
}

window.addEventListener('DOMContentLoaded', init);