// enable/disable dropdown with custom option
document.querySelector('#invest-currency').addEventListener('change', function() {
  var selected = document.querySelector('#invest-currency').selectedOptions[0].classList.value;

  if (selected === 'editable') {
    document.querySelector('.calculator-othercoins').style.display = 'inline-block';
    document.querySelector('div.calculator-othercoins').style.display = 'inline';

    document.querySelector('.calculator-othercoins').addEventListener('keyup', function() {
      let editText = document.querySelector('.calculator-othercoins').value;
      document.querySelector('.editable').value = editText;
      document.querySelector('.calculator-othercoins').focus()
    });
  } else {
    document.querySelector('.calculator-othercoins').style.display = 'none';
    document.querySelector('.calculator-othercoins').value = '';
    document.querySelector('div.calculator-othercoins').style.display = 'none';
  }
});


// handle errors and apply red colors
function handleError(type) {
  if (type === 'currency') {
    document.querySelector('.calculator-othercoins').classList.add('input-error');
    document.querySelector('.coin-error').style.display = 'block';
  } else {
    document.querySelector('#invest-date').classList.add('input-error');
    document.querySelector('.date-error').style.display = 'block';
  }
  document.querySelector('#calculator-results').style.display = 'none';
  
}

// update minimum data selectable
function updateInputMinDate() {
  let min = document.querySelector('#invest-currency').selectedOptions[0].attributes.min;
  let minDate = '';
  if (min) {
    minDate = min.value;
  }
  let investDate = document.querySelector('#invest-date');
  investDate.attributes.min.value = minDate;
  if (investDate.value < minDate) {
    investDate.value = minDate;
  }
}