import React, { Component } from "react"
import Helmet from "react-helmet"
import _ from "lodash"

import moment from "moment"
import "moment-range"
moment.locale("ja")

import {
  addTeamEvent,
  setMental,
  //createTeam,
  joinTeam
} from "../helpers/database"

import EventForm from "../components/EventForm"
import EventTable from "../components/EventTable"
import MentalChart from "../components/MentalChart"
import MentalSelect from "../components/MentalSelect"

import { firebaseConnect, observe, observeAuth } from "../hocs/firebaseConnect"
import { presetMentals } from "../Config.js"

function TopPage(props) {

  const {presetMentals, mentals, onChange, onClickEvent, mental, event, events, start, end } = props

  return <div className="TopPage">
    <h2>Select your today&#8217;s emoticon</h2>
    <MentalSelect
      name="mental"
      onChange={onChange}
      presetMentals={presetMentals}
      value={mental} />
    <h2>Events</h2>
    <div className="EventContainer">
      <EventTable events={events} start={start} end={end} />
    </div>
    <MentalChart mentals={mentals} start={start} end={end} />
    <h2>What&#8217;s Happening today?</h2>
    <EventForm
      onChange={onChange}
      onClickEvent={onClickEvent}
      event={event}
    />
  </div>
}

TopPage.defaultProps = {
  mental: "",
  event: ""
}

function TeamForm(props) {

  const { user, team_id, onChange, onClickJoinTeam, showId, onClickTeamID } = props

  if (user && user.team_id) {
    return <p onClick={onClickTeamID}>Team ID: {showId ? user.team_id : "*******"}, User name {showId ? user.displayName : "*******"}</p>
  } else {
    return <div>
      <input name="team_id" type="text" value={team_id} onChange={onChange} placeholder="Enter Team ID" />
      <button onClick={onClickJoinTeam}>チームに加わる</button>
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
    const { mental, events, mentals, user } = this.props
    const { event, team_id, showId} = this.state

    const end = moment()
    const start = end.clone().add(-14, "d")

    return <div className="IndexPage">
      <Helmet title="mencha" />
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
      <TeamForm
        onClickTeamID={this.toggleTeamId.bind(this)}
        showId={showId}
        user={user}
        team_id={team_id}
        onChange={this.onChange.bind(this)}
        onClickJoinTeam={this.onClickJoinTeam.bind(this)} />
    </div>
  }
}

const mapFirebaseToProps = ownProps => {
  const { authUser, user } = ownProps
  const uid = authUser && authUser.uid
  const team_id = user && user.team_id

  const day = moment().format("YYYYMMDD")

  return {
    authUser: observeAuth(),
    user: observe("users/:uid", {uid}, snap => snap.val()),
    mental: observe("team-mentals/:team_id/:day/:uid", {uid, day, team_id}, snap => snap.exists() && snap.val().mental),
    mentals: observe("team-mentals/:team_id", {team_id}, snap => snap.val()),
    events: observe("team-events/:team_id", {team_id}, snap => snap.val())
  }
}

export default firebaseConnect(mapFirebaseToProps)(IndexPage)
