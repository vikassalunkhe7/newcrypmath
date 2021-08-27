let ICODataArray = [];
let table = $('#marketcaps-table').DataTable({
  responsive: true,
  pageLength: 100,
  processing: true,
  order: [[ 3, "desc" ]],
  /* l (Length changing), f (Filtering input), t (The Table!), i(Information), p (Pagination), r (pRocessing) */
  dom: 'rt<"marketcaps-table-bottom"ip>',
  language: tableDataLang.general,
  columns: [
    {
      responsivePriority: 7,
      title: '#',
      className: 'dt-center',
      searchable: false
    },
    { // Icon
      responsivePriority: 2,
      title: '',
      render: function ( data, type, row, meta ) {
        let imageSrc = '';
        if (coins[data] && coins[data].icon) {
          imageSrc = '/images/general/cryptocurrencies/' + coins[data].icon;
        } else {
          imageSrc = 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/' + data + '.png';
        }
        return '<div class="marketcaps-icon"><img alt="' + data + '" src="' + imageSrc + '" /></div>';
      },
      orderable: false,
      searchable: false
    },
    {
      responsivePriority: 1,
      title: tableDataLang.icoColumns.name,
      className: 'dt-left marketcaps-table-column-name',
      render: function ( data, type, row, meta ) {
        if ( type === 'filter' ) { return data.symbol + ' ' + data.name; } else if ( type === 'sort' ) { return data.symbol; } else if ( type === 'display' ) {
          let name = data.name;
          if (coins[data.symbol.toLowerCase()] && coins[data.symbol.toLowerCase()].website) {
            name = "<a rel='nofollow' href='" + coins[data.symbol.toLowerCase()].website + "'>" + data.name + '</a>';
          }
          return "<span class='marketcap-symbol'>" + data.symbol.toUpperCase() + '</span>' + "<br/><span class='marketcaps-coinname'>" + name + '</span>';
        }
        return data.symbol;
      }
    },
    {
      responsivePriority: 6,
      title: tableDataLang.icoColumns.raised,
      className: 'dt-right',
      render: function (data, type) {
        if ( type !== 'display' ) { return parseFloat(data); }
        return generateCurrencyValueHtml( Math.floor(data).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), 'USD' );
      },
      searchable: false
    },
    {
      responsivePriority: 3,
      title: tableDataLang.icoColumns.icoPrice,
      className: 'dt-right',
      render: function ( data, type, row, meta) {
        if ( type !== 'display' ) { return data; }
        return generateCurrencyValueHtml( data, 'USD' );
      },
      searchable: false
    },
    {
      responsivePriority: 4,
      title: tableDataLang.icoColumns.price,
      className: 'dt-right',
      render: function(data, type) {
        if ( type !== 'display' ) { return data; }
        return  generateCurrencyValueHtml( data, 'USD' );
      },
      searchable: false
    },
    {
      responsivePriority: 5,
      title: tableDataLang.icoColumns.gains,
      className: 'dt-right',
      render: function ( data, type, row, meta ) {
        if ( type !== 'display' ) { return parseFloat(data); }
        if ( data > 0) {
          return '<div class="marketcaps-pricechange-positive">' + data + '%&nbsp;<span class="carot-icon">▲</span></div>';
        }
        return '<div class="marketcaps-pricechange-negative">' + data + '%&nbsp;<span class="carot-icon">▼</span></div>';
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
function marketcapTableLoad() {
  table.processing( true );
  let getUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + icos.join() + '&tsyms=USD';
  ICODataArray = [];

  $.get( getUrl, function ( response ) {
      let i = 1;
      $.each(response, function (index, coin) {
        let colRank = i++;
        let colSymbol = index.toLowerCase();
        let colSpacer = null;
        let colName = {
          name: colSymbol,
          symbol: colSymbol
        }
        let colICOPrice = 'X';
        let colICORaised = 'X';
        if (coins[colSymbol]) {
          colName = {
            name: coins[colSymbol].name,
            symbol: colSymbol
          }
          colICOPrice = parseFloat(coins[colSymbol]["ico-price"]);
          colICORaised = parseFloat(coins[colSymbol]["ico-raised"]);
        }
        let colPrice = parseFloat(coin.USD);

        let colGain = (parseFloat(parseFloat(colPrice) - parseFloat(colICOPrice)) / parseFloat(colICOPrice)*100).toFixed(3);
        
        let marketcapDataRow = [colRank, colSymbol, colName, colICORaised, colICOPrice, colPrice, colGain, colSpacer];

        ICODataArray.push(marketcapDataRow);
      });
  })
    .success(function (response) {

      table.clear();
      table.rows.add( ICODataArray );
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

$('#marketcaps-pagelength-select').change(function () {
  let selected = $('#marketcaps-pagelength-select').val();
  let pageLength = parseInt(selected, 10) || 100;
  table.page.len( pageLength ).draw();
});

$(document).ready(function () {
  marketcapTableLoad();
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