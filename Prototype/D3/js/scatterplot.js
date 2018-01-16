var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d["V1"];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["V2"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return +d["color"];},
    cScale = d3.scale.linear().interpolate(d3.interpolateHcl).range([d3.rgb('#006d2c'), d3.rgb('#edf8fb')]),
    cMap = function(d){ return cScale(cValue(d))};
    

// add the graph canvas to the body of the webpage
var svg = d3.select("#scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// load data
d3.csv("files/scatterplot500color.csv", function(error, data) {

  data.forEach(function(d) {
    d["V1"] = +d["V1"];
    d["V2"] = +d["V2"];     
 
  });
  // don't want dots overlapping axis, so add in buffer to data domain
  cScale.domain([d3.min(data, cValue), d3.max(data, cValue)]);
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("X");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Y");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", function(d){if (d["color"]!="1") return "dot"; return "first" })
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)    
      .style("fill", cMap)//function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["names"]+ "<br/> (" + xValue(d) 
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .on("click", function(d){
          console.log(+d["names"]);
          AddBarchart(+d["names"], false);
          
      });
  svg.selectAll(".first")
    .style("fill", 'red')
       
  var legend = svg.selectAll(".legend")
    .data([1])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
  var linearGradient = legend.append("linearGradient")
    .attr("id", "linear-gradient");
 //Vertical gradient
linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
  //Set the color for the start (0%)
linearGradient.append("stop") 
    .attr("offset", "0%")   
    .attr("stop-color", "#006d2c"); 

//Set the color for the end (100%)
linearGradient.append("stop") 
    .attr("offset", "100%")   
    .attr("stop-color", "#edf8fb"); //dark blue
  // draw legend colored rectangles
  legend.append("rect")
      .data(data)
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 150)
      .style("fill", "url(#linear-gradient)") 
  
//  draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 0)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Most Similar")
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 150)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Less Similar")
  legend.append("rect")
      .data(data)
      .attr("x", width - 18)
      .attr("y", 170)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "red") 
  
//  draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 170)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Query") 
    
   
  //Add Barchart for the first Element 
  AddBarchart(1, true); 
});