import 'jquery';
import 'bootstrap-datepicker';
import * as d3 from 'd3';
import moment from 'moment';
import BigTime from 'bigtime-sdk';
// import json from '../../data/test.js';

const bigTime = new BigTime({}),
      margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      formatDate = d3.timeParse('%d-%b-%y'),
      x = d3.scaleTime()
            .range([0, width]),
      y = d3.scaleLinear()
            .range([height, 0]),
      // xAxis = d3.svg.axis()
      //               .scale(x)
      //               .orient('bottom'),
      // yAxis = d3.svg.axis()
      //               .scale(y)
      //               .orient('left'),
      line = d3.line()
               .x(d => x(d.date))
               .y(d => y(d.close)),
      svg = d3.select('#demo')
              .append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// d3.json(json, (error, data) => {
  // if (error) throw error;

  json.forEach(d => {
    d.date = formatDate(d.date);
    d.close = +d.close;
  });

  x.domain(d3.extent(json, d => d.date));
  y.domain([0, d3.max(json, d => d.close)]);

  svg.append('path')
     .data([json])
     .attr('class', 'line')
     .attr('d', line);

  svg.append('g')
      // .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

  svg.append('g')
      // .attr('class', 'y axis')
      .call(d3.axisLeft(y));
      // .append('text')
      // .attr('transform', 'rotate(-90)')
      // .attr('y', 6)
      // .attr('dy', '.71em')
      // .style('text-anchor', 'end')
      // .text('Price ($)');
// });

$('.input-daterange').datepicker({});