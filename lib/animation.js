import * as d3 from 'd3';

const chart = d3.select('body').append('svg').attr('width', 800).attr('height', 600);

chart.append('rect').attr('width', 60).attr('height', 60).attr("transform", "translate(30,60)");
chart.append('rect').attr('width', 80).attr('height', 60).style('fill', 'blue').attr("transform", "translate(30,120)");

d3.selectAll('rect').style('fill', 'green').transition().delay(2000).style('fill', 'red').transition().delay(1000).style('fill', 'blue');