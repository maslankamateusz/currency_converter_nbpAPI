class CurrencyChart {
    constructor() {
        this.initialization();
    }
    initialization(){
        this.firstInputDropdown = document.querySelector(".first-input-container .input-dropdown");
        this.secondInputDropdown = document.querySelector(".second-input-container .input-dropdown");
        this.firstCurrencyName = document.querySelector(".input-dropdown input");
        this.firstCurrencyInputOption = document.querySelector(".input-option")
        this.firstDateFrom = document.querySelector(".dateFrom input");
        this.firstDateTo = document.querySelector(".dateTo input");
        this.secondCurrencyName = document.querySelector(".second-input-container .input-dropdown input");
        this.secondCurrencyInputOption = document.querySelector(".second-input-container .input-option")
        this.secondDateFrom = document.querySelector(".second-input-container .dateFrom input");
        this.secondDateTo = document.querySelector(".second-input-container .dateTo input");
        this.chartError = document.querySelector(".chartError p");
        this.addSecondCurrencyBtn = document.querySelector(".first-input-container .next-currency-btn button");
        this.removeSecondCurrencyBtn = document.querySelector(".second-input-container .next-currency-btn button");
        this.secondCurrency = document.querySelector(".second-input-container");
        this.generatedChart = null;
        this.listeners();
        this.checkFields();
    }
    listeners(){
        this.firstInputDropdown.addEventListener("click", () => {
            this.firstInputDropdown.classList.toggle("active");
        });
        this.secondInputDropdown.addEventListener("click", () => {
            this.secondInputDropdown.classList.toggle("active");
        });
        this.firstCurrencyInputOption.addEventListener("click", () => {
            this.checkFields();
        });
        this.firstDateFrom.addEventListener("change", () => {
            this.checkFields();
        });
        this.firstDateTo.addEventListener("change", () => {
            this.checkFields();
        });
        this.secondCurrencyInputOption.addEventListener("click", () => {
            this.checkFields();
        });
        this.secondDateFrom.addEventListener("change", () => {
            this.checkFields();
        });
        this.secondDateTo.addEventListener("change", () => {
            this.checkFields();
        });
        this.addSecondCurrencyBtn.addEventListener("click", () => {
            this.addSecondCurrency();
        });
        this.removeSecondCurrencyBtn.addEventListener("click", () => {
            this.removeSecondCurrency();
        });

    }
    checkFields() {
        const today = new Date().toISOString().split('T')[0]; 
    
        if (this.firstCurrencyName.value && this.firstDateFrom.value && this.firstDateTo.value) {
    
            if (this.firstDateFrom.value <= today && this.firstDateTo.value <= today && this.firstDateFrom.value < this.firstDateTo.value) {
                let firstUrl = `http://api.nbp.pl/api/exchangerates/rates/A/${this.firstCurrencyName.value}/${this.firstDateFrom.value}/${this.firstDateTo.value}`
                this.fetchData(firstUrl);
                this.chartError.innerHTML = "&nbsp;";
            } else {
                this.chartError.innerHTML = "Wprowadzono błędne dane dla pierwszej waluty!";
            }
        }
        if (this.firstCurrencyName.value && this.firstDateFrom.value && this.firstDateTo.value && this.secondCurrencyName.value && this.secondDateFrom.value && this.secondDateTo.value)
        {
            if (this.secondCurrencyName.value && this.secondDateFrom.value && this.secondDateTo.value &&
                this.secondDateFrom.value <= today && this.secondDateTo.value <= today && this.secondDateFrom.value < this.secondDateTo.value) {
                this.chartError.innerHTML = "&nbsp;";
                let firstUrl = `http://api.nbp.pl/api/exchangerates/rates/A/${this.firstCurrencyName.value}/${this.firstDateFrom.value}/${this.firstDateTo.value}`
                let secondUrl = `http://api.nbp.pl/api/exchangerates/rates/A/${this.secondCurrencyName.value}/${this.secondDateFrom.value}/${this.secondDateTo.value}`
                
                this.fetchDoubleData(firstUrl,secondUrl);
            }else {
                this.chartError.innerHTML = "Wprowadzono błędne dane dla drugiej waluty!";
            }
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
    async fetchDoubleData(firstUrl,secondUrl) {
        try {
            const firstResponse = await fetch(firstUrl);
            const secondResponse = await fetch(secondUrl);
    
            if (!firstResponse.ok || !secondResponse.ok) {
                console.error("Błąd pobierania danych:", firstResponse.status, secondResponse.status);
                return null;
            }
            const firstData = await firstResponse.json();
            const secondData = await secondResponse.json();
    
            const parseFirstData = firstData.rates;
            const firstCode = firstData.code;

            const parseSecondData = secondData.rates;
            const secondCode = secondData.code;
    
            console.log(parseFirstData,parseSecondData);
            this.generateOrUpdateDoubleChart(parseFirstData, parseSecondData, firstCode,secondCode )

            return parseFirstData,parseSecondData ;
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
    generateOrUpdateDoubleChart(firstCurrencyValueData,secondCurrencyValueData, firstCountryCode, secondCountryCode) {
    const firstYValues = firstCurrencyValueData.map(currency => currency.mid);
    const secondYValues = secondCurrencyValueData.map(currency => currency.mid);

    const firstXValues = firstCurrencyValueData.map(currency => currency.effectiveDate);
    const secondXValues = secondCurrencyValueData.map(currency => currency.effectiveDate);

    this.calculateYAxisBounds(firstYValues, secondYValues);
    const [
        normalizedFirstXValues,
        normalizedSecondXValues,
        normalizedFirstYValues,
        normalizedSecondYValues
    ] = this.xValuesUnification(firstXValues, secondXValues, firstYValues, secondYValues);
    const combinedArray = [...new Set([...normalizedFirstXValues, ...normalizedSecondXValues])];
    const uniqueSortedArray = combinedArray.filter(value => value !== null).sort();

    this.generateDoubleChart(
        uniqueSortedArray,
        normalizedFirstYValues,
        normalizedSecondYValues,
        firstCountryCode,
        secondCountryCode
    );
        
    }
    xValuesUnification(firstXValues, secondXValues, firstYValues, secondYValues) {
        const uniqueDates = Array.from(new Set([...firstXValues, ...secondXValues]));
    const allDates = uniqueDates.sort();

    const normalizedFirstXValues = [];
    const normalizedSecondXValues = [];
    const normalizedFirstYValues = [];
    const normalizedSecondYValues = [];

    allDates.forEach(date => {
        const indexInFirst = firstXValues.indexOf(date);
        const indexInSecond = secondXValues.indexOf(date);

        if (indexInFirst !== -1 && indexInSecond !== -1) {
            normalizedFirstXValues.push(firstXValues[indexInFirst]);
            normalizedSecondXValues.push(secondXValues[indexInSecond]);

            normalizedFirstYValues.push(firstYValues[indexInFirst]);
            normalizedSecondYValues.push(secondYValues[indexInSecond]);
        } else if (indexInFirst !== -1 && indexInSecond === -1) {
            normalizedFirstXValues.push(firstXValues[indexInFirst]);
            normalizedSecondXValues.push(null);

            normalizedFirstYValues.push(firstYValues[indexInFirst]);
            normalizedSecondYValues.push(null);
        } else if (indexInFirst === -1 && indexInSecond !== -1) {
            normalizedFirstXValues.push(null);
            normalizedSecondXValues.push(secondXValues[indexInSecond]);

            normalizedFirstYValues.push(null);
            normalizedSecondYValues.push(secondYValues[indexInSecond]);
        }
    });

    return [normalizedFirstXValues, normalizedSecondXValues, normalizedFirstYValues, normalizedSecondYValues];
    }
    
    
    generateChart(xValues, yValues, firstCountryCode) {
        this.generatedChart = new Chart("chart", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    data: yValues,
                    borderColor: "red",
                    fill: false,
                    label: firstCountryCode
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
    generateDoubleChart(xValues, firstYValues,secondYValues, firstCountryCode, secondCountryCode) {
        if (this.generatedChart !== null) {
            this.generatedChart.destroy();
        }
        
        this.generatedChart = new Chart("chart", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    data: firstYValues,
                    borderColor: "red",
                    fill: false,
                    label: firstCountryCode
                },{
                    data: secondYValues,
                    borderColor: "green",
                    fill: false,
                    label: secondCountryCode
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
    

    calculateYAxisBounds(firstYValues, secondYValues) {
        if(secondYValues){
            if(Math.min(...firstYValues)<Math.min(...secondYValues)){
                this.minYValue = Math.min(...firstYValues);
            }
            else{
                this.minYValue = Math.min(...secondYValues);
            }
            if(Math.max(...firstYValues)>Math.max(...secondYValues)){
                this.maxYValue = Math.max(...firstYValues);
            }
            else{
                this.maxYValue = Math.max(...secondYValues);
            }
        }else{
            this.minYValue = Math.min(...firstYValues);
            this.maxYValue = Math.max(...firstYValues);
        }
    }
    firstInputDropdownShow(currencyName){
        document.querySelector(".first-input-container .input-dropdown .textBox").value = currencyName;
    }
    secondInputDropdownShow(currencyName){
        document.querySelector(".second-input-container .input-dropdown .textBox").value = currencyName;
    }

    addSecondCurrency(){
        this.secondCurrency.style.display = "flex";
    }
    removeSecondCurrency(){
        this.secondCurrency.style.display = "none";
    }
}

const currencyChart = new CurrencyChart();



