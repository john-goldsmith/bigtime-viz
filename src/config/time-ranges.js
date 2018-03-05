const timeRanges = [
  {
    key: '1 week',
    value: '1w',
    disabled: false
  },
  {
    key: '1 month',
    value: '1M',
    disabled: false
  },
  {
    key: '3 months',
    value: '3M',
    disabled: false
  },
  {
    key: '6 months',
    value: '6M',
    disabled: false
  },
  {
    key: '1 year',
    value: '1y',
    disabled: false
  },
  {
    key: 'Max',
    value: 'max',
    disabled: false
  },
  {
    key: 'Custom',
    value: 'custom',
    disabled: true
  }
]

const defaultTimeRange = timeRanges.find(timeRange => timeRange.value === '1M') || timeRanges[0]

module.exports = {
  timeRanges,
  defaultTimeRange
}
