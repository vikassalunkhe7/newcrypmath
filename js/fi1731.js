function updateSavingsRatio() {
	document.getElementById("savings-ratio-text").innerHTML = document.getElementById("fi-savings-ratio").value;
	document.getElementById("savings-ratio-yearly-text").innerHTML = document.getElementById("fi-salary").value * document.getElementById("fi-savings-ratio").value / 100 + " " + document.getElementById("fi-fiat").value;
	document.querySelector(".active").classList.remove("active");
	document.querySelector(".savings-" + document.getElementById("fi-savings-ratio").value).classList.add("active");
}

function updateReturnsRatio() {
	document.getElementById("returns-ratio-text").innerHTML = document.getElementById("fi-investment-returns").value;
}

function updateMonthlyRevenue() {
	document.getElementById("monthly-salary-text").innerHTML = parseInt(document.getElementById("fi-salary").value / 12);
	document.getElementById("savings-ratio-yearly-text").innerHTML = document.getElementById("fi-salary").value * document.getElementById("fi-savings-ratio").value / 100 + " " + document.getElementById("fi-fiat").value;
}
function updateCurrency() {
	var currencyTexts = document.getElementsByClassName("currency-text");
	for (var i = 0; i < currencyTexts.length; i++) {
   		currencyTexts[i].innerHTML = document.getElementById("fi-fiat").value;
	}
}
function updateFIMethod() {
	let element = document.getElementById("fi-method");
	if (element.checked) {
		document.getElementById("fi-desired-networth").disabled = true;
		document.getElementById("fi-yearly-spending").disabled = false;
		document.getElementById("fi-swr").disabled = false;
	} else {
		document.getElementById("fi-desired-networth").disabled = false;
		document.getElementById("fi-yearly-spending").disabled = true;
		document.getElementById("fi-swr").disabled = true;
	}	
}
function updateYearlySpending(yearlySpending) {
	document.querySelector("#monthly-income-text").innerHTML = parseFloat(parseInt(yearlySpending.value) / 12).toFixed(2);
}
function updateDesiredNetworth() {
	let swr = document.getElementById("fi-swr").value;
	let yearlySpending = document.getElementById("fi-yearly-spending");
	yearlySpending.value = parseInt(document.getElementById("fi-desired-networth").value) * parseInt(swr) / 100;
	updateYearlySpending(yearlySpending);
	calculateFI();
}
function updateSWR () {
	let yearlySpending = document.getElementById("fi-yearly-spending");
	updateYearlySpending(yearlySpending);
	let swr = document.getElementById("fi-swr");
	if (!yearlySpending.value) {
		yearlySpending.classList.add("input-error");
		yearlySpending.parentElement.children[1].classList.add('input-error');
	} else {
		yearlySpending.classList.remove("input-error")
		yearlySpending.parentElement.children[1].classList.remove('input-error');
	}
	if (!swr.value) {
		swr.classList.add("input-error");
		swr.parentElement.children[1].classList.add('input-error');
	} else {
		swr.classList.remove("input-error")
		swr.parentElement.children[1].classList.remove('input-error');
	}
	if (yearlySpending.value && swr.value) {
		document.getElementById("fi-desired-networth").value = parseFloat(parseInt(yearlySpending.value) * 100 / parseInt(swr.value)).toFixed(2);
		calculateFI();
	}

}
function calculateFI() {

	let investment = {
			yearlyReturns: parseFloat(document.getElementById("fi-investment-returns").value).toFixed(2),
			MonthlyQuantity: parseInt(document.getElementById("fi-salary").value) || 0,
			SavingsRatio: document.getElementById("fi-savings-ratio").value,
			currency: document.getElementById("fi-fiat").value,
			age: parseInt(document.getElementById("fi-age").value) || '',
			savings: parseInt(document.getElementById("fi-accumulated").value || 0),
			desiredNetWorth: parseInt(document.getElementById("fi-desired-networth").value) || '',
		}
	var x = document.getElementsByClassName("input-error");
	while(x.length > 0) {
   		x[0].classList.remove('input-error');  
	}
	if (investment.savings === '') {
		document.getElementById("fi-accumulated").classList.add("input-error")
	} else if (investment.MonthlyQuantity === '') {
		document.getElementById("fi-salary").classList.add("input-error")
	} else if (investment.desiredNetWorth === '') {
		let desiredNetWorth = document.getElementById("fi-desired-networth");
		desiredNetWorth.classList.add("input-error");
		desiredNetWorth.parentElement.children[1].classList.add('input-error');;

	} else {
		var table = document.querySelector("#fi-results-table table tbody");
		table.innerHTML = '';
		var x = 0;
		while (x <= 100) {
			var currentNetworth = investment.savings || 0;
			var yearlySaved = parseInt(investment.MonthlyQuantity * x / 100);
			var yearsToRetire = 0;

			var row = table.insertRow(table.rows.length);
			row.classList.add('savings-' + x);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);

			if (currentNetworth === 0 && yearlySaved === 0) {
				yearsToRetire = null;
			}
			else {
				while (currentNetworth < investment.desiredNetWorth) {
					currentNetworth = (currentNetworth + (currentNetworth * investment.yearlyReturns / 100)) + yearlySaved;
					yearsToRetire++;
				}
			}
			cell1.innerHTML = x +'%';
			cell2.innerHTML = parseFloat(investment.MonthlyQuantity - (yearlySaved)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' ' + '<span class="currency-text">' + investment.currency + '</span>';
			cell3.innerHTML = parseFloat(yearlySaved).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' ' + '<span class="currency-text">' + investment.currency + '</span>';
			cell4.innerHTML = yearsToRetire || '-';
			cell5.innerHTML = investment.age && yearsToRetire ? investment.age + yearsToRetire : '-';

			if (x === parseInt(investment.SavingsRatio)) {
				row.classList.add('active');
			}
			x = x + 5;
		}
	}
	
}
calculateFI();