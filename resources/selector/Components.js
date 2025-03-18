export const ActiveSwitch = {
    init() {
        let getfile = document.location.href.split('/').pop();
    },
    reset() {
        document.querySelectorAll('nav nav-link').forEach(
            item => item.classList.contains('active') ? item.classList.remove('active') : 0
        );
    }
}
export const NetWorkAnimation = {
    canvas: null,
    ctx: null,
    nodes: [],
    numNodes: 21,
    maxDistance: window.innerWidth/5,
    maxConnections: 4,
    speedfactor: 0.5,
    minDistance: 50,
    repulsionFactor: 0.001,

    initialize() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = 150;

        for (let i = 0; i < this.numNodes; i++) {
            this.nodes.push(this.createNode());
        }

        this.animate();
    },

    createNode() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.speedfactor,
            vy: (Math.random() - 0.5) * this.speedfactor,
        };
    },

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.stroke();
    },

    updateNodes() {
        this.nodes.forEach((node, index) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            this.nodes.forEach((otherNode, otherIndex) => {
                if (index === otherIndex) return;

                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.minDistance) {
                    const angle = Math.atan2(dy, dx);
                    const repulsionForce = this.repulsionFactor;
                    node.vx += Math.cos(angle) * repulsionForce;
                    node.vy += Math.sin(angle) * repulsionForce;
                }
            });
        });
    },

    drawNodes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.fill();
        });

        const connections = this.nodes.map(() => []);

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (connections[i] >= this.maxConnections || connections[j] >= this.maxConnections) {
                    continue;
                }

                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    this.drawLine(this.nodes[i].x, this.nodes[i].y, this.nodes[j].x, this.nodes[j].y);
                    connections[i]++;
                    connections[j]++;
                }
            }
        }
    },

    animate() {
        this.updateNodes();
        this.drawNodes();
        requestAnimationFrame(() => this.animate());
    }
}
export class SnippetConverter {
    #snippetname;
    #prefix;
    #scope;
    #body;
    #description;
    static SCOPES = ['html', 'javascript, typescript', 'php'];

    constructor(snippetname, prefix, scope, body, description) {
        this.#snippetname = snippetname;
        this.#prefix = prefix;
        this.#scope = SnippetConverter.SCOPES[scope];
        this.#body = this.#formatBody(body);
        this.#description = description;
    }

    static init() {
        document.querySelectorAll('input').forEach(item => {
            item.addEventListener('keyup', function () {
                item.classList.remove('is-invalid');
                if (item.children[2]) item.children[2].remove();
            });
        });

        document.forms[0].addEventListener('submit', function (e) {
            let filled = true;
            e.preventDefault();

            if (!e.currentTarget.checkValidity()) {
                e.preventDefault();
                filled = false;
                item.classList.add('is-invalid');
                item.parentNode.insertAdjacentHTML('beforeend', '<small class="text-danger">Debe rellenar este campo.</small>')
            }

            if (filled) {
                let snp = new SnippetConverter(
                    snippetname.value,
                    prefix.value,
                    scope.value,
                    body.value,
                    description.value
                );
                let snippetContent = snp.parseSnippet();

                output.append(html(snippetContent, snp.getPrefix()));
                document.forms[0].body.innerHTML = '';
            }
        });

        copysnippets.addEventListener('click', function (e) {
            let result = '';
            document.querySelectorAll('[data-snippet-json]').forEach(item => {
                result += item.getAttribute('data-snippet-json') + ',';
            })
            copyData(result);
        });
    }

    getPrefix() {
        return this.#prefix;
    }

    #formatBody(value) {
        let text = value.replace(/\s*<!--[\s\S]*?-->/g, '')
            .replace(/"/g, '\\"')
            .split('\n')
            .map(item => {
                return `"${item}",`
            })
            .join('\n');
        return text.substring(0, text.lastIndexOf(','));
    }

    parseSnippet() {
        return `"${this.#snippetname}": {\n\t"scope": "${this.#scope}",\n\t"prefix": "${this.#prefix}",`
            + `\n\t"body": [${this.#body}],\n\t"description": "${this.#description}"\n}`;
    }
}
export class CookieController {
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
export class DragAndDrop {

    constructor(containerAId, containerBId) {
        this.containerA = document.getElementById(containerAId);
        this.containerB = document.getElementById(containerBId);
        this.init();
    }

