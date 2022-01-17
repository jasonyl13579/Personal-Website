


function customSplit(str, maxLength){
    if(str.length <= maxLength)
        return str;
    var reg = new RegExp(".{1," + maxLength + "}","g");
    var parts = str.match(reg);
    return parts.join('\n');
}

function avgarray(arr) {
    if (!arr.length) {
    return 0
    }
    acc = 0
    arr.forEach(d => {
    acc += d
    })
    avg = acc/(arr.length)
    return avg.toFixed(4)
}

function sumarray(arr) {
    if (!arr.length) {
    return 0
    }
    acc = 0
    arr.forEach(d => {
    acc += d
    })
    return acc.toFixed(4)
}

var collected = {}
var onchain = null
var sentiment = null
var financial = null

var margin = {top: 20, bottom: 20, left: 20, right: 20},
    width = 320 - margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;

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
    // console.log(data);
    onchain = odata
    for (i=odata.length-1; i>0; i--) {
        collected[odata[i].dt] = {
        start: odata[i].dt, 
        end: odata[i-1].dt,
        dt: odata[i].dt,
        hash: odata[i].hash,
        interval: odata[i].interval,
        pending_tx_count: odata[i].pending_tx_count,
        day_tx_count: odata[i].day_tx_count,
        avg_tx_per_block: Math.round(odata[i].avg_tx_per_block),
        hashrate: odata[i].hashrate,
        block_height: odata[i].block_height,
        neg: [],
        negavg: 0,
        neu: [],
        neuavg: 0,
        pos: [],
        posavg: 0,
        compound: [],
        compoundavg: 0,
        svolume: [],
        svolumeavg: 0,
        open: [],
        openavg: 0,
        high: [],
        highavg: 0,
        low: [],
        lowavg: 0,
        close: [],
        closeavg: 0,
        fvolume: [],
        fvolumeavg: 0,
        
        }
    }
    // console.log(collected)

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
        sentiment = sdata

        for (let k in collected) {
        st = collected[k].start
        et = collected[k].end
        sdata.forEach(s => {
            if (s.dt >= st && s.dt < et) {
            collected[k].neg.push(s.neg);
            collected[k].neu.push(s.neu);
            collected[k].pos.push(s.pos);
            collected[k].compound.push(s.compound);
            collected[k].svolume.push(s.volume);
            }
        })
        }

        var prevk = Object.keys(collected)[0]
        for (let k in collected) {
        cmpavg = avgarray(collected[k].compound)
        prevcompavg = collected[prevk].compoundavg
        collected[k]['compoundavg'] = (cmpavg ? cmpavg : prevcompavg)
        posavg = avgarray(collected[k].pos)
        prevposavg = collected[prevk].posavg
        collected[k]['posavg'] = (posavg ? posavg : prevposavg)
        negavg = avgarray(collected[k].neg)
        prevnegavg = collected[prevk].negavg
        collected[k]['negavg'] = (negavg ? negavg : prevnegavg)
        neuavg = avgarray(collected[k].neu)
        prevneuavg = collected[prevk].neuavg
        collected[k]['neuavg'] = (neuavg ? neuavg : prevneuavg)
        svolumeavg = sumarray(collected[k].svolume)
        prevsvolumenavg = collected[prevk].svolumeavg
        collected[k]['svolumeavg'] = (svolumeavg ? svolumeavg : prevsvolumenavg)
        collected[k]['svolumeavg'] = parseInt(collected[k]['svolumeavg'])
        prevk = k
        }
        
        d3.dsv(",", "data/financial.csv", function(d) {
        // console.log(d);
        return {
            dt: new Date(d.dt),
            open: parseFloat(d.open),
            high: parseFloat(d.high),
            low: parseFloat(d.low),
            close: parseFloat(d.close),
            volume: parseFloat(d.volume)
        }
        }).then(function(fdata) {
            financial = fdata

            for (let k in collected) {
                st = collected[k].start
                et = collected[k].end
                fdata.forEach(s => {
                if (s.dt >= st && s.dt < et) {
                    collected[k].open.push(s.open);
                    collected[k].high.push(s.high);
                    collected[k].low.push(s.low);
                    collected[k].close.push(s.close);
                    collected[k].fvolume.push(s.volume);
                }
                })
            }

            var prevk = Object.keys(collected)[0]
            for (let k in collected) {
                openavg = avgarray(collected[k].open)
                prevopenavg = (collected[prevk].openavg)
                collected[k]['openavg'] = (openavg ? openavg : prevopenavg)
                highavg = avgarray(collected[k].high)
                prevhighavg = collected[prevk].highavg
                collected[k]['highavg'] = (highavg ? highavg : prevhighavg)
                lowavg = avgarray(collected[k].low)
                prevlowavg = collected[prevk].lowavg
                collected[k]['lowavg'] = (lowavg ? lowavg : prevlowavg)
                closeavg = avgarray(collected[k].close)
                prevcloseavg = collected[prevk].closeavg
                collected[k]['closeavg'] = (closeavg ? closeavg : prevcloseavg)
                fvolumeavg = sumarray(collected[k].fvolume)
                prevfvolumeavg = collected[prevk].fvolumeavg
                collected[k]['fvolumeavg'] = (fvolumeavg ? fvolumeavg : prevfvolumeavg)
                prevk = k
            }
            
            var indexmap = {}
            var counter = 0
            for (let k in collected) {
                indexmap[counter] = k;
                counter++;
            }
            // console.log(indexmap)

            // vis goes in here so all data accessible
            for (let k in collected) {
                elem = collected[k]
                // console.log(elem)
                $('#swiper-w')
                    .append('<div class="swiper-slide">Hash: \n'+ customSplit(elem.hash, 20) + '</div>')
            };
            
            // Initialize Swiper 
            var swiper = new Swiper(".mySwiper", {
                slidesPerView: 4,
                spaceBetween: 30,
                centeredSlides: true,
                initialSlide: Object.keys(collected).length,
                pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 10
                }, 
                mousewheel: {
                releaseOnEdges: true,
                sensitivity: 20
                }              
            });

            svg_init()
            maxbarwidth = 200; 

            if (true) {
                idx = Object.keys(collected).length - 1
                elem = collected[indexmap[idx]];
                setBlockInfo(elem);
                
            }

            swiper.on("activeIndexChange", function(s){
                idx = s.realIndex
                elem = collected[indexmap[idx]];
                setBlockInfo(elem);      
            })
        });
    });
});

