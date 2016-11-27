import React, { Component } from "react"
import Helmet from "react-helmet"
import { firebaseConnect, observe, observeAuth } from "../hocs/firebaseConnect"

import {
  createTeam,
  joinTeam,
  syncTeamName,
  selectTeam,
  syncMemberName
} from "../helpers/database"

import {
  linkGithub,
  linkTwitter,
  unlink
} from "../helpers/auth"

import _ from "lodash"

import "./SettingsPage.css"

function SettingsForm(props) {
  const {
    teamId,
    teamName,
    selectedTeamId,
    teams,
    onChange,
    onClickCreateTeam,
    onClickJoinTeam,
    disabled
  } = props

  const opts = _(teams)
    .entries()
    .map(e => <option key={e[0]} value={e[0]}>{_.isString(e[1]) ? e[1] : e[0]}</option>)
    .value()

  return (
    <div className="SettingsForm">
      <ul>
        <li>
          <input name="teamId" type="text" value={teamId} onChange={onChange} disabled={disabled} placeholder="Enter team ID" />
          <button className="submit" onClick={onClickJoinTeam} disabled={disabled}>Join team</button>
        </li>
        <li>
          <input name="teamName" type="text" value={teamName} onChange={onChange} disabled={disabled} placeholder="Enter team name" />
          <button className="submit" onClick={onClickCreateTeam} disabled={disabled} >Create team</button>
        </li>
        <li>
          <label>Team</label>
          <select name="selectedTeamId" value={selectedTeamId} onChange={onChange}>
            {opts}
          </select>
        </li>
      </ul>
    </div>
  )
}

SettingsForm.defaultProps = {
  teamId: "",
  teamName: ""
}

class SettingsPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      disabled: false
    }
  }

  componentWillUpdate(nextProps, nextState) {

    const { user } = this.props
    const { team } = nextProps

    // database のマイグレーション

    if (user && team && user.teams[team.team_id] && team.members[user.uid]) {

      if (_.isBoolean(user.teams[team.team_id])) {
        // true のところをチーム名に上書き
        syncTeamName(user.uid, team.team_id, team.name)
          .then(() => {
            console.log("team name updated", team.team_id, team.name)
          })
          .catch(error => { console.error(error) })
      }

      if (_.isBoolean(team.members[user.uid]) && user.displayName) {
        // true のところを displayName に上書き
        syncMemberName(team.team_id, user.uid, user.displayName)
          .then(() => {
            console.log("member name updated", team.team_id, user.displayName)
          })
          .catch(error => { console.error(error) })
      }
    }
  }

  onChange(e) {

    if (e.target.name === "selectedTeamId") {

      const team_id = e.target.value
      const { user } = this.props
      if (user) {
        selectTeam(user.uid, team_id)
          .catch(error => { console.error(error) })
      }
    }
    this.setState({[e.target.name]: e.target.value})
  }

  onClickCreateTeam(e) {

    const { authUser } = this.props
    const { teamName } = this.state

    if (!authUser || !teamName) {
      return
    }

    const uid = authUser.uid

    this.setState({disabled: true})
    createTeam(uid, teamName)
      .then(id => joinTeam(uid, id))
      .then(() => {
        this.setState({
          disabled: false,
          teamName: ""
        })
      })
      .catch(error => {
        this.setState({disabled: false})
        console.error(error)
      })
  }

  onClickJoinTeam(e) {

    const { authUser } = this.props
    const { teamId } = this.state

    if (!authUser || !teamId) {
      return
    }

    const uid = authUser.uid

    this.setState({disabled: true})
    joinTeam(uid, teamId)
      .then(() => {
        this.setState({
          disabled: false,
          teamId: ""
        })
        console.log(`success join team: ${teamId}`)
      })
      .catch(error => {
        this.setState({disabled: false})
        console.error(error)
      })
  }

  render() {

    const { user, authUser } = this.props
    const { teamName, teamId, selectedTeamId, disabled } = this.state

    if (!user || !authUser) {
      return null
    }

    const onClickLink = linkFunc => () => {
      this.setState({disabled: true})
      linkFunc()
        .then(() => this.setState({disabled: false}))
        .catch(error => console.error(error))
    }

    const onClickUnlink = providerId => () => {
      unlink(providerId)
        .then(() => this.setState({disabled: false}))
        .catch(error => console.error(error))
    }

    const mapProviderIdToLinkButton = {
      "twitter.com": <button key="link-twitter" className="LoginButton" onClick={onClickLink(linkTwitter)}>Twitter でもログインできるようにする</button>,
      "github.com": <button key="link-github" className="LoginButton" onClick={onClickLink(linkGithub)}>Github でもログインできるようにする</button>
    }
    const mapProviderIdToUnLinkButton = {
      "twitter.com": <button key="unlink-twitter" className="LoginButton" onClick={onClickUnlink("twitter.com")}>Twitter との連携を解除する</button>,
      "github.com": <button key="unlink-github" className="LoginButton" onClick={onClickUnlink("github.com")}>Github との連携を解除する</button>
    }

    const loginButtons = _.map(["github.com", "twitter.com"], providerId => {
      // link or unlink
      if (_.some(authUser.providerData, p => p.providerId === providerId)) {

        // 全てのサービスから連携解除はできないようにする
        if (authUser.providerData.length === 1) {
          return null
        }
        return mapProviderIdToUnLinkButton[providerId]
      } else {
        return mapProviderIdToLinkButton[providerId]
      }
    })

    return (
      <div className="SettingsPage">
        <Helmet title="mencha" />
        <SettingsForm
          selectedTeamId={selectedTeamId || user.team_id}
          teams={user.teams}
          teamId={teamId}
          teamName={teamName}
          onChange={this.onChange.bind(this)}
          onClickJoinTeam={this.onClickJoinTeam.bind(this)}
          onClickCreateTeam={this.onClickCreateTeam.bind(this)}
          disabled={disabled}
        />
        {loginButtons}
      </div>
    )
  }
}

const mapFirebaseToProps = ownProps => {
  const { authUser, user } = ownProps
  const uid = authUser && authUser.uid
  const team_id = user && user.team_id

  return {
    authUser: observeAuth(),
    user: observe("users/:uid", {uid}, snap => snap.exists() && Object.assign(snap.val(), {uid: snap.key})),
    team: observe("team-metadata/:team_id", {team_id}, snap => snap.exists() && Object.assign(snap.val(), {team_id: snap.key}))
  }
}

export default firebaseConnect(mapFirebaseToProps)(SettingsPage)

