import * as d3 from 'd3';
import chartFactory from './common/index';
import '../styles/index.css';
import { deepStrictEqual } from 'assert';

// const chart = chartFactory({
//   margin: {
//     top: 30,
//     bottom: 10,
//     left: 50,
//     right: 50
//   }
// });

var chart = d3.select("body").append("svg")
  .attr("width", 800)
  .attr("height", 600);

const g1 = chart.append("g")
  .attr("transform", "translate(100,110)");
const g2 = chart.append("g")
  .attr("transform", "translate(100,10)");


const x = d3.scaleLinear().domain([0, 100]).range([0, 300]);
const y = d3.scaleLinear().domain([100, 0]).range([0, 100]);
var axis = d3.axisBottom().scale(x).tickValues([0, 10, 30, 60, 100]).tickFormat((d, i) => {
  return ['a', 'b', 'c', 'd', 'e'][i];
});
g1.call(axis);
axis = d3.axisLeft().scale(y);
g2.call(axis);