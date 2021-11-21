let svgWidth = 1200
let svgHeight = 1000


let svg = d3.select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
var g = svg.append('g')

d3.queue().defer(d3.json,'0.json')
.defer(d3.json,'temp.json')
.defer(d3.json,'diff_percentage.json')
.defer(d3.json,'form_rekap.json')
.defer(d3.json,'42385.json')
.awaitAll(function(error, data){
    vis1(data)
    vis2(data)
    vis3(data)
})

function removeOther(){
    d3.selectAll('circle').remove()
    d3.selectAll('rect').remove()
    d3.selectAll('path').remove()
    d3.selectAll('.axisVote').remove()
    d3.selectAll('.axisPercentage').remove()
    d3.selectAll('.legend').remove()
    d3.selectAll("#graf-title").remove()
    d3.selectAll('.y-desc').remove()
    d3.selectAll('.y-desc-scatter').remove()
    // d3.selectAll('path').remove()
    d3.selectAll('image').remove()
    d3.select('.text-salaman').remove()
    

}


function vis2(data){
        d3.select("li.vis2").on("click", function(){
        removeOther()
        d3.select("select").remove()
        dataSelect = ['by Gap Paslon 1 (Ascending)','by Gap Paslon 2 (Ascending)','none']
        d3.select(".lab-sel label").text("Sort by")
        d3.select('.selectClass').append('select').attr('id','selectButton')
        d3.select("select").selectAll('option').data(dataSelect)
            .enter()
            .append('option')
            .attr('value', function(d){
                return d
            })
            .text(function(d){
                return d
            })
            .attr('selected',function(d){
                if (d == "none"){
                    return "selected"
                }
            })
        d3.select("li.vis1").classed('selected',false)
        d3.select("li.vis2").classed('selected',true)
        d3.select("li.vis3").classed('selected',false)

        d3.select('h1').text('Persebaran Gap Suara Pilpres 2019 pada Tingkat Kecamatan Jawa Timur')
        d3.select('p').text('Visualisasi ini menggambarkan kecamatan-kecamatan di Provinsi Jawa Timur yang didapati adanya gap suara pada rekapitulasi di tingkat kecamatan dan tingkat kota')
    
        drawBarChartJatim(data)
        
    })
}

function setupBarChartJatim(dataBar){
    var margin = {left : 50, top : 250, right: 0, bottom:0}
    barWidth = svgWidth - margin.left - margin.right
    barHeight = svgHeight - margin.top - margin.bottom

    const xScale = d3.scaleBand()
    .domain(dataBar.map(d=>d.region)).padding(0.1)
    .range([0,barWidth])

    const xScaleGroup = d3.scaleBand()
    .domain(dataBar[0].count.map(d=>d.category)).padding(0.1)
    .range([0,xScale.bandwidth()])
    
    var yGap1 = d3.scaleLinear()
    .domain([d3.min(allGap) + 20762,d3.max(allGap) + 20762])
    .range([barHeight,0])
    

    var yGap2 = d3.scaleLinear()
    .domain([d3.min(allGap),d3.max(allGap)])
    .range([barHeight,0])
    


    var marginAxisY = {left : 50, top : 131.5   , right: 0, bottom:0}
    g.append("g")
        .attr('transform',`translate(${marginAxisY.left},${marginAxisY.top})`)
        .attr('class','axisVote')
        .call(d3.axisLeft(yGap2))

    var slice = g.selectAll(".slice")
    .data(dataBar)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform",function(d) { return "translate(" + xScale(d.region) + ",0)"; });

    slice.selectAll('rect').data(d=>d.count)
    .enter()
    .append('rect')
    .attr('class', 'bar-chart')
    .attr('id', d=> d.region)
    .attr('transform',`translate(${margin.left},${margin.top})`)
    .attr('x', d => xScaleGroup(d.category))
    .attr('y', function(d){ return 200})
    .style('fill',d=>d.category)
    .attr('width', xScaleGroup.bandwidth())
    .attr('height',d => barHeight - yGap1(0))
    .append('title').text(d => d.value)
    .on("mouseover", function(d) {
        d3.select(this).style("fill", d3.rgb(d.category).darker(2))
    })
    .on("mouseout", function(d) {
        d3.select(this).style("fill", d.category);
    })


    slice.selectAll("rect")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr('y', function(d){
        if (d.value >=0){
            return yGap1(d.value) - 550
        }else{
            return yGap1(Math.abs(d.value)) - 550 + Math.abs(barHeight - yGap1(Math.abs(d.value)))
        }
    })
    .attr("height", function(d) {return Math.abs(barHeight - yGap1(Math.abs(d.value))) });


    var marginAxis = {left : 50, top : 450, right: 0, bottom:0}
        g.append("g")
        .attr('transform',`translate(${marginAxis.left},${marginAxis.top})`)
        .attr('class','axisPercentage')
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        
        .attr("x", -400)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr("class","y-desc")
        .text("JUMLAH GAP SUARA")
        .style('fill', 'black')
}