function add_tooltip(){
    var tooltip = d3.select("html")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden");

    d3.selectAll('#pos_title,#pos_val')
        .on("mouseover", function() {
            tooltip.text("score from 0-1 representing words, phrases, and sentences with a positive connotation")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#neg_title,#neg_val")
        .on("mouseover", function() {
            tooltip.text("score from 0-1 representing words, phrases, and sentences with a negative connotation")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });
    
    d3.selectAll("#neu_title,#neu_val")
        .on("mouseover", function() {
            tooltip.text("score from 0-1 representing words, phrases, and sentences with a neutral connotation")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#comp_title,#comp_val")
        .on("mouseover", function() {
            tooltip.text("a collective weighted score of positive, negative, and neutral sentiment from -1 to 1")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#sent_vol_title,#sent_text")
        .on("mouseover", function() {
            tooltip.text("the number of tweets streamed and analyzed per block")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#interval_title,#interval_text")
        .on("mouseover", function() {
        tooltip.text("the time taken to mine this block")
        .style("visibility", "visible")
        })
        .on("mousemove", function() {
        tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
        tooltip.style("visibility", "hidden")
        });

    d3.selectAll("#pendingt_title,#pendingt_text")
        .on("mouseover", function() {
        tooltip.text("the number of pending transactions in the mempool")
        .style("visibility", "visible")
        })
        .on("mousemove", function() {
        tooltip.text("the number of pending transactions in the mempool")          
        .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        .style("visibility", "visible");
        })
        .on("mouseout", function() {
        tooltip.style("visibility", "hidden")
        });

    d3.selectAll("#dailtt_title,#dailtt_text")
        .on("mouseover", function() {
        tooltip.text("the number of transactions in the last 24 hours")
        .style("visibility", "visible")
        })
        .on("mousemove", function() {
        tooltip.text("the number of transactions in the last 24 hours")          
        .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        .style("visibility", "visible")
        })
        .on("mouseout", function() {
        tooltip.style("visibility", "hidden")
        });
    
    d3.selectAll("#tperblock_title,#tperblock_text")
        .on("mouseover", function() {
        tooltip.text("the average number of transactions per block")
        .style("visibility", "visible")
        })
        .on("mousemove", function() {
        tooltip.text("the average number of transactions per block")          
        .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        .style("visibility", "visible")
        })
        .on("mouseout", function() {
        tooltip.style("visibility", "hidden")
        });

        d3.select("#hashrate_title,#hashrate_text")
        .on("mouseover", function() {
        tooltip.text("the total combined computational power used to solve this block - greater value represents more security")
        .style("visibility", "visible")
        })
        .on("mousemove", function() {
        tooltip.text("the total combined computational power being used to solve this block - greater value represents more security")          
        .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        .style("visibility", "visible")
        })
        .on("mouseout", function() {
        tooltip.style("visibility", "hidden")
        });

    d3.selectAll("#height_title,#height_text")
        .on("mouseover", function() {
        tooltip.text("the number of blocks in the blockchain before this one")
        .style("visibility", "visible")
        })
        .on("mousemove", function() {
        tooltip.text("the number of blocks in the blockchain before this one")          
        .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
        .style("visibility", "visible")
        })
        .on("mouseout", function() {     
        tooltip.style("visibility", "hidden")
        });
    
    d3.selectAll("#open_title,#open_text")
        .on("mouseover", function() {
            tooltip.text("the price of Bitcoin at the start of this block")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.text("the price of bitcoin at the start of this block")          
            .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
            .style("visibility", "visible");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#high_title,#high_text")
        .on("mouseover", function() {
            tooltip.text("the highest price of Bitcoin in this block")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.text("the highest price of bitcoin in this block")
            .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
            .style("visibility", "visible");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#low_title,#low_text")
        .on("mouseover", function() {
            tooltip.text("the lowest price of Bitcoin in this block")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.text("the lowest price of bitcoin in this block")
            .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
            .style("visibility", "visible");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#close_title,#close_text")
        .on("mouseover", function() {
            tooltip.text("the price of Bitcoin at the end of this block")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.text("the price of bitcoin at the end of this block")          
            .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
            .style("visibility", "visible");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    d3.selectAll("#volume_title,#volume_text")
        .on("mouseover", function() {
            tooltip.text("the total volume of transactions in this block")
            .style("visibility", "visible");
        })
        .on("mousemove", function() {
            tooltip.text("the total volume of transactions in this block")          
            .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
            .style("visibility", "visible");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });
}
function setBlockInfo(elem){
    $('#height_text').text(elem.block_height);
    $('#interval_text').text(elem.interval);
    $('#pendingt_text').text(elem.pending_tx_count);
    $('#dailtt_text').text(elem.day_tx_count);
    $('#tperblock_text').text(elem.avg_tx_per_block);
    $('#hashrate_text').text(elem.hashrate);


    $('#pos_bar').attr("width", elem.posavg * maxbarwidth);
    $('#neg_bar').attr("width", elem.negavg * maxbarwidth);
    $('#neu_bar').attr("width", elem.neuavg * maxbarwidth);
    $('#comp_bar').attr("width", elem.compoundavg * maxbarwidth);
    $('#sentiment_volume').text(elem.svolumeavg);

    $('#pos_val').attr("x", elem.posavg * maxbarwidth );
    $('#pos_val').html(elem.posavg);
    $('#neg_val').attr("x", elem.negavg * maxbarwidth );
    $('#neg_val').html(elem.negavg);
    $('#neu_val').attr("x", elem.neuavg * maxbarwidth );
    $('#neu_val').html(elem.neuavg);
    $('#comp_val').attr("x", elem.compoundavg * maxbarwidth );
    $('#comp_val').html(elem.compoundavg);

    $('#open_text').text(elem.openavg);
    $('#high_text').text(elem.highavg);
    $('#low_text').text(elem.lowavg);
    $('#close_text').text(elem.closeavg);
    $('#volumn_text').text(elem.fvolumeavg);
    add_tooltip();
    /*block_msg = ''
    // block_msg += ("<p>Block Hash | " + customSplit(elem.hash, 20) + "</p>");
    block_msg += ("<p id=\"block-intrv\">Block Interval | " + elem.interval + "</p>");
    block_msg += ("<p id=\"pending-trx\">Pending Transactions | " + elem.pending_tx_count + "</p>");
    block_msg += ("<p id=\"daily-trx\">Daily Transactions | " + elem.day_tx_count + "</p>");
    block_msg += ("<p id=\"avg-trx\">Average Transactions per Block | " + elem.avg_tx_per_block + "</p>");
    block_msg += ("<p id=\"chr\">Current Hash Rate | " + elem.hashrate + "</p>");
    block_msg += ("<p id=\"block-ht\">Block Height | " + elem.block_height + "</p>");
    $('#block_info').html(block_msg);*/

    /*sentiment_msg = ''
    sentiment_msg += ("<p>Open Price | " + elem.openavg + "</p>");
    sentiment_msg += ("<p>High Price | " + elem.highavg + "</p>");
    sentiment_msg += ("<p>Low Price | " + elem.lowavg + "</p>");
    sentiment_msg += ("<p>Close Price | " + elem.closeavg + "</p>");
    sentiment_msg += ("<p>Trading Volume | " + elem.fvolumeavg + "</p>");
    $('#financial_info').html(sentiment_msg);*/
}
function svg_init(){
    //----------------------------SVG_sentiment-----------------------------//
    var margin = {top: 30, bottom: 30, left: 50, right: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom,
    y_gap = 20;

    const svg_sentiment = d3.select("#sentiment_barchart")
    var g_sentiment = svg_sentiment.append("g")
        .attr("id", "g_sentiment")
    g_sentiment.append('text').html('&#128515; Positive ').attr('id', "pos_title")
    .attr('transform', 'translate(' + 20 + ', ' + y_gap + ')')
    g_sentiment.append('rect')
        .attr("width", 0)
        .attr("height", 18)
        .attr("x", 50)
        .attr("y", y_gap*1.5)
        .attr("fill", "MediumSeaGreen")
        .attr('stroke', 'white')
        .attr('stroke-width', '0')
        .attr('id', 'pos_bar')
    g_sentiment.append('text').html('0.2').attr('id', "pos_val")
        .attr('transform', 'translate(' + 60 + ', ' + y_gap*2.3 + ')')
        .attr("x", 0)
        .style("fill", "MediumSeaGreen")
    // neg
    g_sentiment.append('text').html('&#128533; Negative ').attr('id', "neg_title")
    .attr('transform', 'translate(' + 20 + ', ' + y_gap*4 + ')')
    g_sentiment.append('rect')
        .attr("width", 0)
        .attr("height", 18)
        .attr("x", 50)
        .attr("y", y_gap*4.5)
        .attr("fill", "Tomato")
        .attr('stroke', 'white')
        .attr('stroke-width', '0')
        .attr('id', 'neg_bar')
    g_sentiment.append('text').html('0.2').attr('id', "neg_val")
        .attr('transform', 'translate(' + 60 + ', ' + y_gap*5.3 + ')')
        .attr("x", 0)
        .style("fill", "Tomato")
    // neu
    g_sentiment.append('text').html('&#128528; Neutral ').attr("id", "neu_title")
    .attr('transform', 'translate(' + 20 + ', ' + y_gap*7 + ')')
    g_sentiment.append('rect')
        .attr("width", 0)
        .attr("height", 18)
        .attr("x", 50)
        .attr("y", y_gap*7.5)
        .attr("fill", "LightGray")
        .attr('stroke', 'white')
        .attr('stroke-width', '0')
        .attr('id', 'neu_bar')
    g_sentiment.append('text').html('0.2').attr('id', "neu_val")
        .attr('transform', 'translate(' + 60 + ', ' + y_gap*8.3 + ')')
        .attr("x", 0)
        .style("fill", "LightGray")

    g_sentiment.append('text').html('&#129488; Compound').attr("id", "comp_title")
    .attr('transform', 'translate(' + 20 + ', ' + y_gap*10 + ')')
    g_sentiment.append('rect')
        .attr("width", 0)
        .attr("height", 18)
        .attr("x", 50)
        .attr("y", y_gap*10.5)
        .attr("fill", "Orange")
        .attr('stroke', 'white')
        .attr('stroke-width', '0')
        .attr('id', 'comp_bar')
    g_sentiment.append('text').html('0.2').attr('id', "comp_val")
        .attr('transform', 'translate(' + 60 + ', ' + y_gap*11.3 + ')')
        .attr("x", 0)
        .style("fill", "Orange")

    g_sentiment.append('text').html('&#128226; Sentiment Volume').attr('id', "sent_vol_title")
        .attr('transform', 'translate(' + 20 + ', ' + y_gap*13 + ')')

    g_sentiment.append('text').text('0').attr('id', "vol_val")
        .attr("x", 50)
        .attr("y", y_gap*14.5)
        .attr('id', 'sentiment_volume')


    const svg_block = d3.select("#block_barchart")
    var g_block = svg_block.append("g")
        .attr("id", "g_block")
    x_cursor = 20, x2_cursor = 210;
    y_cursor = 20, gap = 50;
    g_block.append('text').html('Block Height').attr('id', 'height_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_block.append('text').attr('id', 'height_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_block.append('text').html('Block Interval').attr('id', 'interval_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_block.append('text').attr('id', 'interval_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_block.append('text').html('Pending Transactions ').attr('id', 'pendingt_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_block.append('text').attr('id', 'pendingt_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_block.append('text').html('Daily Transactions ').attr('id', 'dailtt_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_block.append('text').attr('id', 'dailtt_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_block.append('text').html('Transactions/Block ').attr('id', 'tperblock_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_block.append('text').attr('id', 'tperblock_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_block.append('text').html('Current Hash Rate').attr('id', 'hashrate_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_block.append('text').attr('id', 'hashrate_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')

    const svg_financial = d3.select("#financial_barchart")
    var g_financial = svg_financial.append("g")
        .attr("id", "g_financial")
    /*g_financial.append("rect")
        .attr("width", 160)
        .attr("height", 250)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill",  'transparent')
        .attr('stroke', 'white')
        .attr('stroke-width', '2')
    g_financial.append("rect")
        .attr("width", 160)
        .attr("height", 250)
        .attr("x", 160)
        .attr("y", 0)
        .attr("fill",  'transparent')
        .attr('stroke', 'white')
        .attr('stroke-width', '2')*/
    x_cursor = 40, x2_cursor = 180;
    y_cursor = 20, gap = 60;
    g_financial.append('text').html('Open Price ').attr('id', 'open_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_financial.append('text').attr('id', 'open_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_financial.append('text').html('High Price ').attr('id', 'high_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_financial.append('text').attr('id', 'high_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_financial.append('text').html('Low Price ').attr('id', 'low_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_financial.append('text').attr('id', 'low_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_financial.append('text').html('Close Price ').attr('id', 'close_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_financial.append('text').attr('id', 'close_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')
        y_cursor += gap
    g_financial.append('text').html('Trading Volume').attr('id', 'volume_title')
        .attr('transform', 'translate(' + x_cursor + ', ' + y_cursor + ')')
    g_financial.append('text').attr('id', 'volume_text').html('12346.4556')
        .attr('transform', 'translate(' + x2_cursor + ', ' + y_cursor + ')')


}