class CurrencyTable{

    constructor(){
        this.dataPickerInput = document.querySelector("#dataPickerInput");
        this.url = "http://api.nbp.pl/api/exchangerates/tables/C/2022-12-08/"
        this.dataPickerInput.addEventListener("blur", () => {
            this.updateData();
        })
    }
    updateData = () => {
        let inputValue = this.dataPickerInput.value;
        let inputDate = new Date(inputValue);

        if(inputDate.getDay() === 6 || inputDate.getDay() === 7){
            console.log("Wprowadzono złą date");
        }else{
            this.url = `http://api.nbp.pl/api/exchangerates/tables/C/${inputValue}/`;
            console.log(this.url);
            this.generateTable();
        }
       
    }
    async fetchTableData() {
        
        try {
            const response = await fetch(this.url);

            if (!response.ok) {
                console.error('Błąd pobierania danych:', response.status);
                return null;
            }
            const data = await response.json();
            const rates = data[0].rates;
            return rates;

        } catch (error) {
            console.error('Wystąpił błąd:', error);
            return null;
        }
    }

    async generateTable() {
        const rates = await this.fetchTableData();

        if (!rates) {
            console.error('Brak danych.');
            return;
        }
        const tableBody = document.getElementById('tableBody');
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

}
const currencyTable =  new CurrencyTable();