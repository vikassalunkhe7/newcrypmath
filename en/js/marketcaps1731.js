let marketcapDataArray = [];
let marketcapCurrency = '';
let table = $('#marketcaps-table').DataTable({
  responsive: true,
  pageLength: 100,
  processing: true,
  /* l (Length changing), f (Filtering input), t (The Table!), i(Information), p (Pagination), r (pRocessing) */
  dom: 'rt<"marketcaps-table-bottom"ip>',
  language: tableDataLang.general,
  columns: [
    {
      responsivePriority: 3,
      title: '#',
      className: 'dt-center',
      searchable: false
    },
    { // Icon
      responsivePriority: 2,
      title: '',
      render: function ( data, type, row, meta ) {
        let imageSrc = '';
        if (coins[data]) {
          imageSrc = '/images/general/cryptocurrencies/' + coins[data].icon;
        } else {
          imageSrc = 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/' + data + '.png';
        }
        return '<div class="marketcaps-icon"><img alt="' + data + '" src="' + imageSrc + '" /></div>';
      },
      orderable: false,
      searchable: false
    },
    { // Name
      responsivePriority: 1,
      title: tableDataLang.marketcapColumns.name,
      className: 'dt-left marketcaps-table-column-name',
      render: function ( data, type, row, meta ) {
        if ( type === 'filter' ) { return data.symbol + ' ' + data.name; } else if ( type === 'sort' ) { return data.symbol; } else if ( type === 'display' ) {
          let name = data.name;
          if (coins[data.symbol.toLowerCase()]) {
            name = "<a rel='nofollow' href='" + coins[data.symbol.toLowerCase()].website + "'>" + data.name + '</a>';
          }
          return "<span class='marketcap-symbol'>" + data.symbol + '</span>' + "<br/><span class='marketcaps-coinname'>" + name + '</span>';
        }
        return data.symbol;
      }
    },
    { // Marketcap
      responsivePriority: 6,
      title: tableDataLang.marketcapColumns.marketcap,
      className: 'dt-right',
      render: function (data) {
        return generateCurrencyValueHtml( data, marketcapCurrency );
      },
      searchable: false
    },
    { // Price
      responsivePriority: 1,
      title: tableDataLang.marketcapColumns.price,
      className: 'dt-center',
      render: function ( data, type, row, meta) {
        if ( type !== 'display' ) { return data.price; }
        let max = '';
        let bet = '';
        if ((data.extreme.usd === data.price) && ((marketcapCurrency === 'USD') || (marketcapCurrency === 'EUR'))) {
          max = '<sup><small class="marketcaps-price-max">MAX</small></sup> ';
        } else {
          let formatDate = new Date(data.extreme.date).toShortFormat();
          let currency = marketcapCurrency;
          
          if ((currency === 'BTC') || (currency === 'ETH')) {
            currency = 'USD';
          }
          max = `<div class="tooltip">
                  <sup><small>MAX</small></sup> 
                  <small class="tooltiptext">` + tableDataLang.priceColumns.maximum + `:</br>` + 
                    tableDataLang.priceColumns.date + `: ` + formatDate + `</br>` + 
                    tableDataLang.priceColumns.price + `: ` + parseFloat(data.extreme.usd).toFixed(2) + ` ` + currency + `
                  </small>
                </div> `;
          bet = ` <div class="tooltip">
                    <sub><small>BET</small></sub>
                    <small class="tooltiptext"> `+ tableDataLang.priceColumns.bet + data.bet1000 + ` ` + currency + `
                    </small>
                  </div>`;
        }
        if ( data.positiveChange > 0) {
          return '<div style="display:flex"><div class="tooltip-container">' + max + bet + '</div><span class="marketcaps-pricechange-positive">&nbsp;' + generateCurrencyValueHtml( data.price, marketcapCurrency ) + '&nbsp;<span class="carot-icon">▲</span></span></div>';
        }
        return '<div style="display:flex"><div class="tooltip-container">' + max + bet + '</div><span class="marketcaps-pricechange-negative">&nbsp;' + generateCurrencyValueHtml( data.price, marketcapCurrency ) + '&nbsp;<span class="carot-icon">▼</span></span></div>';
      },
      searchable: false
    },
    {
      responsivePriority: 9,
      title: tableDataLang.marketcapColumns.tokens,
      className: 'dt-center',
      searchable: false
    },
    {
      responsivePriority: 8,
      title: '1h (%)',
      className: 'dt-center',
      render: function ( data, type, row, meta ) {
        if ( type !== 'display' ) { return data; }
        if ( data > 0) {
          return '<div class="marketcaps-pricechange-positive">' + data + '%&nbsp;<span class="carot-icon">▲</span></div>';
        }
        return '<div class="marketcaps-pricechange-negative">' + data + '%&nbsp;<span class="carot-icon">▼</span></div>';
      },
      searchable: false
    },
    {
      responsivePriority: 2,
      title: '24h (%)',
      className: 'dt-center',
      render: function ( data, type, row, meta ) {
        if ( type !== 'display' ) { return data; }
        if ( data > 0) {
          return '<div class="marketcaps-pricechange-positive">' + data + '%&nbsp;<span class="carot-icon">▲</span></div>';
        }
        return '<div class="marketcaps-pricechange-negative">' + data + '%&nbsp;<span class="carot-icon">▼</span></div>';
      },
      searchable: false
    },
    {
      responsivePriority: 8,
      title: '7D</br>(%)',
      className: 'dt-center',
      render: function ( data, type, row, meta ) {
        if ( type !== 'display' ) { return data; }
        if (Number.isNaN(data)) {
          data = '-';
        }
        let classVariation = '';
        let carot = '';
        if ( data > 0) {
          classVariation = 'marketcaps-pricechange-positive';
          carot = '▲';
        } else if (data < 0) {
          classVariation = 'marketcaps-pricechange-negative'; 
          carot = '▼';
        }
        return '<span class="' + classVariation + '">' + data + '%&nbsp;<span class="carot-icon">' + carot + '</span></span>';
      },
      searchable: false
    },
    {
      responsivePriority: 8,
      title: '1Y</br>(%)',
      className: 'dt-center',
      render: function ( data, type, row, meta ) {
        if ( type !== 'display' ) { return data; }
        if (Number.isNaN(data)) {
          data = '-';
        }
        let classVariation = '';
        let carot = '';
        if ( data > 0) {
          classVariation = 'marketcaps-pricechange-positive';
          carot = '▲';
        } else if (data < 0) {
          classVariation = 'marketcaps-pricechange-negative'; 
          carot = '▼';
        }
        return '<span class="' + classVariation + '">' + data + '%&nbsp;<span class="carot-icon">' + carot + '</span></span>';
      },
      searchable: false
    },
    { // Spacer column
      responsivePriority: 100,
      width: '0px',
      title: '',
      orderable: false,
      className: 'marketcaps-table-column-spacer',
      searchable: false
    }
  ]
});
function marketcapTableLoad( currency ) {
  table.processing( true );
  marketcapCurrency = currency;
  let getUrl = 'https://http-api.livecoinwatch.com/coins?offset=0&limit=200&sort=rank&order=ascending&currency=' + currency
  // let getUrl = 'https://api.coinmarketcap.com/v1/ticker/?convert=' + currency + '&limit=300';
  marketcapDataArray = [];

  $('#marketcaps-currency-select').val(currency);
  $.get( getUrl, function ( response ) {
      $.each(response.data, function (index, coin) {
        let colSpacer = null;
        let priceLength = '';
        let colRank = coin.rank;
        let colIcon = coin.code.toLowerCase();
        let colName = {
          symbol: coin.code,
          name: coin.name
        };
        let marketCapString = coin.cap;
        let colMarketCap = Math.floor(marketCapString).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let colTokens = Math.floor(coin.circulating).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let priceString = coin.price;

        if ((currency !== 'USD') && (currency !== 'EUR')) {
          priceLength = 10;
        } else {
          priceLength = 2;
        }

        let colPrice = {
          price: parseFloat(priceString).toFixed(priceLength).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
          positiveChange: (parseFloat(coin.delta.second) >= 1),
          extreme: coin.extremes.all.max,
          bet1000: (1000 / parseFloat(coin.price) * parseFloat(coin.extremes.all.max.usd)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        };
        let colChange1h = (100 - parseFloat(coin.delta.hour) * 100).toFixed(1)*(-1);
        let colChange24h = (100 - parseFloat(coin.delta.day) * 100).toFixed(1)*(-1);
        let colChange7D = (100 - parseFloat(coin.delta.week) * 100).toFixed(1)*(-1);
        let colChange1Y = (100 - parseFloat(coin.delta.year) * 100).toFixed(1)*(-1);
        let marketcapDataRow = [colRank, colIcon, colName, colMarketCap, colPrice, colTokens, colChange1h, colChange24h, colChange7D, colChange1Y, colSpacer];

        marketcapDataArray.push(marketcapDataRow);
      });
  })
    .success(function (response) {

      table.clear();
      table.rows.add( marketcapDataArray );
      table.draw();
      table.columns.adjust();
      table.responsive.recalc();
    })
    .error(function(response) {
      $(".api-error").show();
    })
    .always(function () {
      table.processing( false );
    });
}

$('#marketcaps-filter-input').keyup(function () {
  table.search($(this).val()).draw();
});

$('#marketcaps-currency-select').change(function () {
  let selectedCurrency = $('#marketcaps-currency-select').val();

  if (isLocalStorageAvailable) {
    let criptomo = JSON.parse(localStorage.getItem('criptomo'));
    if (!criptomo) {
      criptomo = {};
    }
    criptomo.currency = selectedCurrency;
    localStorage.setItem('criptomo', JSON.stringify(criptomo));
  }
  marketcapTableLoad(selectedCurrency);
});

$('#marketcaps-pagelength-select').change(function () {
  let selected = $('#marketcaps-pagelength-select').val();
  let pageLength = parseInt(selected, 10) || 100;
  table.page.len( pageLength ).draw();
});

$(document).ready(function () {
  let selectedCurrency = '';
  if (isLocalStorageAvailable) {
    let criptomo = JSON.parse(localStorage.getItem('criptomo'));
    if (criptomo && criptomo.currency) {
      selectedCurrency = criptomo.currency;
    }
  }
  selectedCurrency = selectedCurrency || 'USD';
  marketcapTableLoad(selectedCurrency);
});

function generateCurrencyValueHtml( price, currency ) {
  let symbol = '';
  switch ( currency ) {
  case 'EUR':
    symbol = price + '&nbsp;€';
    break;
  case 'USD':
    symbol = '$' + price;
    break;
  default:
    symbol = price + '&nbsp;' + currency.toUpperCase();
  }
  return symbol;
}

function isLocalStorageAvailable(){
    let test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}
