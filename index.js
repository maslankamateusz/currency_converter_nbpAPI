
class CurrencyConverter{
    constructor(){
        this.inputCurrency = document.querySelector(".input-dropdown .textBox");
        this.outputCurrency = document.querySelector(".output-dropdown .textBox");
        this.inputEntry = document.querySelector(".input-entry input");
        this.outputEntry = document.querySelector(".output-entry input");
        this.inputDropdown = document.querySelector(".input-dropdown");
        this.outputDropdown = document.querySelector(".output-dropdown");
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
}

const currencyConverter = new CurrencyConverter();

/*
let inputCurrency = document.querySelector(".input-dropdown .textBox");
let outputCurrency = document.querySelector(".output-dropdown .textBox");

let inputEntry = document.querySelector(".input-entry input");
let outputEntry = document.querySelector(".output-entry input");

//fetch async func
async function fetchData(inputCountryCode){
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
//func updating fields
async function updateData() {
    let inputCurrencyRate;
    let outputCurrencyRate;
    if(inputCurrency.value == "PLN"){
        inputCurrencyRate = 1;
    }else{
        inputCurrencyRate = await fetchData(inputCurrency.value);
    }
    if(outputCurrency.value == "PLN"){
        outputCurrencyRate = 1;
    }else{
        outputCurrencyRate = await fetchData(outputCurrency.value);
    }
    if(inputEntry.value){
        let result = (inputCurrencyRate * inputEntry.value) / outputCurrencyRate;
        outputEntry.value = result.toFixed(2);
    }
    else if(outputEntry.value){
        let result = (outputCurrencyRate * outputEntry.value) / inputCurrencyRate;
        inputEntry.value = result.toFixed(2);
    }
    
}

//checking fields
function checkFields(){
    const regex = /^[0-9]{1,8}$/;
    if(inputCurrency.value && outputCurrency.value && inputEntry.value){
        if(regex.test(inputEntry.value)){
            updateData();
            inputEntry.classList.remove("error");
        }else{
            inputEntry.classList.add("error");
        }
    }else if(inputCurrency.value && outputCurrency.value && outputEntry.value){
        if(regex.test(outputEntry.value)){
            updateData();
            outputEntry.classList.remove("error");
        }else{
            outputEntry.classList.add("error");
        }
    }
}


inputEntry.addEventListener("blur", () => {
    checkFields();
});
outputEntry.addEventListener("blur", () => {
    checkFields();
});

*/
//dropdown and checking fields

function inputShow(currencyName){
    document.querySelector(".input-dropdown .textBox").value = currencyName;
    //currencyConverter.checkFields();
}

function outputShow(currencyName){
    document.querySelector(".output-dropdown .textBox").value = currencyName;
    //currencyConverter.checkFields();
}

/*
let inputDropdown = document.querySelector(".input-dropdown");
inputDropdown.onclick = function(){
    inputDropdown.classList.toggle("active");
}

let outputDropdown = document.querySelector(".output-dropdown");
outputDropdown.onclick = function(){
    outputDropdown.classList.toggle("active");
}

//replace btn
let replaceButton = document.querySelector(".replace");
replaceButton.addEventListener("click", () => {
    let temp = outputCurrency.value;
    outputCurrency.value = inputCurrency.value;
    inputCurrency.value = temp;
    checkFields();
});

//clear btn
let clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", () => {
const inputFields = document.querySelectorAll('input'); 
inputFields.forEach(input => {
    input.value = '';
});
outputEntry.classList.remove("error");
inputEntry.classList.remove("error");
});
*/