const keystone = require('keystone'),
      moment = require('moment'),
      d3Node = require('d3-node'),
      d3 = require('d3'),
      utils = require('../../utils');

exports = module.exports = function (req, res) {

  const d3n = new d3Node({
          d3Module: d3
        }),
        view = new keystone.View(req, res),
        locals = res.locals,
        reportId = process.env.BIGTIME_TOTAL_HOURS_COMPANY_REPORT_ID,
        timeRanges = keystone.get('timeRanges'),
        selectedTimeRange = utils.getSelectedTimeRange(req),
        includeWeekends = utils.includeWeekends(req),
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
  locals.includeWeekends = includeWeekends;

  res.cookie(`${keystone.get('namespace')}.lastSelectedTimeRange`, selectedTimeRange);
  res.cookie(`${keystone.get('namespace')}.includeWeekends`, includeWeekends);
  
  const body = {
    DT_END: moment().format('YYYY-MM-DD')
  }

  if (selectedTimeRange.toLowerCase() === 'max') {
    body.DT_BEGIN = process.env.BIGTIME_TIME_RANGE_MAX_DATE;
  } else {
    const duration = selectedTimeRange.split('');
    body.DT_BEGIN = moment().subtract(Number(duration[0]), duration[1]).format('YYYY-MM-DD');
  }

  locals.bigTime.updateReportById(reportId, body)
    .then(
      () => {
        return locals.bigTime.getReportById(reportId)
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

        let data = null;
        if (!!includeWeekends) {
          data = response.body.Data.map(item => ({date: item[dateIndex], hours: item[hoursIndex]}));
        } else {
          data = response.body.Data.filter(item => {
            let day = moment(item[dateIndex]).format('ddd').toLowerCase();
            return (day !== 'sat' && day !== 'sun');
          }).map(item => ({date: item[dateIndex], hours: item[hoursIndex]}));
        }
        
        data.forEach(d => {
          d.date = formatDate(d.date);
          d.hours = Number(d.hours);
        });
        x.domain(d3.extent(data, d => d.date));
        y.domain([0, d3.max(data, d => d.hours)]);

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
           .attr('cy', d => y(d.hours))
           .append('title')
           .text(d => `${moment(d.date).format('dddd, MMMM Do YYYY')}\n${d.hours} hours`);

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
        view.render('total-hours-company');
      }
    )
    .catch(
      err => {
        console.log('Error generating report.', err);
        req.flash('error', 'Error generating report');
        res.redirect('index');
      }
    )

};
