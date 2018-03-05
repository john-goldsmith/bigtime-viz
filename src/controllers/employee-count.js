const moment = require('moment'),
      d3Node = require('d3-node'),
      d3 = require('d3'),
      bigTime = require('../config/bigtime')

function index(req, res, next) {

  const locals = res.locals,
        d3n = new d3Node({
          d3Module: d3
        }),
        // view = new keystone.View(req, res),
        reportId = process.env.BIGTIME_TOTAL_HOURS_BY_PROJECT_REPORT_ID,
        margin = {
          top: 20,
          right: 20,
          bottom: 30,
          left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom,
        formatDate = d3.timeParse('%Y-%m-%d'),
        x = d3.scaleTime()
              .range([0, width]),
        y = d3.scaleLinear()
              .range([height, 0]),
        line = d3.line()
                 .x(d => x(d.date))
                 .y(d => y(d.count)),
        svg = d3n.createSVG()
                 .attr('width', width + margin.left + margin.right)
                 .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                 .attr('transform', `translate(${margin.left}, ${margin.top})`);


  bigTime.getStaffList()
    .then(
      response => {
        let data = response.body.map(item => ({date: item.Start_dt, name: `${item.FName} ${item.SName}`}))
                                .filter(item => !!item.date)
                                .sort((previous, current) => new Date(previous.date) - new Date(current.date));
        data.forEach((item, index) => item.count = index);
        data.forEach(d => {
          d.date = formatDate(d.date);
          d.count = Number(d.count);
        });
        x.domain(d3.extent(data, d => d.date));
        y.domain([0, d3.max(data, d => d.count)]);

        svg.append('g')
           .attr('class', 'grid')
           .attr('transform', `translate(0,${height})`)
           .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(''));

        svg.append('g')
           .attr('class', 'grid')
           .call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(''));

        svg.append('path')
           .data([data])
           .attr('class', 'line')
           .attr('d', line);

        svg.selectAll('dot')
           .data(data)
           .enter()
           .append('circle')
           .attr('class', 'dot')
           .attr('r', 3)
           .attr('cx', d => x(d.date))
           .attr('cy', d => y(d.count))
           // .attr('data-toggle', 'popover')
           // .attr('title', 'Title')
           // .attr('data-content', 'This is some content')
           // .attr('data-name', d => d.name)
           // .attr('data-count', d => d.count)
           // .attr('data-date', d => d.date)
           .append('title')
           .text(d => `Employee #${d.count}: ${d.name}\n${moment(d.date).format('dddd, MMMM Do YYYY')}`);

        svg.append('g')
           .attr('transform', `translate(0, ${height})`)
           .call(d3.axisBottom(x));

        svg.append('g')
           .call(d3.axisLeft(y));

        svg.append('text')
           .attr('transform', `translate(${width / 2}, ${height + margin.top + 10})`)
           .style('text-anchor', 'middle')
           .text('Time');

        svg.append('text')
           .attr('transform', 'rotate(-90)')
           .attr('y', 0 - margin.left)
           .attr('x', 0 - (height / 2))
           .attr('dy', '1em')
           .style('text-anchor', 'middle')
           .text('Employees');

        locals.svg = d3n.svgString();
        // view.render('employee-count');
        res.render('pages/employee-count', locals)
      }
    )
    .catch(
      err => {
        console.log('Error generating report.', err);
        // req.flash('error', 'Error generating report');
        res.redirect('/');
      }
    )

};

module.exports = {
  index
}
