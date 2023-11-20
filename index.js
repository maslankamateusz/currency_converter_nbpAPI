/*
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
*/


function show(currencyName){
    document.querySelector(".input-dropdown .textBox").value = currencyName;
}
let dropdown = document.querySelector(".input-dropdown");
dropdown.onclick = function(){
    dropdown.classList.toggle("active");
}

function show2(currencyName){
    document.querySelector(".output-dropdown .textBox").value = currencyName;
}
let dropdown2 = document.querySelector(".output-dropdown");
dropdown2.onclick = function(){
    dropdown2.classList.toggle("active");
}


