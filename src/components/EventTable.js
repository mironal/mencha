import React from "react"
import _ from "lodash"

import moment from "moment"
import "moment-range"
moment.locale("ja")

export default function EventTable(props) {

  const { events, start, end } = props
  if (!events) {
    return null
  }

  const days = moment.range(start, end).toArray("days")

  const groupedEvents = _(events).entries()
    .map(e => Object.assign(e[1], {key: e[0]}, {dayStr: moment(e[1].created_at).format("MM/DD (dd)")}))
    .groupBy("dayStr")
    .value()

  const transposedEvents = (() => {
    const h = _.map(days, d => {
      const dayStr = d.format("MM/DD (dd)")
      return groupedEvents[dayStr] || []
    })

    return _.map(h, (a, i) => {
      return _.map(h, b => {
        return b[i]
      })
    })
  })()

  const head = _.map(days, d => <th key={`head_${d.valueOf()}`}>{d.format("MM/DD (dd)")}</th>)

  const body = _.map(transposedEvents, (a, i) => {

    const tds = _.map(a, (b, j) => {
      if (b) {
        return <td key={b.key}>{b.event}</td>
      } else {
        return <td key={`${i}-${j}`}></td>
      }
    })
    return <tr key={i}>
      {tds}
    </tr>
  })

  return <table>
    <thead>
      <tr>
        {head}
      </tr>
    </thead>
    <tbody>
      {body}
    </tbody>
  </table>
}