function drawBarChartJatim(data){
    regionName = []
    regionGap1 = {}
    regionGap2 = {}
    allGap = []
    console.log(data[3])
    data[3].data.forEach(function(d){
        if (d[12].split('/')[0] == "42385" && ("kec"== d[1])){
            console.log(d[6])
            d3.queue().defer(d3.json, d[12]+'.json')
                .awaitAll(function(error, data2){       
                    regionName.push(data2[0][d[0]].nama.toLowerCase())
                    regionGap1[data2[0][d[0]].nama.toLowerCase()] = d[6]
                    regionGap2[data2[0][d[0]].nama.toLowerCase()] = d[7]
                    allGap.push(d[6])
                    allGap.push(d[7])
                })
                

        }
    })

    setTimeout(function(){
        let dataBar = []
        for (const region in regionName){
            console.log(regionName[region])
            var temp = []
            var objTempRed = { value : regionGap1[regionName[region]], category : "red" , region : regionName[region] + "1"}
            var objTempBlue = { value : regionGap2[regionName[region]], category : "blue", region : regionName[region] + "2"}
            temp.push(objTempRed)
            temp.push(objTempBlue)
            var barDat = { region : regionName[region], count : temp, value1 : regionGap1[regionName[region]], value2 : regionGap2[regionName[region]], }
            dataBar.push(barDat)
        }
        
        setupBarChartJatim(dataBar)
        d3.select("select").on("change",function(d){
            if (d3.select("select").property("value") == "by Gap Paslon 1 (Ascending)"){
                dataBar.sort(function(a,b){
                    return a.value1 - b.value1;
                })
            }else if(d3.select("select").property("value") == "by Gap Paslon 2 (Ascending)") {
                dataBar.sort(function(a,b){
                    return a.value2 - b.value2;
                })
            }else if (d3.select("select").property("value") == "none"){
                dataBar = []
                    for (const region in regionName){
                        var temp = []
                        var objTempRed = { value : regionGap1[regionName[region]], category : "red" , region : regionName[region] + "1"}
                        var objTempBlue = { value : regionGap2[regionName[region]], category : "blue", region : regionName[region] + "2"}
                        temp.push(objTempRed)
                        temp.push(objTempBlue)
                        var barDat = { region : regionName[region], count : temp , value1 : regionGap1[regionName[region]], value2: regionGap2[regionName[region]]}
                        dataBar.push(barDat)
                    }
            }
            removeOther()
            setupBarChartJatim(dataBar)
            
        })
        
    },100)
}

