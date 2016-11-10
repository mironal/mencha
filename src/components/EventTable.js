import React from "react"
import _ from "lodash"

import moment from "moment"
import "moment-range"
moment.locale("ja")

import "./EventTable.css"

function EventItem(props) {
  const e = props.event
  return <div className="EventItem">
    <p className="content">{e.event}</p>
    <p className="name">{e.name}</p>
  </div>
}

export default function EventTable(props) {
  const { events, start, end } = props

  if (!events) {
    return null
  }

  const days = moment.range(start, end).toArray("days")

  const head = days.map(d =>
    <th key={d.valueOf()}>
      <p className="date">{d.format("MM/DD")}</p>
      <p className="dow">{d.format("dd")}</p>
    </th>
  )

  const eventsWithKey = _.entries(events).map(e => ({key: e[0], ...e[1]}))

  const columns = days.map(d => {
    // この日のイベント
    const eventsForDay = _.values(eventsWithKey).filter(e => moment(e.created_at).isSame(d, "day"))

    return <td key={d.valueOf()}>
      {eventsForDay.map(e => <EventItem event={e} key={e.key} />)}
    </td>
  })

  return <table className="EventTable">
    <thead>
      <tr>
        {head}
      </tr>
    </thead>
    <tbody>
      <tr>
        {columns}
      </tr>
    </tbody>
  </table>
}
