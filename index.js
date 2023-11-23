
let inputCurrency = document.querySelector(".input-dropdown .textBox");
let outputCurrency = document.querySelector(".output-dropdown .textBox");

let inputEntry = document.querySelector(".input-entry input");
let outputEntry = document.querySelector(".output-entry input");

async function fetchData(inputCountryCode, outputCountryCode, field) {
    try {
        //for PLN currency
        if(inputCountryCode == "PLN"){
            const response2 = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${outputCountryCode}/`);
            const data2 = await response2.json();
            
            let outputCurrencyRate = data2.rates[0].mid;

            let resultValue = 1 * inputEntry.value / outputCurrencyRate;
            outputEntry.value = resultValue.toFixed(2);

        }
        else if(outputCountryCode == "PLN"){
            const response1 = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${inputCountryCode}/`);
            const data1 = await response1.json();

            let inputCurrencyRate = data1.rates[0].mid;

            let resultValue = (outputEntry.value * 1) / inputCurrencyRate;
            inputEntry.value = resultValue.toFixed(2);
        }
        //for non PLN currency
        if(inputCountryCode != "PLN" || outputCountryCode != "PLN"){
            const response1 = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${inputCountryCode}/`);
            const data1 = await response1.json();

            const response2 = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${outputCountryCode}/`);
            const data2 = await response2.json();
            
            let inputCurrencyRate = data1.rates[0].mid;
            let outputCurrencyRate = data2.rates[0].mid;
            if(field == "input"){
                let resultValue = (inputEntry.value * inputCurrencyRate) / outputCurrencyRate;
                outputEntry.value = resultValue.toFixed(2);
            }
            else if(field == "output"){
                let resultValue = (outputEntry.value * outputCurrencyRate) / inputCurrencyRate;
                inputEntry.value = resultValue.toFixed(2);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function checkFields(){
    if(inputCurrency.value && outputCurrency.value && inputEntry.value){
        fetchData(inputCurrency.value, outputCurrency.value, "input");
    }
    else if(inputCurrency.value && outputCurrency.value && outputEntry.value){
        fetchData(inputCurrency.value, outputCurrency.value, "output");
    }
}

//checking fields
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
let replaceButton = document.querySelector(".replace img");
replaceButton.addEventListener("click", () => {
    let temp = outputCurrency.value;
    outputCurrency.value = inputCurrency.value;
    inputCurrency.value = temp;
    checkFields();
});

