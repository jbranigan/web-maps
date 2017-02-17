var width, height;

function getSize() {
  width = $(".jumbotron").width();
  height = width;
}

// variables for rotation and scale
var rotate = [90.00, -20, 23.5];
var scale = 300;

var formatNumber = d3.format(",.0f");

function drawMap() {

  var projection = d3.geo.orthographic()
      .translate([width / 2, height / 2])
      .scale(scale)
      .rotate(rotate)
      .clipAngle(90)
      .precision(0.6);

  var graticule = d3.geo.graticule();

  var path = d3.geo.path()
      .projection(projection);

  var m0,
     o0;

  // NOTE: this isn't really necessary, is jittery, and probably processor intensive
  var drag = d3.behavior.drag()
    .on("dragstart", function() {
    // Adapted from http://mbostock.github.io/d3/talk/20111018/azimuthal.html and updated for d3 v3
      var proj = projection.rotate();
      m0 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
      o0 = [-proj[0],-proj[1]];
    })
    .on("drag", function() {
      if (m0) {
        var m1 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY],
            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
        projection.rotate([-o1[0], -o1[1], 23.5]);
      }

    // Update the map
      path = d3.geo.path().projection(projection);
      d3.selectAll("path").attr("d", path);
      d3.selectAll(".symbol").attr("d", path.pointRadius(function(d) {
        return radius(d.properties.pop2010 * 1000);
      }));
    });

  var svg = d3.select(".jumbotron").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(drag); // neat, but janky

  var radius = d3.scale.sqrt()
    .domain([0, 1e8])
    .range([0, 50]);

  // just a background color - lines up with the globe boundary
  var fill = svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", scale
        )
      .style("fill", "#223537");

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  queue()
      .defer(d3.json, "world-50m.json")
      .defer(d3.json, "cities.json")
      .await(ready);

  function ready(error, world, cities) {
    if (error) throw error;

      svg.append("path")
          .datum(topojson.feature(world, world.objects.land))
          .attr("class", "land")
          .attr("d", path);

      svg.append("path")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", path);

    svg.selectAll(".symbol")
        .data(cities.features.sort(function(a, b) { return b.properties.pop2010 - a.properties.pop2010; }))
      .enter().append("path")
        .attr("class", "symbol")
        .attr("d", path.pointRadius(function(d) { return radius(d.properties.pop2010 * 1000); }))
      .append("title")
          .text(function(d) {
            return d.properties.nameascii + "\nPopulation 2010: " + (formatNumber(d.properties.pop2010 * 1000));
          });
    }

   d3.select(self.frameElement).style("height", height + "px");

   var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
      .selectAll("g")
        .data([2e6, 1e7, 3e7])
      .enter().append("g");

    legend.append("circle")
        .attr("cy", function(d) { return -radius(d); })
        .attr("r", radius);

    legend.append("text")
        .attr("y", function(d) { return -2 * radius(d); })
        .attr("dy", "1.3em")
        .text(d3.format(".1s"));
}

//graphs here - just placeholder stuff
// function drawLineChart() {
//   var margin = {top: 5, right: 5, bottom: 5, left: 5};

//   var graphWidth = $("#line-graph").width() - margin.left - margin.right;
//   var graphHeight = 300 - margin.top - margin.bottom;

//   var parseDate = d3.time.format("%Y%m%d").parse;

//   var x = d3.time.scale()
//       .range([0, graphWidth]);

//   var y = d3.scale.linear()
//       .range([graphHeight, 0]);

//   var color = d3.scale.category10();

//   var xAxis = d3.svg.axis()
//       .scale(x)
//       .orient("bottom");

//   var yAxis = d3.svg.axis()
//       .scale(y)
//       .orient("left");

//   var line = d3.svg.line()
//       .interpolate("basis")
//       .x(function(d) { return x(d.date); })
//       .y(function(d) { return y(d.temperature); });

//   var lineSvg = d3.select("#line-graph").append("svg")
//       .attr("width", graphWidth + margin.left + margin.right)
//       .attr("height", graphHeight + margin.top + margin.bottom)
//     .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   d3.tsv("data.tsv", function(error, data) {
//     if (error) throw error;

//     color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

//     data.forEach(function(d) {
//       d.date = parseDate(d.date);
//     });

//     var cities = color.domain().map(function(name) {
//       return {
//         name: name,
//         values: data.map(function(d) {
//           return {date: d.date, temperature: +d[name]};
//         })
//       };
//     });

//     x.domain(d3.extent(data, function(d) { return d.date; }));

//     y.domain([
//       d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
//       d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
//     ]);

//     lineSvg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + graphHeight + ")")
//         .call(xAxis);

//     lineSvg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);

//     var city = lineSvg.selectAll(".city")
//         .data(cities)
//       .enter().append("g")
//         .attr("class", "city");

//     city.append("path")
//         .attr("class", "line")
//         .attr("d", function(d) { return line(d.values); })
//         .style("stroke", function(d) { return color(d.name); });

    // city.append("text")
    //     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    //     .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
    //     .attr("x", 3)
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.name; });
//  });
//}