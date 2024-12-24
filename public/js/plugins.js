function debug(message, type = 'info') {
    const styles = {
        info: 'background: green; color: white; padding: 5px; border-radius: 3px;',
        warn: 'background: yellow; color: black; padding: 5px; border-radius: 3px;',
        error: 'background: red; color: white; padding: 5px; border-radius: 3px;'
    };
    if (location.href.includes('http:')) {
        if (!styles[type]) {
            console.error('%cTipo desconocido en debug()', 'color: red;');
            return;
        }

        console.log(`%cMyTalent`, styles[type]);
        console.log(message);
    }
}
class MiniQuery {
    constructor(element, attributes = {}) {
        this.el = document.createElement(element);

        for (let attr in attributes) {
            this.el.setAttribute(attr, attributes[attr]);
        }
    }
    append(...children) {
        children.forEach(child => {
            if (child instanceof MiniQuery) {
                this.el.appendChild(child.el);
            } else if (child instanceof HTMLElement) {
                this.el.appendChild(child);
            }
        });
        return this;
    }
    text(text) {
        this.el.append(text);
        return this;
    }
    on(event, callback) {
        this.el.addEventListener(event, callback);
        return this;
    }

    get() {
        return this.el;
    }
}
class CardBuilder {
    constructor(cardContainer, storage) {
        this.cardContainer = document.getElementById(cardContainer);
        this.storage = new LocalStorageManager(storage);
        this.items = this.storage.getJSONItem();
    }
    displayCards() {
        this.cardContainer.innerHTML = '';
        this.items.forEach((item, index) => {
            this.cardContainer.appendChild(
                create('div', { class: 'col-md-4 mb-4' }).append(
                    create('div', { class: 'card' }).append(
                        create('div', { class: 'card-body' }).append(
                            create('h5', { class: 'card-title' }).text(item.company),
                            create('p', { class: 'card-text' }).text(`Fecha: ${item.fecha}`),
                            create('p', { class: 'card-text' }).text(`Puesto: ${item.puesto}`),
                            create('h5', { class: 'card-text' }).text(item.status),
                            create('div', { class: '' }).append(
                                create('button', { class: 'btn btn-outline-danger', 'data-id': index }).text('Eliminar').on('click', () => {
                                    this.deleteRecord(index);
                                })
                            )
                        )
                    )
                ).get()
            );
        });
    }
    updateItems() {
        this.items = this.storage.getJSONItem();
    }
    deleteRecord(index) {
        this.storage.deleteJSONItem(index);
        this.updateItems();
        this.displayCards();
    }
}
function create(element, attributes) {
    return new MiniQuery(element, attributes);
}
class LocalStorageManager {
    constructor(key) {
        this.key = key;
    }
    existStorage() {
        return localStorage.getItem(this.key);
    }
    getItem() {
        if (localStorage.getItem(this.key) == '[object Object]') {
            if (confirm("Error: el almacenamiento local está corrupto, ¿Desea borrarlo?")) {
                this.save([]);
            };
        }
        return localStorage.getItem(this.key) ?? null;
    }
    save(value) {
        localStorage.setItem(this.key, value);
    }
    deleteItem() {
        localStorage.removeItem(this.key);
    }
    getJSONItem() {
        return localStorage.getItem(this.key) ? JSON.parse(localStorage.getItem(this.key)) : [];
    }
    saveJSONItem(data) {
        const items = this.getJSONItem().length > 0 ? this.getJSONItem() : [];
        items.push(data);
        localStorage.setItem(this.key, JSON.stringify(items));
    }
    deleteJSONItem(index) {
        const items = this.getJSONItem();
        items.splice(index, 1);
        localStorage.setItem(this.key, JSON.stringify(items));
    }
}
class FormManager {
    constructor(id, action) {
        this.form = document.getElementById(id);
        this.action = action;
    }
    init() {
        this.handleEvents();
    }
    handleEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(this.form);
            const formDataObject = Object.fromEntries(data.entries());
            this.action(formDataObject);
        });
    }
}
class FileManager {
    constructor(storage) {
        this.storage = new LocalStorageManager(storage);;
        this.config = {
            enableGetJSON: true,
            enableUpload: true
        };
        this.init();
    }
    init() {
        if (this.config.enableGetJSON) {
            this.saveData();
        }
        if (this.config.enableUpload) {
            this.uploadData();
        }
    }
    showData() {
        document.getElementById('showJson').addEventListener('click', () => {
            let items = JSON.stringify(this.storage.getJSONItem() || {});
            const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(items);

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'data.json';
            a.click();
        });
    }
    saveData() {
        document.getElementById('download').addEventListener('click', () => {
            let items = JSON.stringify(this.storage.getJSONItem() || {});

            const blob = new Blob([items], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `registro${new Date()}.json`.replace(' ', '_');

            link.click();
        });
    }
    loadData(file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const fileContent = event.target.result;

            const data = JSON.parse(fileContent);

            document.getElementById('output').textContent = JSON.stringify(data, null, 2);
        };

        reader.readAsText(file);
    }
    uploadData() {
        const that = this;
        const fileInput = document.getElementById('jsonfile');
        const uploadButton = document.getElementById('uploadjson');
        const filename = document.getElementById('filelist');

        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            filename.innerHTML = ''; // Limpiar la vista anterior
            const file = e.target.files[0];

            if (file) {
                let icon = document.createElement('i');
                icon.classList.add('bi', 'bi-filetype-json');

                let text = document.createElement('div');
                text.classList.add('border', 'rounded', 'p-2');

                text.appendChild(icon);
                text.append(`Archivo seleccionado: ${file.name}`);
                filename.appendChild(text);
                const reader = new FileReader();

                reader.onload = function (e) {
                    try {
                        const jsonData = e.target.result;

                        that.storage.save(jsonData);
                    } catch (error) {
                        debug('Error al parsear el JSON:' + error);
                    }
                };

                reader.readAsText(file); // Lee el archivo como texto
            }
        });
    }
}
class CookieController {
    constructor(cookiename, diasExpiracion) {
        this.cookiename = cookiename;
        this.diasExpiracion = diasExpiracion;
    }
    existsCookie() {
        return document.cookie.includes(this.cookiename);
    }
    getCookie() {
        if (this.existsCookie()) {
            try {
                return JSON.parse(document.cookie.split(';').filter(item => item.includes(this.cookiename))[0].split('=')[1]);
            } catch (error) {
                let a = document.cookie;
                return {
                    error: "Ha ocurrido un error",
                    lastdata: a
                };
            }
        } else {
            return {};
        }
    }
    createCookie(data) {
        const valorJson = JSON.stringify(data);

        const fecha = new Date();
        fecha.setTime(fecha.getTime() + (this.diasExpiracion * 24 * 60 * 60 * 1000));
        const expiracion = "expires=" + fecha.toUTCString();

        document.cookie = this.cookiename + "=" + valorJson + ";" + expiracion + ";path=/;SameSite=Lax;";
    }
    appendData(data) {
        let cookie = this.getCookie();

        cookie.push(data);

        this.createCookie(cookie);

        return cookie;
    }
    updateCookie(data) {
        this.createCookie(data);
    }
    deleteCookie() {
        document.cookie = this.cookiename + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}
class TimeCounter {
    constructor(initButton, finishButton, storageName) {
        this.initButton = document.getElementById(initButton);
        this.finishButton = document.getElementById(finishButton);
        this.timeCounterStorage = new LocalStorageManager(storageName);
        this.temporizer = new Temporizador(storageName, storageName);
    }
    init() {
        this.eventsHandler();
        this.toggleButtons();
        this.printTable();
    }
    eventsHandler() {
        this.initButton.addEventListener('click', () => {
            this.setStartData();
        });
        this.finishButton.addEventListener('click', () => {
            this.setStopData();
        });
    }
    jobStarted() {
        let cookie = this.timeCounterStorage.getJSONItem();
        if (cookie == undefined) return false;
        return cookie.length > 0 && cookie.splice(-1)[0].hora_fin == null;
    }
    toggleButtons() {
        if (this.jobStarted()) {
            this.initButton.setAttribute('disabled', true);
            this.finishButton.removeAttribute('disabled');
        } else {
            this.initButton.removeAttribute('disabled');
            this.finishButton.setAttribute('disabled', true);
        }
    }
    setStartData() {
        const now = new Date();

        const startData = {
            dia: now.toLocaleDateString(), // Obtiene la fecha en formato local
            hora_inicio: now.toLocaleTimeString(), // Obtiene la hora en formato local
            hora_fin: null,
            duracion: null
        };

        this.temporizer.iniciar();
        this.timeCounterStorage.saveJSONItem(startData);
        this.toggleButtons();
    }
    setStopData() {
        const now = new Date();
        let cookie = this.timeCounterStorage.getJSONItem();

        let index = cookie.length - 1;
        let lastTask = cookie[index];

        lastTask.hora_fin = now.toLocaleTimeString();
        lastTask.duracion = calcularDiferencia(lastTask.dia, lastTask.hora_inicio, lastTask.hora_fin);

        this.timeCounterStorage.deleteJSONItem(index);
        this.timeCounterStorage.saveJSONItem(lastTask);
        this.temporizer.detener();

        this.toggleButtons();
    }
    // TODO: Clase para crear tabla genérica
    printTable() {
        let that = this;
        let historial = document.getElementById('historial');
        document.getElementById('generateTable').addEventListener('click', function () {
            let cookie = that.timeCounterStorage.getJSONItem();

            if (document.querySelector('table')) {
                document.querySelector('table').remove();
            }
            if (cookie[0] !== undefined && cookie[0].dia !== undefined) {
                if (document.querySelector('#errormessage')) {
                    document.querySelector('#errormessage').remove();
                }
                const table = document.createElement('table');
                table.classList.add('table', 'table-hover');

                const headerRow = document.createElement('tr');
                const thead = document.createElement('thead');
                const headers = ['Día', 'Hora de Inicio', 'Hora de Fin', 'Duración'];
                headers.forEach(headerText => {
                    const header = document.createElement('th');
                    header.textContent = headerText;
                    headerRow.appendChild(header);
                });
                thead.append(headerRow);
                table.appendChild(thead);
                const tbody = document.createElement('tbody');

                cookie.forEach(item => {
                    const row = document.createElement('tr');
                    Object.values(item).forEach(itemValue => {
                        let cell = document.createElement('td');
                        cell.textContent = itemValue;
                        row.append(cell);
                    });
                    tbody.appendChild(row);
                });

                table.appendChild(tbody);

                historial.appendChild(table);
            } else {
                let div = document.createElement('div');
                div.classList.add('rounded', 'p-4', 'my-2', 'bg-light-red');
                div.setAttribute('id', 'errormessage');
                let p = document.createElement('p');
                p.appendChild(document.createTextNode('No hay datos'));
                div.append(p);
                historial.innerHTML = '';
                historial.appendChild(div);
            }
        });
    }
}
class Temporizador {
    constructor(idTemporizador, storageName) {
        this.displayElemento = document.getElementById(idTemporizador);
        this.intervalo = null;

        this.temporizerStorage = new LocalStorageManager(storageName);

        let tiempoGuardado = null;

        if (this.temporizerStorage.existStorage()) {
            const ultimoRegistro = this.temporizerStorage.getJSONItem().pop();


            if (ultimoRegistro) {
                const fechaInicio = ultimoRegistro.dia.split('/').reverse().join('-');
                const horaInicio = ultimoRegistro.hora_inicio.split(':').map(h => h.padStart(2, '0')).join(':');
                const horaFin = ultimoRegistro.hora_fin;

                if (!horaFin) {
                    tiempoGuardado = new Date(`${fechaInicio}T${horaInicio}`);
                }
            }

            this.tiempoInicial = tiempoGuardado;

            this.tiempoTranscurrido = this.tiempoInicial ? Date.now() - this.tiempoInicial : 0;

            this.mostrarTiempo();
            this.updateClock();
        }
    }
    iniciar() {
        if (this.intervalo) return;

        if (!this.tiempoInicial) {
            this.tiempoInicial = Date.now();
        }
        this.updateClock();
    }
    detener() {
        clearInterval(this.intervalo);
        this.intervalo = null;
        this.tiempoTranscurrido = 0;
        this.tiempoInicial = null;
    }
    reiniciar() {
        this.detener();
        this.tiempoTranscurrido = 0;
        this.tiempoInicial = null;
        this.mostrarTiempo();
    }
    updateClock() {
        if (!this.tiempoInicial) return;
        this.intervalo = setInterval(() => {
            this.tiempoTranscurrido = Date.now() - this.tiempoInicial;
            this.mostrarTiempo();
        }, 1000);
    }
    mostrarTiempo() {
        const horas = Math.floor(this.tiempoTranscurrido / 3600000);
        const minutos = Math.floor((this.tiempoTranscurrido % 3600000) / 60000);
        const segundos = Math.floor((this.tiempoTranscurrido % 60000) / 1000);

        this.displayElemento.textContent = `${this.formatearTiempo(horas)}:${this.formatearTiempo(minutos)}:${this.formatearTiempo(segundos)}`;
    }
    formatearTiempo(unidad) {
        return unidad.toString().padStart(2, '0');
    }
}
function calcularDiferencia(dia, hora_inicio, hora_fin) {
    let fecha = dia.split('/').reverse().map(item => item.padStart(2, '0')).join('-');
    hora_inicio = hora_inicio.split(':').map(item => item.padStart(2, '0')).join(':');
    hora_fin = hora_fin.split(':').map(item => item.padStart(2, '0')).join(':');

    const inicio = new Date(`${fecha}T${hora_inicio}Z`);
    const fin = new Date(`${fecha}T${hora_fin}Z`);

    const diferenciaMs = fin - inicio;

    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

    return `${horas}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}