    init() {
        new Sortable(this.containerA, {
            group: 'shared', // set both lists to same group
            animation: 150
        });

        new Sortable(this.containerB, {
            group: 'shared',
            animation: 150
        });
    }

    getOrder() {
        let orderA = new ContainerOrder(this.containerA);
        let orderB = new ContainerOrder(this.containerB);
        return [orderA, orderB].map(item => item.printOrder());
    }
} 
export class ModalHandler {
    #myModal;

    constructor(id) {
        this.#myModal = new bootstrap.Modal(document.getElementById(id));
    }

    show(message, color) {
        let modal = document.getElementById('modal-color');
        let modalText = document.getElementById('modal-message');
        if (color) {
            modal.classList.add('bg-light-success');
            modal.classList.remove('bg-light-warning');
        } else {
            modal.classList.add('bg-light-warning');
            modal.classList.remove('bg-light-success');
        }
        modalText.innerHTML = message;
        this.#myModal.show();

    }
}
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
class ContainerOrder {
    constructor(container) {
        this.container = container;
    }

    #getOrder() {
        const items = Array.from(this.container.querySelectorAll('.draggable'));
        return items.map(item => item.textContent.trim());
    }

    printOrder() {
        const order = this.#getOrder();
        console.log(`Order in ${this.container.id}:`, order);
        return order;
    }
}
export class CodeBeautifier {
    constructor() { }

