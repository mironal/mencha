import React from "react"
import _ from "lodash"

export default function MentalForm(props) {
  const { presetMentals, mental, onChange, onClickEvent, event } = props

  const options = _(presetMentals).entries()
    .reverse()
    .map(e => {
      return <option key={e[0]} value={e[0]}>{e[1]}</option>
    })
    .value()
  options.unshift(<option key="" value="" disabled={true}>選択してください</option>)

  return <form className="MentalForm">
    <select name="mental" value={mental} onChange={onChange}>
      {options}
    </select>
    <input name="event" type="text" value={event} onChange={onChange}/>
    <button className="submit" onClick={onClickEvent}>イベント</button>
  </form>
}
