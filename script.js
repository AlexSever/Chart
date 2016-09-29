$(document).ready(function() {
	
	localhost = {}; // our global namespace variable
	localhost.currencyHTML = ""; // currency HTML built in here
	localhost.chg_percent = []; // array of all percent changes
	localhost.currency = []; // array of all currency names
	localhost.chart1 = { yAxisMin: null, yAxisMax: null }; // this obj holds things belonging to chart1

	var apiUrl = "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json&view=basic";

	$.ajax({
	    url: apiUrl,
	    cache: true,
	    dataType: "jsonp",
	    context: localhost,
	    success: function(data) {

	    	console.log(data);

		    for (var i = 0; i < data.list.resources.length; i++) {
		    	
		    	this.currencyObj = data.list.resources[i].resource.fields;
		    	this.currencyHTML += '<br/><strong>' + this.currencyObj.name + '</strong><br/>';

		    	for (prop in this.currencyObj) {
		    		this.currencyHTML += prop + ': ' + this.currencyObj[prop] + '<br/>';
		    	};

		    	this.chg_percent.push(parseFloat(data.list.resources[i].resource.fields.chg_percent));
		    	this.currency.push(data.list.resources[i].resource.fields.name)
		    }

		    this.chart1.yAxisMax = (function(array) { // get the biggest number in currency array
		    	var number_array = [];

		    	for (var i = 0; i < array.length; i++) {
		    		if (array[i] != null) {
		    			number_array.push(array[i]);
		    		}
		    	}
		    	return Math.max.apply(Math, number_array);
		    })(this.chg_percent);

		    this.chart1.yAxisMin = (function(array) { // get the smallest number in currency array
		    	var number_array = [];

		    	for (var i = 0; i < array.length; i++) {
		    		if (array[i] !== null) {
		    			number_array.push(array[i]);
		    		}
		    	}
		    	return Math.min.apply(Math, number_array);
		    })(this.chg_percent);

		    this.chart1.data.series[0].data = this.chg_percent;
		    this.chart1.data.xAxis.categories = this.currency;

		    // alert('inside callback. series.data: ' + this.chart1.data.series[0].data);
		    // alert('inside callback. xAxis.categories: ' + this.chart1.data.xAxis.categories);
		    // alert('max currency value: ' + localhost.chart1.yAxisMin);

		    $('#currencyInfo').html(this.currencyHTML);
		    $('#container').css({ height: '3500px'});
		    chart = new Highcharts.Chart(this.chart1.data);
		    console.log(data);
		}
	});

	localhost.chart1.data = { // js single-threaded, this obj created before callback function completed
		chart: {
			renderTo: 'container',
            type: 'bar'
        },
        title: {
            text: 'Daily Currency Movers'
        },
        subtitle: {
            text: 'Source: finance.yahoo.com'
        },
        xAxis: {
            categories: null,
            title: {
                text: null
            }
        },
        yAxis: {
            min: localhost.chart1.yAxisMin, // we'll retrive min & max dynamically in callback
            max: localhost.chart1.yAxisMax,
            title: {
                text: 'Daily Percentage Change',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -1,
            y: 1,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Daily Change',
            data: null // will be assigned array value during ajax callback
        }]
	};

	// alert('xAxis.categories: ' + localhost.chart1.data.xAxis.categories);
	// alert('series.data: ' + localhost.chart1.data.series[0].data);
	// alert('max currency value: ' + localhost.chart1.yAxisMin);

});

/*
$.ajax({
    url: apiUrl,
    dataType: "jsonp",
    method: 'GET',
}).done(function(data) {
    console.log(data);
}).fail(function(err) {
    throw err;
    console.log("Current Weather cannot be loaded");
});    
*/