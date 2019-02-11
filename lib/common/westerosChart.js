import * as d3 from 'd3';
import '../../styles/index.css';

import chartFactory, {
  fixateColors,
  addRoot,
  colorScale as color,
  tooltip,
  heightOrValueComparator,
  valueComparator,
} from './index';

const westerosChart = chartFactory({
  margin: {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
  }
});



westerosChart.loadData = async function loadData(uri) {
  if (uri.match(/\.csv$/)) {
    this.data = d3.csvParse(await (await fetch(uri)).text());
  } else if (uri.match(/\.json$/)) {
    this.data = await (await fetch(uri)).json();
  }
  return this.data;
};

westerosChart.init = function initChart(chartType, dataUri, ...args) {
  this.innerHeight = this.height - (this.margin.bottom + this.margin.top + (this.padding || 0) + 90);
  this.innerWidth = this.width - (this.margin.right + this.margin.left + (this.padding || 0));
  this.loadData(dataUri).then(data => this[chartType].call(this, data, ...args));
};

westerosChart.tree = function Tree(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros');
  const chart = this.container;

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);
  const root = stratify(data);

  const layout = d3.tree()
    .size([
      600,
      600,
    ]);

  const links = layout(root).descendants().slice(1);

  chart.selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d => `M${d.y},${d.x
               }C${(d.y + d.parent.y) / 2},${d.x
               } ${(d.y + d.parent.y) / 2},${d.parent.x
               } ${d.parent.y},${d.parent.x}`);

  // Nodes
  const node = chart.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  node.append('circle')
    .attr('r', 4.5)
    .attr('fill', d => color(d.name))
    .on('mouseover', function over() {
      d3.select(this.nextSibling).style('visibility', 'visible');
    })
    .on('mouseout', function out() {
      d3.select(this.nextSibling).style('visibility', 'hidden');
    });

  node.append('text')
    .classed('label', true)
    .attr('dy', '.31em')
    .attr('text-anchor', d => (d.x < 180 ? 'start' : 'end'))
    // .attr('transform', d => (d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)'))
    .text(d => (d.depth > 1 ? d.data.itemLabel : d.data.itemLabel.substr(0, 15) + (d.data.itemLabel.length > 15 ? '...' : '')))
    .style('font-size', d => (d.depth > 1 ? '0.6em' : '0.9em'))
    .style('visibility', d => (d.depth > 0 ? 'hidden' : 'visible'));
};

westerosChart.cluster = function Cluster(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros');
  const chart = this.container;

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);
  const root = stratify(data);


  const layout = d3.cluster()
    .size([500, 500]);

  const links = layout(root)
    .descendants()
    .slice(1);

  this.container.selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .classed('link', true)
    .attr('d', d => `M${d.y},${d.x
             }C${(d.y + d.parent.y) / 2},${d.x
             } ${(d.y + d.parent.y) / 2},${d.parent.x
             } ${d.parent.y},${d.parent.x}`);

  const node = this.container.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .classed('node', true)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  node.append('circle')
    .attr('r', 5)
    .attr('fill', d => color(d.data.itemLabel));

  node.append('text')
    .text(d => d.data.itemLabel);
  // .attr('dx', d => d.children.length ? -8 : 8)
  // .attr('dy', d => d.depth > 1 ? 3 : 5)
  // .attr('text-anchor', d => d.children.length ? 'end' : 'start')
  // .style('font-size', d => d.depth > 1 ? '0.8em' : '1.1em');
};

westerosChart.treemap = function Treemap(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros')
    .map((d, i, a) => {
      if (d.fatherLabel === 'Westeros') {
        const childrenLen = a.filter(e => e.fatherLabel === d.itemLabel).length;
        return childrenLen > 0 ? d : undefined;
      } else {
        return d;
      }
    })
    .filter(i => i);

  fixateColors(data, 'itemLabel');

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);

  const root = stratify(data)
    .sum(d => d.screentime)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  const layout = d3.treemap()
    .size([600, 600])
    .padding(2)
    .round(true);

  layout(root);

  const nodes = this.container.selectAll('.node')
    .data(root.descendants().slice(1))
    .enter()
    .append('g')
    .attr('class', 'node');

  nodes.append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.itemLabel);
    });

  nodes.call(tooltip(d => d.data.itemLabel, this.container));
};

westerosChart.partition = function Partition(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros')
    .map((d, i, a) => {
      if (d.fatherLabel === 'Westeros') {
        const childrenLen = a.filter(e => e.fatherLabel === d.itemLabel).length;
        return childrenLen > 0 ? d : undefined;
      } else {
        return d;
      }
    })
    .filter(i => i);

  fixateColors(data, 'itemLabel');

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);

  const root = stratify(data)
    .sum(d => d.screentime)
    .sort(heightOrValueComparator);

  const layout = d3.partition()
    .size([600, 600])
    .padding(2)
    .round(true);

  layout(root);

  const nodes = this.container.selectAll('.node')
    .data(root.descendants().slice(1))
    .enter()
    .append('g')
    .attr('class', 'node');

  nodes.append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.itemLabel);
    });

  nodes.call(tooltip(d => d.data.itemLabel, this.container));
};

westerosChart.pack = function Pack(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros')
    .map((d, i, a) => {
      if (d.fatherLabel === 'Westeros') {
        const childrenLen = a.filter(e => e.fatherLabel === d.itemLabel).length;
        return childrenLen > 0 ? d : undefined;
      } else {
        return d;
      }
    })
    .filter(i => i);

  fixateColors(data, 'itemLabel');

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);

  const root = stratify(data)
    .sum(d => d.screentime)
    .sort(valueComparator);

  const layout = d3.pack()
    .size([600, 600])
  layout(root);

  const nodes = this.container.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .attr('fill', (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.itemLabel);
    });

  nodes.call(tooltip(d => d.data.itemLabel, this.container));
};



export default westerosChart;