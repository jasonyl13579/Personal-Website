/*** First Chart in Dashboard page ***/

	// $(document).ready(function() {
	// 	info = new Highcharts.Chart({
	// 		chart: {
	// 			renderTo: 'telegram_sentiment',
	// 			margin: [0, 0, 0, 0],
	// 			backgroundColor: null,
 //                plotBackgroundColor: 'none',
							
	// 		},
			
	// 		title: {
	// 			text: null
	// 		},

	// 		tooltip: {
	// 			formatter: function() { 
	// 				return this.point.name +': '+ this.y +' %';
	// 			} 	
	// 		},
	// 	    series: [
	// 			{
	// 			borderWidth: 2,
	// 			borderColor: '#F1F3EB',
	// 			shadow: false,	
	// 			type: 'pie',
	// 			name: 'Income',
	// 			innerSize: '65%',
	// 			data: [
	// 				{ name: 'Sentiment', y: 45.0, color: '#b2c831' },
	// 				{ name: '', y: 55.0, color: '#3d3d3d' }
	// 			],
	// 			dataLabels: {
	// 				enabled: false,
	// 				color: '#000000',
	// 				connectorColor: '#000000'
	// 			}
	// 		}]
	// 	});
		
	// });

/*** second Chart in Dashboard page ***/
	d3.dsv(",", "data/sentiment.csv", function(d) {
		// console.log(d);
		return {
		dt: new Date(d.dt),
		neg: parseFloat(d.neg),
		neu: parseFloat(d.neu),
		pos: parseFloat(d.pos),
		compound: parseFloat(d.compound),
		volume: parseFloat(d.volume)
		}
	}).then(function(sdata) {
		sentiment = sdata[0];
		
		var compound = parseInt((sentiment.compound * 100).toFixed(1));
		console.log(compound)
		$(twitter_tag).text(compound + '%');
		$(document).ready(function() {
			info = new Highcharts.Chart({
				chart: {
					renderTo: 'twitter_sentiment',
					margin: [0, 0, 0, 0],
					backgroundColor: null,
					plotBackgroundColor: 'none',
								
				},
				
				title: {
					text: null
				},
	
				tooltip: {
					formatter: function() { 
						return this.point.name +': '+ this.y +' %';
							
					} 	
				},
				series: [
					{
					borderWidth: 2,
					borderColor: '#F1F3EB',
					shadow: false,	
					type: 'pie',
					innerSize: '75%',
					data: [
						{ name: 'Sentiment', y: compound, color: '#fa1d2d' },
						{ name: '', y: 100-compound, color: '#3d3d3d' }
					],
					dataLabels: {
						enabled: false,
						color: '#000000',
						connectorColor: '#000000'
					}
				}]
			});
		});


/*** First Chart in Dashboard page ***/

	console.log('hi sebtunebt', sentiment.volume)
	var maxvolume = d3.max(sdata, function(d){return d.volume})
	var minvolume = d3.min(sdata, function(d){return d.volume})
	var vol_percent = parseInt(((sentiment.volume - minvolume)/(maxvolume - minvolume) * 100)).toFixed(1);
	vol_percent = +vol_percent
	console.log('max value', maxvolume, 'min value', minvolume, 'percentvol', vol_percent)

	$(volume_tag).text(vol_percent + '%');

	$(document).ready(function() {
		info = new Highcharts.Chart({
			chart: {
				renderTo: 'twitter_volume',
				margin: [0, 0, 0, 0],
				backgroundColor: null,
                plotBackgroundColor: 'none',
							
			},
			
			title: {
				text: null
			},

			tooltip: {
				formatter: function() { 
					return this.point.name +': '+ this.y +' %';
				} 	
			},
		    series: [
				{
				borderWidth: 2,
				borderColor: '#F1F3EB',
				shadow: false,	
				type: 'pie',
				name: 'Income',
				innerSize: '65%',
				data: [
					{ name: 'Volume', y: vol_percent, color: '#b2c831' },
					{ name: '', y: 100 - vol_percent, color: '#3d3d3d' }
				],
				dataLabels: {
					enabled: false,
					color: '#000000',
					connectorColor: '#000000'
				}
			}]
		});
		
	});




	});
		