    init(lines) {
        let blueWords = [
            'let',
            'document'
        ];
        let codegroup = document.getElementsByClassName('code')[0];
        let enumgroup = document.getElementsByClassName('enumeration')[0];

        lines.forEach((line, index) => {
            let code = document.createElement('div');
            let num = document.createElement('div');

            let nuevoTexto = line.replace(/\.(\w+)\(/g, '.<span class="text-method">$1</span>(');
            nuevoTexto = this.replaceStrings(nuevoTexto);

            code.innerHTML = nuevoTexto;
            codegroup.append(code);


            num.append(index + 1);
            enumgroup.append(num);
        });

    }
    replaceStrings(line) {
        return line.replace(/('\w+')/g, '<span class="text-string">$1</span>');
    }
    replaceParenthesis(line) {
        return line
    }
}
export class BudgetBuilder {
    constructor(data) {
        this.data = data;
    }
    init() {
        let container = document.getElementById('cards');
        this.data.forEach(item =>
            container.append(this.generateCard(item))
        );
        setTimeout(() =>this.countup(this.data, 1, 0, 50), 2000);
    }
    generateCard(content) {
        let cardBody = this.generateElement('div', ['card-body'], { 'data-counter': 1 });
        cardBody.append(0);
        let card = this.generateElement('div', ['card']);
        card.append(cardBody);

        let container = this.generateElement('div', ['col-md-4', 'p-2']);
        container.append(card);
        return container;
    }
    generateElement(element, classes, attributes = null) {
        let el = document.createElement(element);
        classes.forEach(item => el.classList.add(item));
        if (attributes != null) {
            Object.keys(attributes).forEach((item, index) => el.setAttribute(item, attributes[item]));
        }
        return el;
    }
    countup(values, increment, currentCount, intervalTime) {
        let counters = [...document.querySelectorAll('div[data-counter]')];

        counters.forEach((counterElement, index) => {
            let targetCount = values[index];

            const counterUp = setInterval(() => {
                currentCount += increment;
                counterElement.textContent = `${currentCount} €`;
                if (currentCount >= targetCount) {
                    clearInterval(counterUp);
                }
            }, intervalTime);
        });
    }
}
class DomBuilder extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Crear un contenedor principal
        this.container = document.createElement('div');
        this.shadowRoot.appendChild(this.container);
    }
    // Método para agregar un nuevo elemento
    addElement(tag, options = {}) {
        const el = document.createElement(tag);

        // Asignar atributos si existen
        if (options.attributes) {
            Object.keys(options.attributes).forEach(attr => {
                el.setAttribute(attr, options.attributes[attr]);
            });
        }

        // Asignar clases si existen
        if (options.classes) {
            el.className = options.classes.join(' ');
        }

        // Asignar contenido de texto si existe
        if (options.text) {
            el.textContent = options.text;
        }

        // Asignar contenido HTML si existe
        if (options.html) {
            el.innerHTML = options.html;
        }

        // Asignar eventos si existen
        if (options.events) {
            Object.keys(options.events).forEach(event => {
                el.addEventListener(event, options.events[event]);
            });
        }

        // Agregar el nuevo elemento al contenedor principal
        this.container.appendChild(el);

        // Retornar el elemento para permitir encadenamiento
        return this;
    }
    // Método para limpiar el contenedor
    clear() {
        this.container.innerHTML = '';
        return this;
    }
}
export const TaskManager = {
    tableColors: {
        'not started': 'table-danger',
        'started': 'table-warning',
        'finished': 'table-success'
    },

    init() {
        try {
            this.loadTaskData();
            this.modifyTask();
            this.addTask();

        } catch (error) {
            console.log(error);
        }

    },

    loadTaskData() {
        let tbody = document.getElementById('tbodytasks');
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        let table = document.getElementById('sortable-table');
        let messages = document.getElementById('messages');

        if (tasks == null || tasks.length == 0) {
            table.classList.add('d-none');
            messages.classList.toggle('d-none');
            messages.innerHTML = 'No hay tareas.';
        } else {
            messages.classList.toggle('d-none');
            table.classList.remove('d-none');
            tasks.forEach(task => tbody.appendChild(this.buildTaskRow(task)));
        }
    },

    modifyTask() {
        document.querySelectorAll('i.bi-pencil-square').forEach(item => item.parentNode.addEventListener('click', (e) => {
            let row = [...e.currentTarget.parentNode.parentNode.children]
                .map(item => item.children.length > 0 ? [...item.children] : item.innerHTML);

            let modalData = {
                nombre: row[0][1].innerHTML,
                imagen: row[0][0].src,
                codigo: row[1],
                concepto: row[2],
                created_at: row[3],
                status: row[4]
            };

            $('#kanmodal').modal('show');
            this.buildModal(modalData);
        }));
    },

    buildTrashButton(rowData) {
        let that = this;
        let button = document.createElement('button');
        let icon = document.createElement('i');
        button.classList.add('btn');
        [['data-toggle', "tooltip"], ['data-placement', 'bottom'], ['title', 'Eliminar tarea']]
            .forEach(item => button.setAttribute(item[0], item[1]));

        icon.classList.add('bi', 'bi-trash');
        button.appendChild(icon);

        button.addEventListener('click', function () {
            let rows = [...document.querySelectorAll('tbody tr')];
            let index = rows.indexOf(rows.find(item => item.getAttribute('data-id') == rowData.code));

            let taskList = JSON.parse(localStorage.getItem('tasks'));

            taskList.splice(index, 1);

            localStorage.setItem('tasks', JSON.stringify(taskList));

            rows[index].remove();

            if (taskList.length == 0) {
                that.loadTaskData();
            }
        });

        return button;
    },

    buildEditbutton(rowData) {
        let button = document.createElement('button');
        let icon = document.createElement('i');

        button.classList.add('btn');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#kanmodal');
        icon.classList.add('bi', 'bi-pencil-square');

        button.appendChild(icon);

        return button;
    },

    buildModal(data) {
        modalTitleId.innerHTML = data.nombre;
        modalImage.src = data.imagen;
        modalStatus.innerHTML = data.status;
        taskdescription.innerHTML = data.nombre;
        taskDate.innerHTML = data.created_at;

    },

    buildTaskRow(rowData) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        tr.setAttribute('data-status', rowData.status);
        tr.setAttribute('data-id', rowData.code);

        Object.keys(rowData).forEach((item, index) => {
            let td = document.createElement('td');

            if (item == 'nombre') {
                let img = document.createElement('img');
                let nombre = document.createElement('span');
                nombre.appendChild(document.createTextNode(rowData[item]));
                nombre.classList.add('px-2');

                img.src = '../media/dummyuser.png';
                img.alt = 'Imagen de usuario';
                img.classList.add('img-fluid', 'rounded-circle');
                img.width = '30';
                td.appendChild(img);
                td.appendChild(nombre);
            } else {
                td.appendChild(document.createTextNode(rowData[item]));
            }
            tr.appendChild(td);
        });

        td.appendChild(this.buildEditbutton(rowData))
        td.appendChild(this.buildTrashButton(rowData));
        tr.appendChild(td);

        [...tr.children].forEach(item => item.classList.add(this.tableColors[tr.getAttribute('data-status')]));

        return tr;
    },

    addTask() {
        let saveTaskButton = document.getElementById('save-new-task');
        let rowData = [...document.getElementsByTagName('tr')].filter(item => item.hasAttribute('data-status'));

        let tbody = document.getElementById('tbodytasks');

        saveTaskButton.addEventListener('click', () => {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            let fecha = new Date();
            let fechaFormada = fecha.getDate() + '/' + fecha.getMonth() + 1 + '/' + fecha.getFullYear();

            let data = {
                nombre: encargado.value,
                code: parseInt(Math.random() * 10000) + ['A', 'B', 'C'][parseInt(Math.random() * 3)],
                concepto: descriptionTask.value,
                created_at: fechaFormada,
                status: statustask.value,
                priority: priorityTask.value
                //finish_time: fecha_fin.value,
            };

            tasks.push(data);

            localStorage.setItem('tasks', JSON.stringify(tasks));

            tbody.innerHTML = '';

            this.loadTaskData();
        });
    },

    removeTask() {
        //TODO
    }
};
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
const TaskBuilder = {

};

