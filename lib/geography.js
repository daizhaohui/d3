import * as topojson from 'topojson';
import * as d3 from 'd3';
import chartFactory from './common/index';
import 'whatwg-fetch';
import '../styles/index.css';
import {
  csvParseRows,
  csvParse
} from 'd3-dsv';

const geoDemo = (async(enabed) => {
  if (!enabed) return;
  const chart = chartFactory();

  const projection = d3.geoEquirectangular()
    .center([-50, 56])
    .scale(200);

  const addRenditions = (airportData, renditions) => {
    const airports = csvParseRows(airportData)
      .reduce((obj, airport) => {
        obj[airport[4]] = {
          lat: airport[6],
          lon: airport[7],
        };
        return obj;
      }, {});

    const routes = csvParse(renditions).map((v) => {
        const dep = v['Departure Airport'];
        const arr = v['Arrival Airport'];
        return {
          from: airports[dep],
          to: airports[arr],
        };
      })
      .filter(v => v.to && v.from)
      .slice(0, 100);

    chart.container.selectAll('.route')
      .data(routes)
      .enter()
      .append('line')
      .attr('x1', d => projection([d.from.lon, d.from.lat])[0])
      .attr('y1', d => projection([d.from.lon, d.from.lat])[1])
      .attr('x2', d => projection([d.to.lon, d.to.lat])[0])
      .attr('y2', d => projection([d.to.lon, d.to.lat])[1])
      .classed('route', true);
  };

  const addToMap = (collection, key) => chart.container.append('g')
    .selectAll('path')
    .data(topojson.feature(collection, collection.objects[key]).features)
    .enter()
    .append('path')
    .attr('d', d3.geoPath().projection(projection));

  const draw = (worldData) => {
    const [sea, land, cultural] = worldData;
    addToMap(land, 'land')
      .classed('land', true);
    chart.svg.node().classList.add('map');
  };

  const world = await Promise.all([
    (await fetch('data/water.json')).json(),
    (await fetch('data/land.json')).json(),
    (await fetch('data/cultural.json')).json(),
  ]);

  draw(world);
  addRenditions(
    await (await fetch('data/airports.dat')).text(),
    await (await fetch('data/renditions.csv')).text()
  );
})(true);