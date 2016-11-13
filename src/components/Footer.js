import React from "react"
import { withRouter, Link } from "react-router"
import { signOut } from "../helpers/auth"
import { firebaseConnect, observe, observeAuth } from "../hocs/firebaseConnect"

import "./Footer.css"

function Footer(props) {
  function onClickLogout() {
    signOut()
      .then(() => props.router.push("/login"))
  }

  return <footer className="Footer">
    <ul className="left-menu">
      {props.user && <li>User: {props.user.displayName}</li>}
      {props.team && <li>Team: {props.team.name}</li>}
      {props.team && <li>Team ID: {props.team.team_id}</li>}
      {props.user && <li><Link to="settings">Settings</Link></li>}
      {props.authUser && <li><a onClick={onClickLogout}>Logout</a></li>}
    </ul>
  </footer>
}

const mapFirebaseToProps = ownProps => {
  const { authUser, user } = ownProps
  const uid = authUser && authUser.uid
  const team_id = user && user.team_id

  return {
    authUser: observeAuth(),
    user: observe("users/:uid", {uid}, snap => snap.val()),
    team: observe("team-metadata/:team_id", {team_id}, snap => snap.exists() && Object.assign(snap.val(), {team_id: snap.key}))
  }
}

export default withRouter(firebaseConnect(mapFirebaseToProps)(Footer))
