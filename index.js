
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
    if(inputCurrency.value && outputCurrency.value && inputEntry.value){
        updateData();
    }else if(inputCurrency.value && outputCurrency.value && outputEntry.value){
        updateData();
    }
}


inputEntry.addEventListener("blur", () => {
    checkFields();
});
outputEntry.addEventListener("blur", () => {
    checkFields();
});


//dropdown and checking fields
function inputShow(currencyName){
    document.querySelector(".input-dropdown .textBox").value = currencyName;
    checkFields();
}

function outputShow(currencyName){
    document.querySelector(".output-dropdown .textBox").value = currencyName;
    checkFields();
}

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
});
