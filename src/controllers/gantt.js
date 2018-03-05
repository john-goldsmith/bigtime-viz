const moment = require('moment'),
      d3Node = require('d3-node'),
      d3 = require('d3'),
      app = require('../config/express')

function index(req, res, next) {

  const locals = res.locals;

  if (!req.query.staff) {
    locals.bigTime.getStaffList() // TODO: staffPicklist()
      .then(
        response => {
          res.redirect(`?staff=${response.body[0].StaffSID}`);
        },
        err => {
          console.log('Error generating report.', err);
          // req.flash('error', 'Error generating report');
          res.redirect('/');
        }
      );
    return;
  }

  const d3n = new d3Node({
          d3Module: d3
        }),
        view = new keystone.View(req, res),
        reportId = process.env.BIGTIME_PERCENTAGE_REPORT_ID,
        timeRanges = keystone.get('timeRanges'),
        selectedTimeRange = timeRanges.map(timeRange => timeRange.value).includes(req.query['time-range']) ? req.query['time-range'] : keystone.get('defaultTimeRange').value,
        selectedStaff = req.query.staff,
        margin = {
          top: 20,
          right: 20,
          bottom: 30,
          left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom,
        x = d3.scaleBand()
              .range([0, width])
              .padding(0.1),
        y = d3.scaleLinear()
              .range([height, 0]),
        svg = d3n.createSVG()
                 .attr('width', width + margin.left + margin.right)
                 .attr('height', height + margin.top + margin.bottom + 100)
                 .append('g')
                 .attr('transform', `translate(${margin.left}, ${margin.top})`);

  locals.timeRanges = timeRanges;
  locals.selectedTimeRange = selectedTimeRange;
  locals.selectedStaff = selectedStaff;

  res.cookie(`${namespace}.lastSelectedTimeRange`, selectedTimeRange);
  res.cookie(`${namespace}.lastSelectedStaff`, selectedStaff);

  const body = {
    DT_END: moment().format('YYYY-MM-DD')
  }

  if (selectedTimeRange.toLowerCase() === 'max') {
    body.DT_BEGIN = process.env.BIGTIME_TIME_RANGE_MAX_DATE;
  } else {
    const duration = selectedTimeRange.split('');
    body.DT_BEGIN = moment().subtract(Number(duration[0]), duration[1]).format('YYYY-MM-DD');
  }

  Promise.all(
    [
      locals.bigTime.updateReportById(reportId, body),
      locals.bigTime.getStaffList()
    ]
  )
  .then(
    responses => {
      const staff = responses[1].body;
      locals.staff = staff;
      return locals.bigTime.getReportById(reportId)
    }
  )
  .then(
    response => {
      let projectIndex = null,
          hoursIndex = null;
      response.body.FieldList.forEach((field, index) => {
        if (field.FieldNm === 'tmprojectnm') projectIndex = index;
        if (field.FieldNm === 'tmhrsin') hoursIndex = index;
      });
      let data = [{project: 'Foo', hours: 1}];
      // let data = response.body.Data.map(item => ({project: item[projectIndex], hours: item[hoursIndex]}))
      //                              .sort((a, b) => {
      //                                if (a.hours > b.hours) return 1;
      //                                if (a.hours < b.hours) return -1;
      //                                return 0;
      //                              });
      data.forEach(d => {
        d.hours = Number(d.hours);
      });
      x.domain(data.map(d => d.project));
      y.domain([0, d3.max(data, d => d.hours)]);

      svg.append('g')
         .attr('class', 'grid')
         .call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(''));

      svg.selectAll('.bar')
         .data(data)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .attr('x', d => x(d.project))
         .attr('width', x.bandwidth())
         .attr('y', d => y(d.hours))
         .attr('height', d => height - y(d.hours));

      svg.append('g')
         .attr('transform', `translate(0, ${height})`)
         .call(d3.axisBottom(x))
         .selectAll('text')
         .attr('y', 10)
         .attr('x', -10)
         .attr('dy', '0.5em')
         .attr('transform', "rotate(-45)")
         .style('text-anchor', 'end');

      svg.append('g')
         .call(d3.axisLeft(y));

      svg.append('text')
         .attr('transform', 'rotate(-90)')
         .attr('y', 0 - margin.left)
         .attr('x', 0 - (height / 2))
         .attr('dy', '1em')
         .style('text-anchor', 'middle')
         .text('Hours');

      locals.svg = d3n.svgString();
      view.render('gantt');
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
