const keystone = require('keystone'),
      d3Node = require('d3-node'),
      d3 = require('d3'),
      d3n = new d3Node({
        selector: '#demo',
        container: '<div id="demo"></div>',
        d3Module: d3
      });

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res);
  let locals = res.locals;
  
  const margin = {
          top: 20,
          right: 20,
          bottom: 30,
          left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
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
        // svg = d3.select('#demo')
        //         .append('svg')
        //         .attr('width', width + margin.left + margin.right)
        //         .attr('height', height + margin.top + margin.bottom)
        //         .append('g')
        //         .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  locals.svg = d3n.svgString();

  // window.bigTimeData.forEach(d => {
  //   d.date = formatDate(d.date);
  //   d.hours = +d.hours;
  // });

  // x.domain(d3.extent(window.bigTimeData, d => d.date));
  // y.domain([0, d3.max(window.bigTimeData, d => d.hours)]);

  // svg.append('path')
  //    .data([window.bigTimeData])
  //    .attr('class', 'line')
  //    .attr('d', line);

  // svg.append('g')
  //     .attr('transform', `translate(0, ${height})`)
  //     .call(d3.axisBottom(x));

  // svg.append('g')
  //     .call(d3.axisLeft(y));

  // bigTime.createSession()
  //   .then(
  //     () => {
  //       return bigTime.getTimeSheetDateRange({
  //         StartDt: '2016-09-01',
  //         EndDt: '2016-09-30'
  //       });
  //     },
  //     () => {
  //       throw new Error('Error creating BigTime session');
  //     }
  //   )
  //   .then(
  //     res => {
  //       const bigTimeData = res.body.map(item => {
  //         return {
  //           date: item.Dt,
  //           hours: item.Hours_IN
  //         }
  //       });
  //       locals.bigTimeData = bigTimeData;
        // view.render('index');
  //     },
  //     err => console.log(err)
  //   );
    
  locals.bigTime.getStaffList()
    .then(
      response => {
        locals.staff = response.body;
        view.render('gantt');
      },
      () => {
        console.log('Error fetching staff list.');
        view.render('index');
      }
    );

};
