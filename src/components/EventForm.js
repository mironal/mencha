import React from "react"
import _ from "lodash"

import "./EventForm.css"

export default function EventForm(props) {
  const { onChange, onClickEvent, event } = props

  const submit = e => {
    e.preventDefault()
  }

  return <form className="EventForm" onSubmit={submit}>
    <input name="event" type="text" value={event} onChange={onChange} />
    <input type="submit" name="add" value="Add" onClick={onClickEvent} />
  </form>
}
