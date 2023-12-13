class CurrencyChart {
    constructor() {
        this.inputDropdown = document.querySelector(".input-dropdown");
        this.inputDropdown.addEventListener("click", () => {
            this.inputDropdown.classList.toggle("active");
        });
        this.currencyName = document.querySelector(".input-dropdown input");
        this.currencyInputOption = document.querySelector(".input-option")
        this.dateFrom = document.querySelector(".dateFrom input");
        this.dateTo = document.querySelector(".dateTo input");

        this.currencyInputOption.addEventListener("click", () => {
            this.checkFields();
        });
        this.dateFrom.addEventListener("change", () => {
            this.checkFields();
        });
        this.dateTo.addEventListener("change", () => {
            this.checkFields();
        });

        this.generatedChart = null;

        this.checkFields();
    }

    checkFields() {
        const today = new Date().toISOString().split('T')[0]; 
    
        if (this.currencyName.value && this.dateFrom.value && this.dateTo.value && this.dateFrom.value <= today && this.dateTo.value <= today) {
            let url = `http://api.nbp.pl/api/exchangerates/rates/A/${this.currencyName.value}/${this.dateFrom.value}/${this.dateTo.value}`
            this.fetchData(url);
        } else {
            console.error("Podano nieprawidłowe dane.");
        }
    }
    
    async fetchData(url) {
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                console.error("Błąd pobierania danych:", response.status);
                return null;
            }
            const data = await response.json();
    
            const parseData = data.rates;
            const code = data.code;
    
            this.generateOrUpdateChart(parseData, code);
    
            return parseData;
        } catch (error) {
            console.error("Wystąpił błąd:", error);
            return null;
        }
    }
    
    generateOrUpdateChart(currencyValueData, countryCode) {
        const yValues = currencyValueData.map(currency => currency.mid);
        const xValues = currencyValueData.map(currency => currency.effectiveDate);
    
        this.calculateYAxisBounds(yValues);
    
        if (this.generatedChart !== null) {
            this.updateChart(xValues, yValues, countryCode);
        } else {
            this.generateChart(xValues, yValues, countryCode);
        }
    }
    
    generateChart(xValues, yValues, countryCode) {
        this.generatedChart = new Chart("chart", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    data: yValues,
                    borderColor: "red",
                    fill: false,
                    label: countryCode
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 0.01,
                        },
                        min: this.minYValue - 0.1,
                        max: this.maxYValue + 0.1
                    }
                }
            }
        });
    }
    
    updateChart(xValues, yValues, countryCode) {
        this.generatedChart.data.labels = xValues;
        this.generatedChart.data.datasets[0].data = yValues;
        this.generatedChart.data.datasets[0].label = countryCode;
    
        this.generatedChart.options.scales.y.min = this.minYValue - 0.1;
        this.generatedChart.options.scales.y.max = this.maxYValue + 0.1;
    
        this.generatedChart.update();
    }
    

    calculateYAxisBounds(yValues) {
        this.minYValue = Math.min(...yValues);
        this.maxYValue = Math.max(...yValues);
    }
    inputDropdownShow(currencyName){
        document.querySelector(".input-dropdown .textBox").value = currencyName;
    }
}

const currencyChart = new CurrencyChart();




