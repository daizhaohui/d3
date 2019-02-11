import * as d3 from 'd3';
import chartFactory from './common/index';

const left = 30;
const top = 30;
const format = d3.timeParse('%Y-%m-%d');
const chart = d3.select('body').append('svg').attr('width', 800).attr('height', 600)
  .attr('transform', `translate(${left}, ${top})`);
const tFormat = d3.timeFormat('%Y-%m-%d');

chart.append('text').text(format('2019-10-12')).attr('x', 30).attr('y', 30);
chart.append('text').style('color', 'red').text(tFormat(new Date())).attr('x', 30).attr('y', 60)
  .style('font-size', '20px');
chart.append('text').text(d3.timeHour.offset(new Date(), 6)).attr('x', 30).attr('y', 90);