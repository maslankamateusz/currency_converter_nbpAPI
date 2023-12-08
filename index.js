class CurrencyConverter{
    constructor(){
        this.inputCurrency = document.querySelector(".input-dropdown .textBox");
        this.outputCurrency = document.querySelector(".output-dropdown .textBox");
        this.inputEntry = document.querySelector(".input-entry input");
        this.outputEntry = document.querySelector(".output-entry input");
        this.inputDropdown = document.querySelector(".input-dropdown");
        this.outputDropdown = document.querySelector(".output-dropdown");
        this.replaceButton = document.querySelector(".replace");
        this.clearButton = document.querySelector(".clear");
        this.inputFields = document.querySelectorAll('input'); 

        this.inputEntry.addEventListener("blur", () => {
            this.checkFields();
        });
        this.outputEntry.addEventListener("blur", () => {
            this.checkFields();
        });
        this.inputDropdown.addEventListener("click", () => {
            this.inputDropdown.classList.toggle("active");
        });
        this.outputDropdown.addEventListener("click", () => {
            this.outputDropdown.classList.toggle("active");
        });
        this.replaceButton.addEventListener("click", this.replaceCurrencies)
        this.clearButton.addEventListener("click", this.clearFields)
    };
    
    checkFields = () => {
        const regex = /^[0-9]{1,8}$/;
        if(this.inputCurrency.value && this.outputCurrency.value && this.inputEntry.value){
            if(regex.test(this.inputEntry.value)){
                this.updateData();
                this.inputEntry.classList.remove("error");
            }else{
                this.inputEntry.classList.add("error");
            }
        }else if(this.inputCurrency.value && this.outputCurrency.value && this.outputEntry.value){
            if(regex.test(this.outputEntry.value)){
                this.updateData();
                this.outputEntry.classList.remove("error");
            }else{
                this.outputEntry.classList.add("error");
            }
        }
    }
    updateData = async () => {
        this.inputCurrencyRate;
        this.outputCurrencyRate;
        if(this.inputCurrency.value == "PLN"){
            this.inputCurrencyRate = 1;
        }else{
            this.inputCurrencyRate = await this.fetchData(this.inputCurrency.value);
        }
        if(this.outputCurrency.value == "PLN"){
            this.outputCurrencyRate = 1;
        }else{
            this.outputCurrencyRate = await this.fetchData(this.outputCurrency.value);
        }
        if(this.inputEntry.value){
            let result = (this.inputCurrencyRate * this.inputEntry.value) / this.outputCurrencyRate;
            this.outputEntry.value = result.toFixed(2);
        }
        else if(this.outputEntry.value){
            let result = (this.outputCurrencyRate * this.outputEntry.value) / this.inputCurrencyRate;
            this.inputEntry.value = result.toFixed(2);
        }
    }
    fetchData = async (inputCountryCode) =>{
        const url = `http://api.nbp.pl/api/exchangerates/rates/a/${inputCountryCode}/`;
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                console.error('Błąd pobierania danych:', response.status);
                return null;
            }
            const data = await response.json();
            const parseData = data.rates[0].mid;
            return parseData;
        } catch (error) {
            console.error('Wystąpił błąd:', error);
            return null; 
        }
    } 
    inputDropdownShow = (currencyName) => {
        document.querySelector(".input-dropdown .textBox").value = currencyName;
        this.checkFields();
    };
    outputDropdownShow = (currencyName) => {
        document.querySelector(".output-dropdown .textBox").value = currencyName;
        this.checkFields();
    };
    replaceCurrencies = () => {
        let temp = this.outputCurrency.value;
        this.outputCurrency.value = this.inputCurrency.value;
        this.inputCurrency.value = temp;
        this.checkFields();
    };
    clearFields = () => {
        this.inputFields.forEach(input => {
            input.value = '';
        });
        this.outputEntry.classList.remove("error");
        this.inputEntry.classList.remove("error");
    };

}

const currencyConverter = new CurrencyConverter();
