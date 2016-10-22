import $ from 'jquery';
import 'bootstrap'
import 'bootstrap-datepicker';

$('.input-daterange').datepicker({});

$('#time-range').on('change', event => {
  window.location.search = `timeRange=${event.target.value}`
});
