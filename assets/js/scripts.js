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
				chart.data.datasets[1].data = [7502, 3350, 2800, 9200, 800, 1050];
				chart.update();
			}
		} else {
			$('.todaySales').text('50,000');
			$('.sales-title').text('Sales');
			if( chart ) {
				chart.data.datasets[0].data = [12000, 26200, 30500, 55000, 35000, 41655];
				chart.data.datasets[1].data = [6502, 2350, 1800, 1200, 700, 950];
				chart.update();
			}
		}
	});

	function initCharts() {

		var chartContainer, chartElelemnt, context, height, width;

		chartContainer = $('.weekly-sales-chart');

		if( chartContainer.length < 1 ) {
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
				labels: ["17 Sep", "18 Sep", "19 Sep", "20 Sep", "21 Sep", "22 Sep"],
				datasets: [{
					label: 'Sales',
					data: [12000, 26200, 30500, 55000, 35000, 41655],
					backgroundColor: [
						'rgba(46, 199, 85, 0.25)'
					],
					borderColor: [
						'rgba(89, 165, 255, 0.85)'
					],
					borderWidth: 2
				}, {
					label: 'Costs',
					data: [1650, 2350, 1800, 1200, 700, 950],
					backgroundColor: [
						'rgba(255, 99, 45, 0.2)'
					],
					borderColor: [
						'rgba(255,99,45,1)'
					],
					borderWidth: 1
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

})(jQuery);