function vis1(data){
    d3.select('h1').text('Persebaran Gap Suara Pilpres 2019 pada Tingkat Kelurahan Jawa Barat')
    d3.select('p').text('Visualisasi ini menggambarkan kelurahan-kelurahan di Provinsi Jawa Barat yang didapati adanya gap suara pada rekapitulasi di tingkat kelurahan dan tingkat kecamatan')
    
    dataSelect = ['by Gap Paslon 1 (Ascending)','by Gap Paslon 2 (Ascending)','none']
        // d3.selectAll('label').text('kategori daerah')
    d3.select(".lab-sel label").text("Sort by")
    d3.select('.selectClass').append('select').attr('id','selectButton')
    d3.select("select").selectAll('option').data(dataSelect)
        .enter()
        .append('option')
        .attr('value', function(d){
            return d
        })
        .text(function(d){
            return d
        })
        .attr('selected',function(d){
            if (d == "none"){
                return "selected"
            }
        })
    drawBarChartJabar(data)
    d3.select("li.vis1").on("click", function(){
        removeOther()
        d3.select("select").remove()
        d3.select("li.vis1").classed('selected',true)
        d3.select("li.vis2").classed('selected',false)
        d3.select("li.vis3").classed('selected',false)
        d3.select('h1').text('Persebaran Gap Suara Pilpres 2019 pada Tingkat Kelurahan Jawa Barat')
        d3.select('p').text('Visualisasi ini menggambarkan kelurahan-kelurahan di Provinsi Jawa Barat yang didapati adanya gap suara pada rekapitulasi di tingkat kelurahan dan tingkat kecamatan')
        
        dataSelect = ['by Gap Paslon 1 (Ascending)','by Gap Paslon 2 (Ascending)','none']
        // d3.selectAll('label').text('kategori daerah')
        d3.select('.selectClass').append('select').attr('id','selectButton')
        d3.select("select").selectAll('option').data(dataSelect)
            .enter()
            .append('option')
            .attr('value', function(d){
                return d
            })
            .text(function(d){
                return d
            })
            .attr('selected',function(d){
                if (d == "none"){
                    return "selected"
                }
            })
        drawBarChartJabar(data)
    })
}


