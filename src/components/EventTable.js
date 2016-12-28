import React, { PropTypes } from "react"
import _ from "lodash"

import moment from "moment"
import "moment-range"
moment.locale("ja")

import "./EventTable.css"

function EventItem(props) {
  const e = props.event

  const remove = () => {
    props.onClickRemove(e)
  }

  return <div className="EventItem">
    <span className="remove" onClick={remove}>☓</span>
    <p className="content">{e.event}</p>
    <p className="name">{e.name}</p>
  </div>
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  onClickRemove: PropTypes.func.isRequired
}

function AddEventItem(props) {

  const onClick = () => {
    props.onClick(props.day)
  }

  return <div className="AddEventItem" onClick={onClick}>
    <p className="content">+</p>
  </div>
}

export default function EventTable(props) {
  const { events, start, end } = props

  if (!events) {
    return null
  }

  const days = moment.range(start, end).toArray("days")

  const head = days.map(d =>
    <div className="column" key={d.valueOf()}>
      <p className="date">{d.format("MM/DD")}</p>
      <p className="dow">{d.format("dd")}</p>
    </div>
  )

  const eventsWithKey = _.entries(events).map(e => ({key: e[0], ...e[1]}))

  const columns = days.map(d => {
    // この日のイベント
    const eventsForDay = _.values(eventsWithKey).filter(e => moment(e.created_at).isSame(d, "day"))

    return <div className="column" key={d.valueOf()}>
      {eventsForDay.map(e => <EventItem event={e} value={e.key} key={e.key} onClickRemove={props.onClickRemoveEvent} />)}
      <AddEventItem
        day={d.valueOf()}
        onClick={props.onClickAddEvent}
      />
    </div>
  })

  return <div className="EventTable">
    <div className="head">
      {head}
    </div>
    <div className="body">
      {columns}
    </div>
  </div>
}
