let investment = {};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function calculateEarnings() {

  table.processing(true);
  investment = {
      date: $('#invest-date').val(),
      amount: parseInt($('#invest-quantity').val()),
      tokenSymbol: $('#invest-currency').val(),
      tokenName: $('#invest-currency option:selected' ).text(),
      selectedInterval: parseInt($('#invest-interval').val()),
      fiat: $('#invest-fiat').val(),
      today: new Date().toISOString()
  };

  $.get('https://api.coindesk.com/v1/bpi/historical/close.json?start=' + investment.date + '&end=' + investment.today.split('T')[0] + '&currency=' + investment.fiat)
    .success(function (data) {
      data = JSON.parse(data);

      let investmentDataArray = [];
      let date = new Date(investment.date);
      let dateFormatted =  date.toISOString().split('T')[0];
      let results = [];

      results[0] = {
          totalCC: parseFloat(investment.amount / data.bpi[dateFormatted]).toFixed(6),
          totalSpent: investment.amount,
          date: dateFormatted,
          purchasePrice: data.bpi[dateFormatted]
      };

      results[0].investmentValue = parseFloat(results[0].totalCC * data.bpi[dateFormatted]).toFixed(2);

      date = date.addDays(investment.selectedInterval);
      dateFormatted =  date.toISOString().split('T')[0];

      investmentDataArray.push(results[0]);

      for (let i = 1; date.toISOString() < investment.today; i++)
      {
          let currentPrice = data.bpi[dateFormatted];
          if (currentPrice) {
            results[i] = {};
            results[i].totalCC = parseFloat(parseFloat(results[i - 1].totalCC) + parseFloat(investment.amount / currentPrice)).toFixed(6);
            results[i].totalSpent = parseInt(results[i - 1].totalSpent) + investment.amount;
            results[i].investmentValue = parseFloat(results[i].totalCC * currentPrice).toFixed(2);
            results[i].purchasePrice = currentPrice;
            results[i].date = dateFormatted;

            investmentDataArray.push(results[i]);
          }

          date = date.addDays(investment.selectedInterval);
          dateFormatted =  date.toISOString().split('T')[0];
      }

      $.get('https://min-api.cryptocompare.com/data/price?fsym=' + investment.tokenSymbol + '&tsyms=' + investment.fiat)
        .success(function (data) {

          results.currentInvestment = {
            investmentValue: parseFloat(data[investment.fiat] * results[results.length - 1].totalCC).toFixed(2),
            totalSpent: results[results.length - 1].totalSpent,
            totalCC: results[results.length - 1].totalCC,
            purchasePrice: data[investment.fiat],
            date: investment.today
          }
          investmentDataArray.push(results.currentInvestment);

          $('#result-tokencount').html(results[results.length - 1].totalCC.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
          $('#result-tokentype').html(investment.tokenSymbol);
          $('#result-fiat').html(investment.fiat);
          $('#result-currentvalue').html(results.currentInvestment.investmentValue.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
          $('#calculator-results').show();

          table.clear();
          table.rows.add( investmentDataArray );
          table.draw();
          table.columns.adjust();
          table.responsive.recalc();
          
        })
        .error(function () {
        handleError('date');
      })
      .always(function () {
        table.processing( false );
      });
    })
    .error(function () {
      handleError('date');
      table.processing( false );
    })
    .always(function () {
      table.processing( false );
    });
}
 
let table = $('#investment-table').DataTable({
  responsive: true,
  pageLength: 100,
  processing: true,
  language: tableDataLang.general,
  columns: [
    { 
      responsivePriority: 1,
      data:  'date',
      title: tableDataLang.investmentColumns.date,
      render: function (data, type, row) {
        if ((data === investment.today) && (type === 'display')) {
          return '<div class="highlighted-row">' + tableDataLang.global.today + '</div>';
        }
        return '<small>' + data + '</small>';
      },
    },
    {
      responsivePriority: 4,
      data:  'totalSpent',
      title: tableDataLang.investmentColumns.totalSpent,
      render: function (data, type) {
        if ( type !== 'display' ) { return data; }
        return data.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' ' + '<small>' + investment.fiat + '</small>';
      },
    },
    {
      responsivePriority: 3,
      data:  'totalCC',
      title: tableDataLang.investmentColumns.totalCC,
      render: function (data, type) {
        if ( type !== 'display' ) { return data; }
        return data.replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' ' + '<small>' + investment.tokenSymbol + '</small>';
      },
    },
    {
      responsivePriority: 5,
      data:  'purchasePrice',
      title: tableDataLang.investmentColumns.purchasePrice,
      render: function (data, type) {
        if ( type !== 'display' ) { return data; }
        return parseFloat(data).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' ' + '<small>' + investment.fiat + '/' + investment.tokenSymbol + '</small>';
      },
    },
    {
      responsivePriority: 2,
      data:  'investmentValue',
      title: tableDataLang.investmentColumns.investmentValue,
      render: function (data, type) {
        if ( type !== 'display' ) { return data; }
        return data.replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' ' + '<small>' + investment.fiat + '</small>';
      },
    }
  ]
});
