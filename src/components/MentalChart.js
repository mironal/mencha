import React from "react"
import _ from "lodash"

import moment from "moment"
import "moment-range"
moment.locale("ja")

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts"

import { presetMentals } from "../Config.js"

export default function MentalChart(props) {

  const { mentals, start, end } = props

  if (!mentals) {
    return null
  }

  const days = moment.range(start, end).toArray("days")

  const d = _.map(days, d => {
    const mm = _(mentals[d.format("YYYYMMDD")]).map(m => {
      return [[m.name], parseInt(m.mental, 10)]
    }).fromPairs().value()

    return Object.assign({day: d.format("MM/DD")}, mm)
  })

  const colors = [
    "#F6CECE",
    "#BEF781",
    "#ECF6CE",
    "#819FF7",
    "#CEF6EC",
    "#F78181"
  ]

  const users = _(d)
    .flatMap(d =>  _.keys(d) )
    .reject(k => k === "day")
    .uniq()
    .value()

  const lines = users
    .map((k, i) => <Line
      key={k}
      type="monotone"
      dataKey={k}
      connectNulls={true}
      stroke={colors[i/colors.length]}
      dot={false} />)

  const tickFormatter = (a) => {
    return presetMentals[a]
  }
  const labelFormatter = (a) => {
    return presetMentals[a]
  }

  return <div className="MentalChart">
    <ResponsiveContainer minHeight={300} >
      <LineChart data={d}
        margin={{top: 50, right: 40, left: 0, bottom: 0}}>
        <XAxis dataKey="day" />
        <YAxis tickFormatter={tickFormatter} />
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip formatter={labelFormatter} />
        <Legend />
        {lines}
      </LineChart>
    </ResponsiveContainer>
  </div>
}
