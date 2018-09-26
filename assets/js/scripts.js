(function($) {

	"use strict";

	var chart = false;

	$(document).on('click', '.filter-menu .opener', function() {
		$(this).siblings('.filter-popup').toggleClass('open');
		return false;
	});

	$(document).on('click', '.menu-collapse', function() {
		$('body').toggleClass('collapsed-menu');
		return false;
	});

	$(document).on('click', '.data-list .tick-all', function() {
		var th = $(this);
		th.closest('.data-list').find('.tick-this').prop('checked', th.prop('checked'));
	});

	$(document).on('click', '.product-cat-dropdown .dropdown-menu a', function() {
		var th = $(this);
		th.closest('.product-cat-dropdown').find('button .category').text(th.text());
	});

	$('.ghost-placeholder').on('focus', function() {
		var th = $(this);
		th.data('placeholder', th.attr('placeholder'));
		th.removeAttr('placeholder');
	}).on('blur', function() {
		var th = $(this);
		th.attr('placeholder', th.data('placeholder'));
	});

	// Tax toggle
	$(document).on('change', '#tax-toggle', function() {
		if( $(this).is(':checked') ) {
			$('.todaySales').text('57,500');
			$('.sales-title').text('Sales + Tax');
			if( chart ) {
				chart.data.datasets[0].data = [13000, 27200, 31500, 56000, 36000, 45655];
				chart.data.datasets[1].data = [12500, 15600, 2800, 9200, 800, 10500];
				chart.update();
			}
		} else {
			$('.todaySales').text('50,000');
			$('.sales-title').text('Sales');
			if( chart ) {
				chart.data.datasets[0].data = [12000, 26200, 30500, 55000, 35000, 41655];
				chart.data.datasets[1].data = [17000, 20200, 1800, 1200, 700, 950];
				chart.update();
			}
		}
	});

	function initCharts() {

		var chartContainer, chartElelemnt, context, height, width;

		chartContainer = $('.weekly-sales-chart');

		if( chartContainer.length <0 ) {
			return;
		}

		height = Math.ceil( chartContainer.outerHeight() );
		width = Math.ceil( chartContainer.outerWidth() );

		chartContainer.append('<canvas height="' + height + '" width="' + width + '"></canvas>');

		chartElelemnt = chartContainer.children('canvas').get(0);
		context = chartElelemnt.getContext('2d');

		chart = new Chart(context, {
			type: 'line',
			data: {
				labels: ["", "18 Sep", "19 Sep", "20 Sep", "21 Sep", "22 Sep"],
				datasets: [{
					label: 'Sales',
					data: [12000, 26200, 30500, 55000, 35000, 41655],
					backgroundColor: [
						'rgba(58, 175, 169, 0.35)'
					],
					borderColor: [
						'rgba(89, 165, 255, 0.85)'
					],
					borderWidth: 2
				}, {
					label: 'Costs',
					data: [1650, 2350, 1800, 1200, 700, 950],
					backgroundColor: [
						'rgba( 11, 86, 58, 0.2)'
					],
					borderColor: [
						'rgba(255,99,45,1)'
					],
					borderWidth: 2
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							callback: function(val) {
								return val/1000 + ' K'
							},
							beginAtZero: true
						}
					}]
				}
			}
		});

	}

	$(document).ready(function() {

		initCharts();

		updateClockDisplay();

		setInterval(updateClockDisplay, 1000);

	});

	// Clock
	function updateClockDisplay() {
		var text = '',
			time = new Date(),
			months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		text = leadingZero(time.getDate());
		text += ' ' + months[time.getMonth()];
		text += ' ' + leadingZero(time.getHours());
		text += ':' + leadingZero(time.getMinutes());
		text += ' (UTC' + formatUTC(time) + ')';
		$('#top-header .time .display').text(text);
	}

	function leadingZero(n) {
		return n < 10 ? '0' + n : n;
	}
	function formatUTC(date) {
		var sign = (date.getTimezoneOffset() > 0) ? '-' : '+';
		var offset = Math.abs(date.getTimezoneOffset());
		var hours = leadingZero(Math.floor(offset / 60));
		var minutes = leadingZero(offset % 60);
		return sign + hours + ':' + minutes;
	}

	// Status
	$(document).on('click', '.online-status a', function() {
		var th = $(this),
			current = th.closest('.online-status').find('button'),
			backup;
		if( current.hasClass('status-online') ) {
			// Turn to offline mode
		} else {
			// Turn to online mode
		}

		// Swap the status
		backup = current.children('span').html();
		current.toggleClass('status-online status-offline').children('span').html(th.html());
		th.toggleClass('status-online status-offline').html(backup);
		return false;
	});

	// Cart on sell page
	$(document).on('click', '.cart-root tbody .remove-product', function() {
		var th = $(this),
			tbody = th.closest('.cart-table').find('tbody');
		th.closest('tr').remove();
		if( tbody.children().length == 0 ) {
			tbody.append('<tr><td colspan="6" class="empty"></td></tr>');
		}
		update_cart();
		return false;
	});

	// Adding dummy id & price for now, should be dynamic later
	$('.product-grid .product').each(function(n) {
		$(this).attr('data-price', Math.floor((Math.random() * 100) + 50));
		$(this).attr('data-code', n);
	});

	$(document).on('click', function(e) {
		if( $(e.target).parents('.search-products').length === 0 && !$(e.target).is('.search-products') ) {
			$('.search-results-viewer').hide();
		}
	});

	$(document).on('focus', '.search-products', function() {
		$('.search-results-viewer').show();
	});

	$(document).on('keyup', '.search-products input', function() {
		var search = $(this).val().toLowerCase().trim();
		$('.search-results-viewer').removeClass('show').children('.empty').hide();
		$('.search-results-viewer').children(':not(.empty)').remove();
		if( search == '' ) {
			return;
		}
		var result = $('.product-grid .product').filter(function() {
			// add additional search criteria if needed
			var nameMatch = $(this).find('.title').text().toLowerCase().indexOf(search) > -1,
				IDmatch = $(this).attr('data-code').toLowerCase().indexOf(search) > -1;

			console.log( $(this).find('.title').text(), $(this).attr('data-code') );
			return nameMatch || IDmatch;
		});

		if( result.length > 0 ) {
			result.each(function() {
				var th = $(this);
				var html = '<a class="dropdown-item" href="#" data-code="' + th.data('code') + '">' + th.children('a').html();
				html += '<span class="price">Price: ' + th.data('price') + ' $</span>';
				html += '<span class="code">Code: ' + th.data('code') + '</span></a>';
				$('.search-results-viewer').append(html.replace('"title"', '"product-title"'));
			});
			$('.search-results-viewer').addClass('show');
		} else {
			$('.search-results-viewer').addClass('show').children('.empty').show();
		}
	});

	$(document).on('click', '.search-results-viewer a', function() {
		var th = $(this);
		add_product( $('.product-grid .product[data-code="' + th.data('code') + '"]') );
		return false;
	});

	$(document).on('click', '.product a', function() {
		var th = $(this);
		add_product( th.parent() );
		return false;
	});

	$(document).on('click', '.clear-cart', function() {
		$('.cart-table tbody').html('<tr><td colspan="6" class="empty"></td></tr>');
		update_cart();
	});

	function add_product( el ) {
		var cart = $('.cart-table tbody'),
			id = el.data('code'),
			price = el.data('price'),
			existing = cart.children('[data-id="' + id + '"]'),
			html;
		cart.find('.empty').closest('tr').remove();
		if( existing.length == 0 ) {
			html = '<tr data-id="' + id + '"><td class="remove-product"><a href="#"><i class="fa fa-times"></i></a></td>';
			html += '<td class="item-name">' + el.find('.title').text() + '</td>';
			html += '<td class="item-code">' + id + '</td>';
			html += '<td class="item-qty" data-qty="1">1</td>';
			html += '<td class="item-price">' + price + '</td>';
			html += '<td class="item-total" data-total="' + price + '">' + price + '</td>';
			cart.append(html);
		} else {
			var qty = existing.find('.item-qty').data('qty') + 1;
			existing.find('.item-qty').data('qty', qty);
			existing.find('.item-qty').text(qty);
			existing.find('.item-total').data('total', price*qty);
			existing.find('.item-total').text(price*qty);
		}
		update_cart();
	}

	function update_cart() {
		var total = 0,
			price, totalQty;

		totalQty = 0;
		$('.cart-table tbody .item-total').each(function() {
			var th = $(this);
			price = parseFloat( th.data('total') );
			th.text(format_number(price) + ' $');
			total += price;
			price = parseFloat( th.prev().text() );
			th.prev().text(format_number(price) + ' $');
			totalQty += th.siblings('.item-qty').data('qty');
		});
		$('.cart-root .total-amount').text(format_number(total) + ' $');
		$('.current-sale .number').text('(' + totalQty + ')');

		if( total == 0 ) {
			$('.pay-btn').prop('disabled', true);
		} else {
			$('.pay-btn').prop('disabled', false);
		}
	}

	// Number formater
	function format_number( num, digits ) {
		var units = [' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'],
		decimal;
		digits = typeof digits == 'undefined' ? 1 : digits;
		for( var i = units.length-1; i >= 0; i-- ) {
			decimal = Math.pow( 1000, i+1 );

			if( num <= -decimal || num >= decimal ) {
				return +(num / decimal).toFixed(digits) + units[i];
			}
		}
		return num;
	}

})(jQuery);