function setupBarChartJabar(dataBar){
    var margin = {left : 50, top : 250, right: 0, bottom:0}
    barWidth = svgWidth - margin.left - margin.right
    barHeight = svgHeight - margin.top - margin.bottom

    const xScale = d3.scaleBand()
    .domain(dataBar.map(d=>d.region)).padding(0.1)
    .range([0,barWidth])

    const xScaleGroup = d3.scaleBand()
    .domain(dataBar[0].count.map(d=>d.category)).padding(0.1)
    .range([0,xScale.bandwidth()])
    
    var yGap1 = d3.scaleLinear()
    .domain([d3.min(allGap) + 3656,d3.max(allGap) + 3656])
    .range([barHeight,0])

    var yGap2 = d3.scaleLinear()
    .domain([d3.min(allGap),d3.max(allGap)])
    .range([barHeight,0])
    // console.log(yGap2.domain())


    var marginAxisY = {left : 50, top : 131.5, right: 0, bottom:0}
    g.append("g")
        .attr('transform',`translate(${marginAxisY.left},${marginAxisY.top})`)
        .attr('class','axisVote')
        .call(d3.axisLeft(yGap2))

    var slice = g.selectAll(".slice")
    .data(dataBar)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform",function(d) { return "translate(" + xScale(d.region) + ",0)"; });

    slice.selectAll('rect').data(d=>d.count)
    .enter()
    .append('rect')
    .attr('class', 'bar-chart')
    .attr('id', d=> d.region)
    .attr('transform',`translate(${margin.left},${margin.top})`)
    .attr('x', d => xScaleGroup(d.category))
    .attr('y', function(d){ return 283})
    .style('fill',d=>d.category)
    .attr('width', xScaleGroup.bandwidth())
    .attr('height',d => barHeight - yGap1(0))
    .append('title').text(d => d.value)
    .on("mouseover", function(d) {
        d3.select(this).style("fill", d3.rgb(d.category).darker(2))
    })
    .on("mouseout", function(d) {
        d3.select(this).style("fill", d.category);
    })

    slice.selectAll("rect")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr('y', function(d){
        if (d.value >=0){
            return yGap1(d.value) - 467
        }else{
            return yGap1(Math.abs(d.value)) - 467 + Math.abs(barHeight - yGap1(Math.abs(d.value)))
        }
    })
    .attr("height", function(d){ return Math.abs(barHeight - yGap1(Math.abs(d.value))) });


    var marginAxis = {left : 50, top : 533, right: 0, bottom:0}
        g.append("g")
        .attr('transform',`translate(${marginAxis.left},${marginAxis.top})`)
        .attr('class','axisPercentage')
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        
        .attr("x", -400)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr("class","y-desc")
        .text("JUMLAH GAP SUARA")
        .style('fill', 'black')
}
function drawBarChartJabar(data){
    regionName = []
    regionGap1 = {}
    regionGap2 = {}
    allGap = []
    console.log(data[3])
    data[3].data.forEach(function(d){
        if (d[12].split('/')[0] == "26141" && ("kel"== d[1])){
            console.log(d[6])
            d3.queue().defer(d3.json, d[12]+'.json')
                .awaitAll(function(error, data2){       
                    regionName.push(data2[0][d[0]].nama.toLowerCase())
                    regionGap1[data2[0][d[0]].nama.toLowerCase()] = d[6]
                    regionGap2[data2[0][d[0]].nama.toLowerCase()] = d[7]
                    allGap.push(d[6])
                    allGap.push(d[7])
                })
                

        }
    })
    // console.log(regionName)
    // console.log(regionGap1)
    setTimeout(function(){
        let dataBar = []
        for (const region in regionName){
            
            var temp = []
            var objTempRed = { value : regionGap1[regionName[region]], category : "red" , region : regionName[region] + "1"}
            var objTempBlue = { value : regionGap2[regionName[region]], category : "blue", region : regionName[region] + "2"}
            temp.push(objTempRed)
            temp.push(objTempBlue)
            var barDat = { region : regionName[region], count : temp , value1 : regionGap1[regionName[region]], value2: regionGap2[regionName[region]]}
            dataBar.push(barDat)
        }
        console.log(dataBar)
    
        d3.select("select").on("change",function(d){
            if (d3.select("select").property("value") == "by Gap Paslon 1 (Ascending)"){
                dataBar.sort(function(a,b){
                    return a.value1 - b.value1;
                })
                console.log(dataBar)
            }else if(d3.select("select").property("value") == "by Gap Paslon 2 (Ascending)") {
                console.log('a')
                dataBar.sort(function(a,b){
                    return a.value2 - b.value2;
                })

            }else if (d3.select("select").property("value") == "none"){
                console.log('b')
                dataBar = []
                    for (const region in regionName){
                        var temp = []
                        var objTempRed = { value : regionGap1[regionName[region]], category : "red" , region : regionName[region] + "1"}
                        var objTempBlue = { value : regionGap2[regionName[region]], category : "blue", region : regionName[region] + "2"}
                        temp.push(objTempRed)
                        temp.push(objTempBlue)
                        var barDat = { region : regionName[region], count : temp , value1 : regionGap1[regionName[region]], value2: regionGap2[regionName[region]]}
                        dataBar.push(barDat)
                    }
            }
            console.log(dataBar)
            removeOther()
            setupBarChartJabar(dataBar)
        })

        setupBarChartJabar(dataBar)
            
    },100)
}


function vis3(data){
    d3.select("li.vis3").on("click", function(){
        removeOther()
        d3.select("select").remove()
        d3.select(".lab-sel label").text(" ")
        
        d3.select("li.vis1").classed('selected',false)
        d3.select("li.vis2").classed('selected',false)
        d3.select("li.vis3").classed('selected',true)
        d3.select('h1').text('Persebaran Gap Suara Pilpres 2019 pada Tingkat Kecamatan Sumatera Utara')
        d3.select('p').text('Visualisasi ini menggambarkan kelurahan-kelurahan di Provinsi Sumatera Utara yang didapati adanya gap suara pada rekapitulasi di tingkat kecamatan dan tingkat kabupaten/kota.')
    
        drawBarChartSumut(data) 
        
    })
}

