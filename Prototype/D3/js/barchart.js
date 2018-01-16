var formatPercent = d3.format(".0%");
var indexes = [];
var example = [];
var barWidth = 0;
function AddBarchart(documentName, isExampleDocument){    
    console.log(isExampleDocument)
    documentLabel = "Document Name: " + documentName;
    documentName = "V"+documentName;       
   var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 550 - margin.left - margin.right,
height = 200 - margin.top - margin.bottom; 
    
    var xDomain = function(d, index) { 
        if (!isExampleDocument) 
        {
            return example[index];
        }
        else {
            if (d[documentName]!=0) 
                return d["indexes"];
        }
    };
//var xDomain = function(d) { if ((d[documentName]!=0)&&(InExampleDocument(d["indexes"],isExampleDocument))) {return d["indexes"];}}; // data -> value   
var xValue = function(d) {return d["indexes"];},//{ if (d["V1"]!=0) return d["indexes"];}, // data -> value    
    xScale = d3.scale.ordinal().rangeBands([0, width], .1), // value -> display
    xMap = function(d) {return xScale(xValue(d))}, //; else return xScale2(xValue(d)); }; // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickValues([]);
   
var yValue = function(d) { return d[documentName];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d)); }, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");
    
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d, i) {
    
    return "<strong>Term:</strong> <span style='color:red'>" + d["indexes"] + "</span> <br><strong>Frequency:</strong> <span style='color:red'>" + d[documentName] + "</span> ";
  })


var barchart = d3.select("#barchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//    .append("text")
//    .text("Teste");

barchart.call(tip); 
d3.csv("files/barchart500.csv", type, function(error, data) {
  xScale.domain(data.map(xDomain));
//  xScale2.domain(data.map(xDomain));
  yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

  barchart.append("g")
      .data(data)
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)         
  barchart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
  barchart.append("text")
      .text(documentLabel)
      .attr("dx", ".71em")
  barchart.append("rect")
      .attr("width", 5)
      .attr("height", 5)
      .on('click', function(){ barchart.remove();})
 barchart.selectAll(".bar")
      .data(data)
      .enter().append("rect")    
      .attr("class", function(d){                    
                    if ((!InExampleDocument(d["indexes"],isExampleDocument))){ return "bar negative";}
                    else return "bar positive"})
      .attr("x", xMap)
      .attr("width", function(d) { if (isExampleDocument){barWidth = xScale.rangeBand(); return barWidth;} else{ return barWidth;}})//width/size)//xScale.rangePoint)
      .attr("y", yMap)
      .attr("height", function(d) {return height - yMap(d);}) 
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
    
//    
// barchart.selectAll("rect")
//    .append("text")
//    .data(data)
//    .text(function(d) { d["indexes"]; })
//    .attr("y", function(d) { return yMap(d) + 10; })
//    .attr("x", xMap)
//    .style("fill", '#ffffff')
 
//  barchart.selectAll(".tick")
//      .data(data)
//      .filter(function(d){return d["V1"]!=0})
//     
    barchart.selectAll(".bar.negative").remove();     
});
   
  
function type(d) {
 // console.log(isExampleDocument);
 
  d[documentName] = +d[documentName];  
  if ((isExampleDocument)&&(d[documentName] != 0)){
      example.push(d["indexes"]);
  }
  return d;
}
    
}
function InExampleDocument(term, isExampleDocument){ 
    if (isExampleDocument)
        return true;
    else{
//         console.log("term " + term);
        var found = example.find(function(element){           
            return element == term;
        });
       
        if (found){
//            console.log("found ");
            return true;
        }
//        console.log("not found");
        return false;
    }    
}