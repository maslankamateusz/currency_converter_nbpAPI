
let inputCurrency = document.querySelector(".input-dropdown .textBox");
let outputCurrency = document.querySelector(".output-dropdown .textBox");

let inputEntry = document.querySelector(".input-entry input");
let outputEntry = document.querySelector(".output-entry input");

async function fetchData(inputCountryCode, outputCountryCode) {
    try {
        const response1 = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${inputCountryCode}/`);
        const data1 = await response1.json();

        const response2 = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${outputCountryCode}/`);
        const data2 = await response2.json();
        
        let inputCurrencyRate = data1.rates[0].mid;
        let outputCurrencyRate = data2.rates[0].mid;
        let resultValue = (inputEntry.value * inputCurrencyRate) / outputCurrencyRate;

        outputEntry.value = resultValue.toFixed(2);

    } catch (error) {
        console.error(error);
    }
}


inputEntry.addEventListener("blur", () => {
    fetchData(inputCurrency.value, outputCurrency.value);
});


//dropdown
function inputShow(currencyName){
    document.querySelector(".input-dropdown .textBox").value = currencyName;
    fetchData(inputCurrency.value, outputCurrency.value);
}

function outputShow(currencyName){
    document.querySelector(".output-dropdown .textBox").value = currencyName;
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
    fetchData(inputCurrency.value, outputCurrency.value);
    let temp = outputCurrency.value;
    outputCurrency.value = inputCurrency.value;
    inputCurrency.value = temp;
})

