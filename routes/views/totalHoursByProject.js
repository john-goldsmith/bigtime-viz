const keystone = require('keystone'),
      moment = require('moment'),
      d3Node = require('d3-node'),
      d3 = require('d3');

exports = module.exports = function (req, res) {

  const locals = res.locals;

  if (!req.query.project) {
    locals.bigTime.projectsPicklist()
      .then(
        response => {
          // req.cookies
          res.redirect(`?project=${response.body[0].Id}`);
        },
        err => {
          console.log('Error fetching projects picklist', err);
          res.redirect('/');
        }
      );
    return;
  }

  const d3n = new d3Node({
          d3Module: d3
        }),
        view = new keystone.View(req, res),
        reportId = process.env.BIGTIME_TOTAL_HOURS_BY_PROJECT_REPORT_ID,
        timeRanges = keystone.get('timeRanges'),
        selectedTimeRange = timeRanges.map(timeRange => timeRange.value).includes(req.query['time-range']) ? req.query['time-range'] : keystone.get('defaultTimeRange').value,
        selectedProject = req.query.project,
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
                 .y(d => y(d.hours)),
        svg = d3n.createSVG()
                 .attr('width', width + margin.left + margin.right)
                 .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                 .attr('transform', `translate(${margin.left}, ${margin.top})`);

  locals.timeRanges = timeRanges;
  locals.selectedTimeRange = selectedTimeRange;
  locals.selectedProject = selectedProject;

  res.cookie(`${keystone.get('namespace')}.lastSelectedTimeRange`, selectedTimeRange);
  res.cookie(`${keystone.get('namespace')}.lastSelectedProject`, selectedProject);

  const body = {
    DT_END: moment().format('YYYY-MM-DD'),
    PRJ_SID: selectedProject
  }

  if (selectedTimeRange.toLowerCase() === 'max') {
    body.DT_BEGIN = process.env.BIGTIME_TIME_RANGE_MAX_DATE;
  } else {
    const duration = selectedTimeRange.split('');
    body.DT_BEGIN = moment().subtract(Number(duration[0]), duration[1]).format('YYYY-MM-DD');
  }

  locals.bigTime.projectsPicklist()
    .then(
      response => {
        locals.projects = response.body;
        return locals.bigTime.updateReportById(reportId, body);
      }
    )
    .then(
      () => {
        return locals.bigTime.getReportById(reportId);
      }
    )
    .then(
      response => {
        let dateIndex = null,
            hoursIndex = null;
        response.body.FieldList.forEach((field, index) => {
          if (field.FieldNm === 'tmdt') dateIndex = index;
          if (field.FieldNm === 'tmhrsin') hoursIndex = index;
        });
        if (!response.body.Data) {
          view.render('total-hours-by-project');
          return;
        }
        let data = response.body.Data.map(item => ({date: item[dateIndex], hours: item[hoursIndex]}));
        data.forEach(d => {
          d.date = formatDate(d.date);
          d.hours = Number(d.hours);
        });
        x.domain(d3.extent(data, d => d.date));
        y.domain([0, d3.max(data, d => d.hours)]);

        svg.append('path')
           .data([data])
           .attr('class', 'line')
           .attr('d', line);

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
           .text('Hours');

        locals.svg = d3n.svgString();
        view.render('total-hours-by-project');
      }
    )
    .catch(
      err => {
        console.log('Error generating report.', err);
        res.redirect('/');
      }
    )

};
