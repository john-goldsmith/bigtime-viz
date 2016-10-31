const keystone = require('keystone'),
      d3Node = require('d3-node'),
      d3 = require('d3'),
      moment = require('moment'),
      utils = require('../../utils');

exports = module.exports = function (req, res) {

  const locals = res.locals;

  if (!req.query.staff) {
    locals.bigTime.getStaffList() // TODO: staffPicklist()
      .then(
        response => {
          res.redirect(`?staff=${response.body[0].StaffSID}`);
        },
        err => {
          console.log('Error generating report.', err);
          req.flash('error', 'Error generating report');
          res.redirect('/');
        }
      );
    return;
  }

  const view = new keystone.View(req, res),
        d3n = new d3Node({
          d3Module: d3
        }),
        d3n2 = new d3Node({
          d3Module: d3
        }),
        reportId = process.env.BIGTIME_PERCENTAGE_REPORT_ID,
        timeRanges = keystone.get('timeRanges'),
        selectedTimeRange = utils.getSelectedTimeRange(req),
        selectedStaff = utils.getSelectedStaff(req),
        // donutWidth = 75,
        // legendRectSize = 18,
        // legendSpacing = 4,
        margin = {
          top: 20,
          right: 20,
          bottom: 30,
          left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2,
        color = d3.scaleOrdinal(d3.schemeCategory20c),
        x = d3.scaleBand()
              .range([0, width])
              .padding(0.1),
        y = d3.scaleLinear()
              .range([height, 0]),
        svg = d3n.createSVG()
                 .attr('width', width + margin.left + margin.right)
                 .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                 .attr('transform', `translate(${margin.left}, ${margin.top})`),
        svg2 = d3n2.createSVG()
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', `translate(${width / 2}, ${height / 2})`),
        arc = d3.arc()
                // .innerRadius(radius - donutWidth)
                .innerRadius(0)
                .outerRadius(radius);

  locals.timeRanges = timeRanges;
  locals.selectedTimeRange = selectedTimeRange;
  locals.selectedStaff = selectedStaff;
  res.cookie(`${keystone.get('namespace')}.lastSelectedTimeRange`, selectedTimeRange);
  res.cookie(`${keystone.get('namespace')}.lastSelectedStaff`, selectedStaff);

  const body = {
    DT_END: moment().format('YYYY-MM-DD'),
    STAFF_SID: selectedStaff
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
      locals.total = response.body.Data.map(item => item[hoursIndex])
                                       .reduce((previous, current) => previous + current);
      let data = response.body.Data.map(item => ({project: item[projectIndex], hours: item[hoursIndex], percentage: Math.round((item[hoursIndex] / locals.total) * 100)}))
                                   .sort((a, b) => {
                                     if (a.hours > b.hours) return 1;
                                     if (a.hours < b.hours) return -1;
                                     return 0;
                                   });
      locals.percentages = response.body.Data.map(item => ({project: item[projectIndex], percentage: Math.round((item[hoursIndex] / locals.total) * 100)}))

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
         .attr('height', d => height - y(d.hours))
         .append('title')
         .text(d => `${d.project}\n${d.hours} hours\n${d.percentage}%`);

      svg.append('g')
         .attr('transform', `translate(0, ${height})`)
         .call(d3.axisBottom(x))
         .selectAll('text')
         .attr('y', 10)
         .attr('x', -10)
         .attr('dy', '0.5em')
         .attr('transform', 'rotate(-45)')
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

      const pie = d3.pie()
                    .value(d => d.hours);

      const path = svg2.selectAll('path')
                       .data(pie(data))
                       .enter()
                       .append('path')
                       .attr('d', arc)
                       .attr('fill', (d, i) => color(d.data.project))
                       .append('title')
                       .text(d => `${d.data.project}\n${d.data.hours} hours\n${d.data.percentage}%`);

      // const legend = svg2.selectAll('.legend')
      //                    .data(color.domain())
      //                    .enter()
      //                    .append('g')
      //                    .attr('class', 'legend')
      //                    .attr('transform', (d, i) => {
      //                      const height = legendRectSize + legendSpacing,
      //                            offset = height * color.domain().length / 2,
      //                            horizontal = -2 * legendRectSize,
      //                            vertical = i * height - offset;
      //                      return `translate(${horizontal}, ${vertical})`
      //                    });

      // legend.append('rect')
      //       .attr('width', legendRectSize)
      //       .attr('height', legendRectSize)
      //       .style('fill', color)
      //       .style('stroke', color);

      // legend.append('text')
      //       .attr('x', legendRectSize + legendSpacing)
      //       .attr('y', legendRectSize - legendSpacing)
      //       .text(d => d);

      locals.svg = d3n.svgString();
      locals.svg2 = d3n2.svgString();
      view.render('percentage');
    }
  )
  .catch(
    err => {
      console.log('Error generating report.', err);
      req.flash('error', 'Error generating report');
      res.redirect('/');
    }
  );

};
