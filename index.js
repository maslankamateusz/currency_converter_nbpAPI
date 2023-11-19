let inputPln = document.querySelector("#pln"); 
let inputUsd = document.querySelector("#usd"); 
let inputBtn = document.querySelector("#btn"); 

function fetchData(countryCode, value) {
    return fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${countryCode}/`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data.rates[0].mid);
            inputUsd.value = value/data.rates[0].mid;
        })
        .catch(error => {
            console.error(error);
        });
}


inputBtn.addEventListener("click", () => fetchData("usd", inputPln.value))




