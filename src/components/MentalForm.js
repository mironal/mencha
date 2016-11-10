import React from "react"
import _ from "lodash"
import MentalSelect from "./MentalSelect"

export default function MentalForm(props) {
  const { presetMentals, mental, onChange, onClickEvent, event } = props

  const options = _.entries(presetMentals)
    .reverse()
    .map(e => ({
      text: e[1],
      value: e[0]
    }))

  return <form className="MentalForm">
    <MentalSelect name="mental" onChange={onChange} options={options} value={mental} />
    <input name="event" type="text" value={event} onChange={onChange}/>
    <button className="submit" onClick={onClickEvent}>イベント</button>
  </form>
}
