var viceGlobe = function() {
    var svg = d3.select('#vice-globe');
    var dim = svg.style('width').replace("px", "") / 2;

    var path = d3.geoPath(d3.geoOrthographic()
    .scale(dim)
    .rotate([-100, -30])
    .translate([dim, dim])
    .clipAngle(90));

    d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world) {
    if (error) throw error;

    svg.append('path')
        .attr('stroke', '#333')
        .attr('stroke-width', 4)
        .attr('fill', 'none')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', path(topojson.mesh(world, world.objects.land)));
    });
};

var nytWorld = function() {
    var svg = d3.select('#nyt-world');
    var dim = svg.style('width').replace("px", "") / 2;

    var path = d3.geoPath(d3.geoOrthographic()
    .scale(dim)
    .rotate([60, -20])
    .translate([dim, dim])
    .clipAngle(90));

    d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world) {
    if (error) throw error;

    svg.append('path')
        .attr('stroke', '#333')
        .attr('stroke-width', 4)
        .attr('fill', 'none')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', path(topojson.mesh(world, world.objects.land)));
    });
};

viceGlobe();