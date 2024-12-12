class CourseFilter {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFilter();
        });

        this.form.addEventListener('reset', () => {
            this.clearFilters();
        });
    }

    handleFilter() {
        const filters = this.getFilters();
        console.log('Aplicando filtros:', filters);
        document.getElementById('filterElements').innerHTML = '';
        document.getElementById('filterElements').append(UIRender.generateCustomModalContent(filters));
    }

    getFilters() {
        return {
            courseName: this.form.querySelector('#courseName').value.trim(),
            category: this.form.querySelector('#category').value,
            difficulty: this.form.querySelector('#difficulty').value,
            duration: this.form.querySelector('#duration').value,
            startDate: this.form.querySelector('#startDate').value,
        };
    }

    clearFilters() {
        console.log('Filtros limpiados');
        this.form.reset();
    }
}
class UIRender {
    static generateCustomModalContent(data) {
        let ul = document.createElement('ul');
        Object.keys(data).forEach(item => {
            const li = UIRender.generateListItem(`${item}: ${data[item]}`);
            ul.appendChild(li);
        });
        return ul;
    }
    static generateListItem(text) {
        let li = document.createElement('li');
        li.innerHTML = text;
        return li;
    }
    static generateSelectOption(value, text) {
        let option = document.createElement('option');
        option.value = value;
        option.append(document.createTextNode(text));
        return option;
    }
}
const RenderOptions = function (selectId) {
    this.form = document.getElementById(selectId);
    this.init = (options) => {
        options.forEach(item => {
            this.form.append(UIRender.generateSelectOption(item.value, item.text));
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    //
    const categories = [
        {text: 'JavaScript', value: 'js'},
        {text: 'Java', value: 'jv'},
        {text: 'Python', value: 'py'},
        {text: 'Git', value: 'git'},
        {text: 'SQL', value: 'sql'}
    ];

    new RenderOptions('category').init(categories);

    new CourseFilter('form');
});