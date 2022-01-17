	// LINE AND BARS CHARTS

$(function () {
  
  function generateNumber(min, max) {
    min = typeof min !== 'undefined' ? min : 1;
    max = typeof max !== 'undefined' ? max : 100;
    
    return Math.floor((Math.random() * max) + min);
  }
  
  var i = 1;
  
  $(document).ready(function() {
      d3.dsv(",", "data/sentiment.csv", function(d) {
        return {
          dt: new Date(d.dt),
          neg: parseFloat(d.neg),
          neu: parseFloat(d.neu),
          pos: parseFloat(d.pos),
          compound: parseFloat(d.compound),
          volume: parseInt(d.volume)
        }
    }).then(function(sdata) {
        sdata.reverse();
      d3.dsv(",", "data/onchain.csv", function(d) {
        // console.log(d);
        return {
          dt: new Date(d.dt),
          hash: d.block_hash,
          interval: (+d.block_interval).toFixed(4),
          pending_tx_count: d.pending_tx_count,
          day_tx_count: d.day_tx_count,
          avg_tx_per_block: (+d.avg_tx_per_block).toFixed(4),
          hashrate: d.block_height,
          block_height: d.hashrate
        }
        }).then(function(odata) {
          odata.reverse();
          d3.dsv(",", "data/financial.csv", function(d) {
          // console.log(d);
          return {
              dt: new Date(d.dt),
              open: parseFloat(d.open),
              high: parseFloat(d.high),
              low: parseFloat(d.low),
              close: parseFloat(d.close).toFixed(3),
              volume: parseFloat(d.volume).toFixed(3)
          }
          }).then(function(fdata) {
            var chart,
            categories = ['Categorie 1', 'Categorie 2', 'Categorie 3', 'Categorie 4', 'Categorie 5','Categorie 6', 'Categorie 7', 'Categorie 8', 'Categorie 9', 'Categorie 10', 'Categorie 11', 'Categorie 12', 'Categorie 13', 'Categorie 14', 'Categorie 15', 'Categorie 16', 'Categorie 17', 'Categorie 18', 'Categorie 19','Categorie 20', 'Categorie 21','Categorie 22', 'Categorie 23', 'Categorie 24', 'Categorie 25', 'Categorie 26', 'Categorie 27', 'Categorie 28', 'Categorie 29', 'Categorie 30'],
            serie1 = [],
            serie2 = [],
            $aapls;

            financial = fdata
            financial.reverse();
            var min = d3.min(financial, function(d){return d.close});
            var serie = financial.slice(1, 21);

            serie.forEach(
              function(d){
                serie1.push(d.close-min+10);
                serie2.push(d.volume*100);
              }
            );
            console.log(serie1, serie2, min)
            var addseries = financial.slice(22);

            chart = new Highcharts.Chart({
              chart: {
                renderTo: 'btcpricechart',
                type: 'column',
                backgroundColor: 'transparent',
                height: 140,
                marginLeft: 3,
                marginRight: 3,
                marginBottom: 0,
                marginTop: 0
              },
              title: {
                text: ''
              },
              xAxis: {
                lineWidth: 0,
                tickWidth: 0,
                labels: { 
                  enabled: false 
                },
                categories: categories
              },
              yAxis: {
                labels: { 
                  enabled: false 
                },
                gridLineWidth: 0,
                title: {
                  text: null,
                },
              },
              series: [{
                name: 'Awesomness',
                data: serie1
              }, {
                name: 'More Awesomness',
                color: '#fff',
                type: 'line',
                data: serie2
              }],
              credits: { 
                enabled: false 
              },
              legend: { 
                enabled: false 
              },
              plotOptions: {
                column: {
                  borderWidth: 0,
                  color: '#b2c831',
                  shadow: false
                },
                line: {
                  marker: { 
                    enabled: false 
                  },
                  lineWidth: 3
                }
              },
              tooltip: { 
                enabled: false
              }
            });
              
            setInterval(function() {
              chart.series[0].addPoint(addseries[i].close-min+10, true, true);
              chart.series[1].addPoint(addseries[i].volume*1000, true, true);
              i += 1;
              $(".graph-info-big").text(addseries[i].close);
              $(".graph-info-small").text((addseries[i].close-addseries[i-1].close).toFixed(3));
              if (addseries[i].close-addseries[i-1].close > 0){
                $("#btc_price_arrow").attr("src", "assets/img/up.png");
              } else{
                $("#btc_price_arrow").attr("src", "assets/img/down.png");
              }
              var blockinfo_html = "<p>Block height | " + odata[i].block_height + "</p><br>";
              blockinfo_html += ("<p>Hash rate | " + odata[i].hashrate + "</p><br>");
              blockinfo_html += ("<p>Transaction | <ok>" + odata[i].day_tx_count + "</p><br>");
              blockinfo_html += ("<p>Pending Transaction | <bad>" + odata[i].pending_tx_count + "</p><br>");
              $("#block_info").html(blockinfo_html);

              var blockstats_html = "<p>Block Closing Price | " + addseries[i].close + "</p><br>";
              blockstats_html += ("<p>Trading Volume | <ok>" + odata[i].avg_tx_per_block + "</p><br>");
              blockstats_html += ("<p>Sentiment Volume | " + sdata[i].volume + "</p><br>");
              $("#block_stats").html(blockstats_html);
            
              $("#server_time").html(generateNumber(100, 300) + "ms.");
              
            }, 1000);
            
            
            
          
            setInterval(function() {
              $('.info-aapl span').each(function(index, elem) {
                $(elem).animate({
                  height: generateNumber(1, 40)
                });
              });

            }, 3000);
          });
        });
      });
    });
});
