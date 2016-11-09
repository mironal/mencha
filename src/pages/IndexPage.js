import React, { Component } from 'react'

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts"

import { signIn, signOut } from "../helpers/auth"
import {
  syncDisplayName,
  addTeamEvent,
  setMental,
  //createTeam,
  joinTeam
} from "../helpers/database"

import { firebaseConnect, observe, observeAuth } from "../hocs/firebaseConnect"

import moment from "moment"
import "moment-range"
moment.locale("ja")

import "../App.css"

import _ from "lodash"

// 1〜の値に対して記号を付ける
const presetMentals = {
  1: "😲",
  2: "😫",
  3: "😐",
  4: "😀"
}

function EventTable(props) {

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

function MentalChart(props) {

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
    "#CEF6EC",
    "#F78181",
    "#ECF6CE",
    "#819FF7"
  ]

  const lines = _(d)
    .flatMap(d =>  _.keys(d) )
    .reject(k => k === "day")
    .uniq()
    .map((k, i) => <Line
      key={k}
      type="monotone"
      dataKey={k}
      connectNulls={true}
      stroke={colors[i%colors.length]}
      dot={false} />)
    .value()

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

function Form(props) {

  const { presetMentals, mental, onChange, onClickEvent, event } = props

  const options = _(presetMentals).entries()
    .reverse()
    .map(e => {
      return <option key={e[0]} value={e[0]}>{e[1]}</option>
    }).value()
  options.unshift(<option key="" value="" disabled={true}>選択してください</option>)

  return <form className="MentalForm">
    <select name="mental" value={mental} onChange={onChange}>
      {options}
    </select>
    <input name="event" type="text" value={event} onChange={onChange}/>
    <button type="button" onClick={onClickEvent}>イベント</button>
  </form>
}

function TopPage(props) {

  const {presetMentals, mentals, onChange, onClickEvent, mental, event, events, start, end } = props

  return <div className="TopPage">
    <Form
      presetMentals={presetMentals}
      mental={mental}
      onChange={onChange}
      onClickEvent={onClickEvent}
      event={event}
    />
    <div>
      <EventTable events={events} start={start} end={end} />
      <MentalChart mentals={mentals} start={start} end={end} />
    </div>
  </div>
}

TopPage.defaultProps = {
  mental: "",
  event: ""
}

function LoginPage(props) {

  return <div className="LoginPage">
    <button type="button" onClick={props.onClick}>ログイン</button>
  </div>
}

function TeamForm(props) {

  const { user, team_id, onChange, onClickJoinTeam, showId, onClickTeamID } = props

  if (user && user.team_id) {
    return <p onClick={onClickTeamID}>Team ID: {showId ? user.team_id : "*******"}, User name {showId ? user.displayName : "*******"}</p>
  } else {
    return <div>
      <input name="team_id" type="text" value={team_id} onChange={onChange} placeholder="Enter Team ID" />
      <button type="button" onClick={onClickJoinTeam}>チームに加わる</button>
    </div>
  }
}

TeamForm.defaultProps = {
  team_id: ""
}

class IndexPage extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.mentals = presetMentals
  }

  onClickSignIn() {
    signIn()
      .then( uc => {
        return syncDisplayName(uc.user)
      })
      .then(displayName => {
        console.log("displayName updated!", displayName)
      })
  }

  onClickSignOut() {
    signOut()
  }

  onClickEvent(e) {

    const { authUser, user } = this.props
    const { event } = this.state

    if (!authUser || !event || !user) {
      return
    }

    addTeamEvent({
      team_id: user.team_id,
      name: user.displayName,
      uid: authUser.uid,
      event
    })
      .then( () => {
        this.setState({event: ""})
        console.log("success")
      })
      .catch(error => {
        console.error(error)
      })
  }

  onChange(e) {

    if (e.target.name === "mental") {

      const { authUser, user } = this.props
      const  mental = e.target.value
      if (!authUser || !user || !mental) {
        return
      }

      setMental({
        team_id: user.team_id,
        name: user.displayName,
        uid: authUser.uid,
        mental
      })
        .then( () => {
          console.log("success")
        })
        .catch(error => {
          console.error(error)
        })
      return
    }

    this.setState({[e.target.name]: e.target.value})
  }

  onClickJoinTeam() {
    const team_id = this.state.team_id
    const authUser = this.props.authUser

    if (team_id && authUser) {
      joinTeam(authUser.uid, team_id)
        .then(() => {
          console.log("join team")
        })
        .catch(error => {
          console.error("error join team", error)
        })
    }
  }

  toggleTeamId() {
    this.setState({showId: !this.state.showId})
  }

  render() {

    const { authUser, mental, events, mentals, user } = this.props
    const { event, team_id, showId} = this.state

    const end = moment()
    const start = end.clone().add(-14, "d")

    // 面倒なのでとりあえずこのページで切り替える... (´･‿･｀)
    if (authUser) {
      return <div className="IndexPage">
        <TeamForm
          onClickTeamID={this.toggleTeamId.bind(this)}
          showId={showId}
          user={user}
          team_id={team_id}
          onChange={this.onChange.bind(this)}
          onClickJoinTeam={this.onClickJoinTeam.bind(this)} />
        <TopPage
          start={start}
          end={end}
          presetMentals={this.mentals}
          mental={mental}
          mentals={mentals}
          event={event}
          events={events}
          onChange={this.onChange.bind(this)}
          onClickEvent={this.onClickEvent.bind(this)}
        />
        <button type="button" onClick={this.onClickSignOut.bind(this)}>ログアウト</button>
      </div>
    } else {
      return <div className="IndexPage">
        <LoginPage onClick={this.onClickSignIn.bind(this)} />
      </div>
    }
  }
}

const mapFirebaseToProps = ownProps => {
  const { authUser, user } = ownProps
  const uid = authUser && authUser.uid
  const team_id = user && user.team_id

  const day = moment().format("YYYYMMDD")

  return {
    authUser: observeAuth(),
    user: observe("users/:uid", {uid: uid}, snap => snap.val()),
    mental: observe("team-mentals/:team_id/:day/:uid", {uid: uid, day, team_id}, snap => snap.exists() && snap.val().mental),
    mentals: observe("team-mentals/:team_id", {team_id: team_id}, snap => snap.val()),
    events: observe("team-events/:team_id", {team_id: team_id}, snap => snap.val())
  }
}

export default firebaseConnect(mapFirebaseToProps)(IndexPage)

