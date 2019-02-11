import * as d3 from 'd3';
import chartFactory from './common';
const chart = d3.select('body').append('svg').attr('width', 800).attr('height', 600);

function animate() {
  chart.append('rect').attr('width', 60).attr('height', 60).attr("transform", "translate(30,60)");
  chart.append('rect').attr('width', 80).attr('height', 60).style('fill', 'blue').attr("transform", "translate(30,120)");
  d3.selectAll('rect').style('fill', 'green').transition().delay(2000).style('fill', 'red').transition().delay(1000).style('fill', 'blue');
  chart.append('text').attr('x', 40).attr('y', 230).text('I am growing!').transition().styleTween('font', () => d3.interpolate('12-x Helvetica', '36px Comic Sans MS'));

}



function easing() {
  const easings = [
    'easeLinear', 'easePolyIn(4)', 'easeQuadIn', 'easeCubicIn', 'easeSinIn', 'easeExpIn',
    'easeCircleIn', 'easeElasticIn(10, -5)', 'easeBackIn(0.5)', 'easeBounceIn', 'easeCubicIn',
    'easeCubicOut', 'easeCubicInOut'
  ];
  const y = d3.scaleBand()
    .domain(easings)
    .range([50, 500]);
  const svg = chart;
  console.log(`y.bandWidth=${y.bandwidth()}`);
  easings.forEach((easing) => {
    const transition = svg.append('circle').attr('cx', 130).attr('cy', y(easing)).attr('r', (y.bandwidth() / 2) - 5).transition()
      .delay(300).duration(1600).attr('cx', 400);
    if (easing.indexOf('(') > -1) {
      const args = easing.match(/[0-9]+/g);
      const funcName = easing.match(/^[a-z]+/i).shift();
      const type = d3[funcName];
      transition.ease(type, args[0], args[1]);
    } else { // Use d3.easeEASINGNAME symbol
      const type = d3[easing];
      transition.ease(type);
    }

    svg.append('text')
      .text(easing)
      .attr('x', 10)
      .attr('y', y(easing) + 5);
  });
}

function timer() {
  const tChart = chartFactory();
  const position = (t) => {
    const a = 80;
    const b = 1;
    const c = 1;
    const d = 80;

    return {
      x: Math.cos(a * t) - Math.pow(Math.cos(b * t), 3),
      y: Math.sin(c * t) - Math.pow(Math.sin(d * t), 3),
    };
  };
  const tScale = d3.scaleLinear().domain([500, 25000]).range([0, 2 * Math.PI]);
  const x = d3.scaleLinear()
    .domain([-2, 2])
    .range([100, tChart.width - 100]);

  const y = d3.scaleLinear()
    .domain([-2, 2])
    .range([tChart.height - 100, 100]);

  const brush = tChart.container.append('circle').attr('r', 4);
  let previous = position(0);
  const step = (time) => {
    if (time > tScale.domain()[1]) {
      return true;
    }

    const t = tScale(time);
    const pos = position(t);

    brush
      .attr('cx', x(pos.x))
      .attr('cy', y(pos.y));

    tChart.container.append('line')
      .attr('x1', x(previous.x))
      .attr('y1', y(previous.y))
      .attr('x2', x(pos.x))
      .attr('y2', y(pos.y))
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.3);

    previous = pos;
  };
  d3.timer(step, 500);
}


animate();
//easing();
//timer();