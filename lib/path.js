import * as d3 from 'd3';
import chartFactory from './common/index';

export default function yayPaths() {
  const chart = chartFactory();
  const path = chart.container.append('path').attr('d', 'M 10 500 L 300 100 L 300 500 M 300 100 l 100 0 M 155 300 l 245 0 M 300 500 l 100 0')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'transparent');
}

yayPaths();