import React from "react"
import _ from "lodash"

import "./MentalSelect.css"

export default function MentalSelect(props) {
  const { presetMentals, value, onChange, name } = props

  const options = _.entries(presetMentals)
    .reverse()
    .map(e => ({
      text: e[1],
      value: e[0]
    }))

  function onClickItem(item) {
    onChange({
      target: {
        name,
        value: item.value
      }
    })
  }

  return <div className="MentalSelect">
    {options.map(e =>
      <div
        className={`item${e.value === value ? " selected" : ""}`}
        onClick={() => onClickItem(e)}
        key={e.value}>{e.text}</div>
    )}
  </div>
}
