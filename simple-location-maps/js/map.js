var viceGlobeContext = d3.select("vice-globe").node().getContext("2d"),
    path = d3.geoPath(d3.geoOrthographic(), context);

d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
  if (error) throw error;

  viceGlobeContext.beginPath();
  path(topojson.mesh(world));
  viceGlobeContext.stroke();
});