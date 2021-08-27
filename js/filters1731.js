var $grid = $('.grid').isotope({
  itemSelector: '.item',
  layoutMode: 'fitRows',
  getSortData: {
    name: '.name',
    symbol: '.symbol',
    number: '.number parseInt',
    category: '[data-category]',
    weight: function (itemElem) {
      var weight = $(itemElem).find('.weight').text();
      return parseFloat(weight.replace( /[\(\)]/g, ''));
    }
  }
});

// category filter button click
$('#filters').on('click', 'a', function () {
  let filterValue = $(this).attr('data-filter');
  $('#cryptocurrencies-filter-input').val('');
  $grid.isotope({ filter: filterValue });
  document.querySelector('.grid').scrollIntoView({behavior: 'smooth' });
});

// search input filter
$('#cryptocurrencies-filter-input').keyup(function () {
  let filter = $('.filter-active').attr('data-filter').replace('.', '');
  $grid.isotope({
    // filter element that match search input
    filter: function () {
      // _this_ is the item element.
      if (($(this).hasClass(filter)) || (filter === '*') ) {
        let name = $(this).find('.coinlist-name').text().toUpperCase();
        // return true to show, false to hide
        let searchedWord = $('#cryptocurrencies-filter-input').val().toUpperCase();
        return name.includes(searchedWord);
      }
      return false;
    }
  });
});

// add active class when clicking on filter
var setActiveFilter = function (element) {
  $('.filter-active').removeClass('filter-active');
  $(element).addClass('filter-active');
};
