
async function fetchTableData() {
    const url = `http://api.nbp.pl/api/exchangerates/tables/C/today/`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error('Błąd pobierania danych:', response.status);
            return null;
        }
        const data = await response.json();
        const rates = data[0].rates;
        console.log(rates);
        return rates; 

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        return null;
    }
}

async function generateTable() {
    console.log("coś");
    const rates = await fetchTableData(); 

    if (!rates) {
        console.error('Brak danych.');
        return;
    }
    const tableBody = document.getElementById('tableBody');
    console.log(rates);
    rates.forEach(rate => {
        const row = document.createElement('tr');
    
        const nameCell = document.createElement('td');
        nameCell.textContent = rate.currency;
        row.appendChild(nameCell);
    
        const codeCell = document.createElement('td');
        codeCell.textContent = rate.code;
        row.appendChild(codeCell);
    
        const bidCell = document.createElement('td');
        bidCell.textContent = Number(rate.bid).toFixed(4);
        row.appendChild(bidCell);
    
        const askCell = document.createElement('td');
        askCell.textContent = Number(rate.ask).toFixed(4); 
        row.appendChild(askCell);
    
        tableBody.appendChild(row);
    });
    
}

generateTable();