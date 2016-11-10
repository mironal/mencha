import React from "react"
import _ from "lodash"

import "./EventForm.css"

export default function EventForm(props) {
  const { onChange, onClickEvent, event } = props

  return <div className="EventForm">
    <input name="event" type="text" value={event} onChange={onChange} />
    <button className="submit" onClick={onClickEvent}>Add</button>
  </div>
}