function drawBarChartSumut(data){
    regionName = []
    regionGap1 = {}
    regionGap2 = {}
    allGap = []
    // console.log(data[3])
    data[3].data.forEach(function(d){
        if (d[12].split('/')[0] == "6728" && ("kec"== d[1])){
            // console.log(d[6])
            d3.queue().defer(d3.json, d[12]+'.json')
                .awaitAll(function(error, data2){       
                    regionName.push(data2[0][d[0]].nama.toLowerCase())
                    regionGap1[data2[0][d[0]].nama.toLowerCase()] = d[6]
                    regionGap2[data2[0][d[0]].nama.toLowerCase()] = d[7]
                    allGap.push(d[6])
                    allGap.push(d[7])
                })
                

        }
    })

    let dataBar = []
    // console.log(regionName)
    // console.log(regionGap1)
    setTimeout(function(){
        for (const region in regionName){
            // console.log(regionName[region])
            var temp = []
            var objTempRed = { value : regionGap1[regionName[region]], category : "red" , region : regionName[region] + "1"}
            var objTempBlue = { value : regionGap2[regionName[region]], category : "blue", region : regionName[region] + "2"}
            temp.push(objTempRed)
            temp.push(objTempBlue)
            var barDat = { region : regionName[region], count : temp }
            dataBar.push(barDat)
        }
    
        console.log(dataBar)
        var margin = {left : 55, top : 250, right: 0, bottom:0}
        barWidth = svgWidth - margin.left - margin.right
        barHeight = svgHeight - margin.top - margin.bottom

        const xScale = d3.scaleBand()
        .domain(dataBar.map(d=>d.region)).padding(0.1)
        .range([0,barWidth])

        const xScaleGroup = d3.scaleBand()
        .domain(dataBar[0].count.map(d=>d.category)).padding(0.1)
        .range([0,xScale.bandwidth()])
        
        var yGap1 = d3.scaleLinear()
        .domain([d3.min(allGap) + 14,d3.max(allGap) + 14])
        .range([barHeight,0])
        console.log(yGap1.domain())

        var yGap2 = d3.scaleLinear()
        .domain([d3.min(allGap),d3.max(allGap)])
        .range([barHeight,0])
        console.log(yGap2.domain())
    
    
        var marginAxisY = {left : 55, top : 131.5   , right: 0, bottom:0}
        g.append("g")
            .attr('transform',`translate(${marginAxisY.left},${marginAxisY.top})`)
            .attr('class','axisVote')
            .call(d3.axisLeft(yGap2))

        var slice = g.selectAll(".slice")
        .data(dataBar)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + xScale(d.region) + ",0)"; });

        slice.selectAll('rect').data(d=>d.count)
        .enter()
        .append('rect')
        .attr('class', 'bar-chart')
        .attr('id', d=> d.region)
        .attr('transform',`translate(${margin.left},${margin.top})`)
        .attr('x', d => xScaleGroup(d.category))
        .attr('y', function(d){ return 641})
        .style('fill',d=>d.category)
        .attr('width', xScaleGroup.bandwidth())
        .attr('height',d => barHeight - yGap1(0))
        .append('title').text(d => d.value)
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(d.category).darker(2))
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", d.category);
        })
    

        slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr('y', function(d){
            if (d.value >=0){
                return yGap1(d.value) - 119
            }else{
                return yGap1(Math.abs(d.value)) - 119 + Math.abs(barHeight - yGap1(Math.abs(d.value)))
            }
        })
        .attr("height", function(d) {console.log (d.value); console.log(d.region); return Math.abs(barHeight - yGap1(Math.abs(d.value))) });


        var marginAxis = {left : 55, top : 881, right: 0, bottom:0}
            g.append("g")
            .attr('transform',`translate(${marginAxis.left},${marginAxis.top})`)
            .attr('class','axisPercentage')
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

        svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "end")
            
            .attr("x", -400)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .attr("class","y-desc")
            .text("JUMLAH GAP SUARA")
            .style('fill', 'black')
            
    },50)
}