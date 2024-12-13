class CourseFilter {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.filters = ['courseName', 'category'];
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
        let result = {};
        this.filters.forEach(item => {
            if(item == 'courseName') {
                result[item] = this.form.querySelector(`#${item}`).value.trim()
            } else {
                result[item] = this.form.querySelector(`#${item}`).value
            }
        });
        console.log(result);
        return result;
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
    console.log('loaded')
    const categories = [
        {text: 'JavaScript', value: 'js'},
        {text: 'Java', value: 'jv'},
        {text: 'Python', value: 'py'},
        {text: 'Git', value: 'git'},
        {text: 'SQL', value: 'sql'}
    ];

    new RenderOptions('category').init(categories);

    const courseFilter = new CourseFilter('form');
    courseFilter.init();
});