document.create = function (element, classes, textcontent, styles) {
    let el = document.createElement(element);
    el.classList.add(...classes);
    Object.keys(styles).forEach((style, index) => el.style[style] = Object.values(styles)[index]);
    el.append(textcontent);
    return el;
}
function html(data, snippetTitle) {
    let border = document.create(
        'li', ['list-group-item', 'border', 'my-2'], '', { borderRadius: '0px', padding: '0px' }
    );
    border.setAttribute('data-snippet-json', data);

    let flex = document.create('div', ['d-flex'], '', {});

    let title = document.create('div', ['p-3', 'mx-2', 'w-75'], snippetTitle, {});

    let button = document.create('button', ['btn', 'btn-danger', 'w-25'], 'X', { borderRadius: '0px' })
    button.addEventListener('click', function (e) {
        e.currentTarget.parentNode.parentNode.remove();
    });

    flex.append(title);
    flex.append(button);

    border.append(flex);

    return border;
}
function copyData(dataInfo) {
    navigator.clipboard.writeText(dataInfo).then(() => {
    }).catch(err => {
        console.error('Error al copiar al portapapeles: ', err);
    });
}
function compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
function arraysAreEqual2D(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) {
            return false;
        }

        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) {
                return false;
            }
        }
    }

    return true;
}
export class LineChart {
    constructor(canvasId, dates, expenses) {
        this.canvasId = canvasId;
        this.dates = dates;
        this.expenses = expenses;
    }
    render() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.dates,
                datasets: [{
                    label: 'Gastos en Euros',
                    data: this.expenses,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0
                }]
            },
            options: {
                response: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Gastos'
                        }
                    }
                }
            }
        });
    }
}
export class FileReaderAPI {
    constructor(idInput) {
        this.fileInputId = idInput;
    }
    async init() {
        let that = this;
        let file = that.getFile();

        if (file && file.name.includes('xls')) {
            try {
                const jsonData = await that.readExcel(file);

                return jsonData;
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Por favor selecciona un archivo.');
        }
    }
    getFile() {
        const fileInput = document.getElementById('upload');
        const file = fileInput.files[0];
        return file;
    }
    processCSV(csvContent) {
        const rows = csvContent.split('\n');
        let content = [];

        rows.forEach((row, index) => {
            const columns = row.split(';');
            if (index !== 0) {
                content.push({
                    x: columns[0],
                    y: columns[3]
                });
            }
        });

        output.innerHTML = content;
        //this.renderLineChart(content);
        return content;
    }
    readExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const excelFile = file;

            reader.onload = async function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Suponiendo que quieres leer la primera hoja
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convierte los datos de la hoja a un formato JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            };

            reader.onerror = function (error) {
                reject(error);
            }

            reader.readAsArrayBuffer(excelFile);
        });
    }
    renderLineChart(data) {
        let that = this;
        let filtered = data.filter(item => that.parseDate(item.x) > that.parseDate("01/05/2024"));
        filtered = filtered.map(item => { return { x: that.convertToISODate(item.x), y: parseFloat(item.y) } });

        let graph = new LineChart('miCanvas', '', filtered);
        graph.render();
    }
    parseDate(dateString) {
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
        const year = parseInt(parts[2], 10);

        return new Date(year, month, day);
    }

    convertToISODate(dateString) {
        const parts = dateString.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }


}
