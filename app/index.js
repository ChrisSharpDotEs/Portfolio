const borderColors = Object.freeze({
    red: 'rgba(255, 99, 132, 1)',
    blue: 'rgba(54, 162, 235, 1)',
    green: 'rgba(75, 192, 192, 1)',
    yellow: 'rgba(255, 206, 86, 1)',
    purple: 'rgba(153, 102, 255, 1)'
});

const backgroundColors = Object.freeze(
    Object.fromEntries(Object.entries(borderColors).map(([key, value]) => [key, value.replace(' 1)', ' 0.2')]))
);

class ChartManager {
    constructor(canvasId, configs) {
        this.canvasId = canvasId;
        this.config = new ChartConfig(configs).getConfigs();
        this.chart = null;
    }

    initialize() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');
        this.chart = new Chart(ctx, this.config);
    }

    updateData(newData, newLabels) {
        if (this.chart) {
            this.chart.data.datasets[0].data = newData;
            this.chart.data.labels = newLabels;
            this.chart.update();
        }
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

class ChartConfig {
    constructor(configs) {
        this.datasets = configs.datasets;
        this.baseConfig = {
            type: configs.type,
            data: {
                labels: configs.labels,
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: configs.title
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: configs.xlabel
                        }
                    }
                }
            }
        };
        this.addDataSet(this.datasets);
        this.datasets.forEach(item => {
            this.addScale(item.id, item.label, item.scale ?? 'linear', item.position ?? 'left');
        });
    }
    getConfigs() {
        return this.baseConfig;
    }
    addDataSet() {
        this.baseConfig.data.datasets = this.datasets.map((item) => {
            return {
                label: item.label,
                data: item.data,
                borderColor: borderColors[item.color],
                backgroundColor: backgroundColors[item.color],
                yAxisID: item.id,
                tension: 0.4
            }
        });
    }
    addScale(id, label, type, position) {
        this.baseConfig.options.scales[id] = {
            type: type,
            position: position,
            grid: {
                drawOnChartArea: false
            },
            title: {
                display: true,
                text: label
            }
        };
    }
}

const urlSolicitud = 'https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/C439J/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyaWdlbGRyZWFtc0BnbWFpbC5jb20iLCJqdGkiOiI1Y2VjOGNiOC1mYjY4LTQxYmEtODcyMi03MDVkYmZmOTc4MGIiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTczNTc2NjUxOSwidXNlcklkIjoiNWNlYzhjYjgtZmI2OC00MWJhLTg3MjItNzA1ZGJmZjk3ODBiIiwicm9sZSI6IiJ9.dvm0Nq-gZZoQpfVfs8AVOFuXp06_UTIIL5DOmWtyp8U';

if (!localStorage.getItem('aemet-data')) {
    console.log('Obteniendo nuevos datos...');
    fetch(urlSolicitud)
        .then(response => response.json())
        .then(data1 => {
            console.log(data1);
            if (data1.estado == 200) {
                fetch(data1.datos)
                    .then(response => response.json())
                    .then(data2 => {
                        console.log('Datos obtenidos', data2);
                        localStorage.setItem('aemet-data', JSON.stringify(data2));
                    })
                    .catch(error => console.log(error));
            }
        })
        .catch(error => console.log(error));
} else {
    const datos_guimar = JSON.parse(localStorage.getItem('aemet-data'));
    console.log(datos_guimar);

    const datos_interes = datos_guimar.map(item => {
        return {
            fecha: item.fint.split('T')[0],
            hora: item.fint.split('T')[1].split('+')[0].replace('00:00', '00'),
            temperatura_ambiente: item.ta,
            humedad_relativa: item.hr,
            temperatura_rocio: item.tpr,
            presion: item.pres,
            viento: item.vv
        }
    });

    console.log(datos_interes);

    const configs = {
        type: 'line',
        title: "Temperatura ambiente y punto de rocío en Güímar el " + datos_interes[0].fecha,
        xlabel: 'Hora',
        labels: datos_interes.map(item => item.hora),
        datasets: [
            {
                id: 'y0',
                label: 'Punto de rocío (ºC)',
                color: 'blue',
                data: datos_interes.map(item => item.temperatura_rocio)
            },
            {
                id: 'y0',
                label: 'Temperatura (ºC)',
                color: 'red',
                data: datos_interes.map(item => item.temperatura_ambiente)
            }
        ]
    };

    const configs_humedad = {
        type: 'line',
        title: "Humedad relativa en Güímar el " + datos_interes[0].fecha,
        xlabel: 'Hora',
        labels: datos_interes.map(item => item.hora),
        datasets: [
            {
                id: 'y',
                label: 'Humedad relativa (%)',
                position: 'right',
                color: 'green',
                data: datos_interes.map(item => item.humedad_relativa)
            }
        ]
    };

    const configs_presion = {
        type: 'line',
        title: "Presión en Güímar el " + datos_interes[0].fecha,
        xlabel: 'Hora',
        labels: datos_interes.map(item => item.hora),
        datasets: [
            {
                id: 'y',
                label: 'Presion (HPa)',
                position: 'right',
                color: 'yellow',
                data: datos_interes.map(item => item.presion)
            }
        ]
    };
    const configs_viento = {
        type: 'line',
        title: "Viento en Güímar el " + datos_interes[0].fecha,
        xlabel: 'Hora',
        labels: datos_interes.map(item => item.hora),
        datasets: [
            {
                id: 'y',
                label: 'Viento (m/s)',
                position: 'right',
                color: 'purple',
                data: datos_interes.map(item => item.viento)
            }
        ]
    };

    const chartManager = new ChartManager('temperatura', configs);
    chartManager.initialize();

    const chartHumedad = new ChartManager('humedad', configs_humedad);
    chartHumedad.initialize();

    const chart_presion = new ChartManager('presion', configs_presion);
    chart_presion.initialize();

    const chart_viento = new ChartManager('viento', configs_viento);
    chart_viento.initialize();
}

