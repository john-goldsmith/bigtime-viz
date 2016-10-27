import jQuery from 'jquery';
// import jQuery from 'jquery';
// const jQuery = require('jquery');
// const $ = jQuery;
// window.$ = $;
// window.jQuery = jQuery;
// window.jQuery = window.$ = jQuery;

import 'bootstrap-sass';
import 'bootstrap-datepicker';
// import * as d3 from 'd3';

jQuery('.input-daterange').datepicker({});
jQuery('[data-toggle="popover"]').tooltip({
  trigger: 'hover'
});

// const svg = d3.select('svg'),
//       tooltip = d3.select('#tooltip');

// svg.selectAll('.dot')
//    .on('mouseover', () => {
//      tooltip//.transition()
//             //.duration(200)
//             //.style('opacity', .9)
//             // .style('display', 'block')
//             // .style('position', 'absolute')
//      /*tooltip*/.html(`<strong>${d3.event.target.attributes.getNamedItem('data-name').value}</strong>`) //${formatTime(d.date)}   ${d.count}
//             .style('left', `${d3.event.pageX}px`)
//             .style('top', `${d3.event.pageY - 28}px`);
//    })
//    .on('mouseout', () => {
//      tooltip.style('display', 'none');
//    })
