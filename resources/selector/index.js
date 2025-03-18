export class ThemeSwitcher {

    constructor(themeProperty) {
        this.theme = themeProperty;
    }
    static initDefault() {
        ThemeSwitcher.showActiveTheme(ThemeSwitcher.getPreferredTheme());
    }
    init() {
        ThemeSwitcher.showActiveTheme(ThemeSwitcher.getPreferredTheme());

        document.querySelectorAll(this.theme).forEach(toggle => {
            toggle.addEventListener('click', () => {
                const theme = toggle.getAttribute('data-bs-theme-value');
                ThemeSwitcher.setStoredTheme(theme);
                ThemeSwitcher.setTheme(theme);
                ThemeSwitcher.showActiveTheme(theme, true);
            });
        });
    }
    static preferedTheme = () => getStoredTheme() ? getStoredTheme() :
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    static getStoredTheme = () => localStorage.getItem('theme');

    static setStoredTheme = theme => localStorage.setItem('theme', theme);

    static setTheme = theme => {
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    };
    static getPreferredTheme = () =>
        ThemeSwitcher.getStoredTheme() ? ThemeSwitcher.getStoredTheme() :
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    static showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme');

        if (!themeSwitcher) {
            document.body.setAttribute('data-bs-theme', theme);
            return 0;
        }

        const themeSwitcherText = document.querySelector('#bd-theme-text');
        const activeThemeIcon = document.querySelector('i.theme-icon-active');

        const btnToActive = ThemeSwitcher.changeActiveBtn(theme);

        const iconOfActiveBtn = btnToActive.querySelector('i').classList.item(1);
        activeThemeIcon.classList.replace(activeThemeIcon.classList.item(1), iconOfActiveBtn);

        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
        themeSwitcher.setAttribute('aria-label', themeSwitcherLabel);

        if (focus) {
            themeSwitcher.focus();
        }

        document.querySelectorAll('[data-bs-theme]').forEach(
            theme => theme.setAttribute('data-bs-theme', localStorage.getItem('theme'))
        );
    }
    static changeActiveBtn(theme) {
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);

        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active')
            element.setAttribute('aria-pressed', 'false')
        });

        btnToActive.classList.add('active');
        btnToActive.setAttribute('aria-pressed', 'true');

        ThemeSwitcher.setCheckedButton();
        return btnToActive;
    }
    static setCheckedButton() {
        document.querySelectorAll('[data-bs-theme-value]>i.bi-check2').forEach(icon => {
            icon.classList.add('d-none');
            if (icon.parentNode.getAttribute('aria-pressed') === 'true') {
                icon.classList.remove('d-none');
            }
        });
    }
}

class MapaInteractivo {
    constructor(lat, lon, zoom) {
        this.map = L.map('map').setView([lat, lon], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
        }).addTo(this.map);
        this.map.attributionControl.setPrefix(false);
        let text = '<a class="px-2" href="https://leafletjs.com/">LeafLet</a><span>| © OpenStreetMap contributors</span>';
        this.map.attributionControl.addAttribution(text);
    }
    actualizarUbicacion(lat, lon, zoom) {
        this.map.setView([lat, lon], zoom);
    }
    agregarMarcador(lat, lon, texto) {
        return L.marker([lat, lon]).addTo(this.map)
            .bindPopup(texto)
            .openPopup();
    }
    actualizarZoom(nuevoZoom) {
        this.map.setZoom(nuevoZoom);
    }
    eliminarMarcador(marcador) {
        this.map.removeLayer(marcador);
    }
}

class CitySelector {
    static marcadorActual = null;

    constructor() {
        this.selectProvincias = document.getElementById('provincia');
        this.selectIsla = document.getElementById('isla');
        this.selectMunicipios = document.getElementById('municipio');
    }
    async init() {
        this.mapa = new MapaInteractivo(28.2916, -16.6291, 10);

        this.selectIsla.setAttribute('disabled', true);
        this.selectMunicipios.setAttribute('disabled', true);

        this.loadData().then(async (response) => {
            const datos1 = await response[0].json();
            const datos2 = await response[1].json();

            this.provincias = datos1.Canarias.provincias;

            this.islas = (provincia) => this.provincias.filter(item => item.nombre == provincia)
                .flatMap(item => item.islas);

            this.municipios = (islas, isla) => islas.filter(item => item.nombre == isla)
                .flatMap(item => item.municipios);

            this.coords = datos2;
            this.agregarProvincias();
        });
    }
    agregarProvincias() {
        [...this.selectProvincias.getElementsByTagName('option')].filter(item => item.value != 0).forEach(item => {
            item.remove();
        });

        this.provincias.map(item => item.nombre).sort().map(item => {
            let option = document.createElement('option');
            option.classList.add('p-2');
            option.value = item;
            option.innerHTML = item;
            this.selectProvincias.appendChild(option);
        });

        this.selectProvincias.addEventListener('change', (e) => {
            let value = e.currentTarget.value;
            this.agregarIslas(this.islas(value));
            if (value == 0) {
                this.selectIsla.setAttribute('disabled', false);
                this.selectMunicipios.setAttribute('disabled', false);
            }
        });
    }
    agregarIslas(islas) {
        [...this.selectIsla.getElementsByTagName('option')].filter(item => item.value != 0).forEach(item => {
            item.remove();
        });
        this.selectIsla.removeAttribute('disabled');
        islas.flatMap(item => item.nombre).sort().map(item => {
            let option = document.createElement('option');
            option.classList.add('p-2');
            option.value = item;
            option.innerHTML = item;
            this.selectIsla.appendChild(option);
        });

        this.selectIsla.addEventListener('change', (e) => {
            let value = e.currentTarget.value;
            this.agregarMunicipios(this.municipios(islas, value));
            if (value == 0) {
                this.selectMunicipios.setAttribute('disabled', false);
            }
        });
    }
    agregarMunicipios(municipios) {
        [...this.selectMunicipios.getElementsByTagName('option')].filter(item => item.value != 0).forEach(item => {
            item.remove();
        });

        this.selectMunicipios.removeAttribute('disabled');

        municipios.sort().map(item => {
            let option = document.createElement('option');
            option.classList.add('p-2');
            option.value = item;
            option.innerHTML = item;
            this.selectMunicipios.appendChild(option);
        });

        this.selectMunicipios.addEventListener('change', ev => {
            const municipio = ev.target.value;
            if (CitySelector.marcadorActual != null) {
                this.mapa.eliminarMarcador(CitySelector.marcadorActual);
            }
            if (this.coords[municipio]) {
                const { lat, lon } = this.coords[municipio];
                this.mapa.actualizarUbicacion(lat, lon, 12);
                CitySelector.marcadorActual = this.mapa.agregarMarcador(lat, lon, municipio);
            }
        });
    }
    async loadData() {
        try {
            const respuestas = await Promise.all([
                fetch('./appdata/cities.json'),
                fetch('./appdata/GeoCoords.json')
            ]);
            respuestas.forEach(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('Error en la solicitud: ' + respuesta.status);
                }
            });

            return respuestas;
        } catch (error) {
            console.error('Hubo un problema con la operación fetch:', error);
            throw error;
        }
    }
}

window.addEventListener('load', async function () {
    let theme = new ThemeSwitcher('data-bs-theme');
    theme.init();

    let cs = new CitySelector();
    cs.init();
});