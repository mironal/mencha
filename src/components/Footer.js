import React from "react"
import { signOut } from "../helpers/auth"
import { firebaseConnect, observe, observeAuth } from "../hocs/firebaseConnect"

function Footer(props) {
  function onClickLogout() {
    signOut()
      .then(() => props.router.push("/login"))
  }

  return <footer className="Footer">
    <ul className="left-menu">
      {props.user && <li>Team ID: {props.user.team_id}</li>}
      {props.authUser && <li onClick={onClickLogout}>Logout</li>}
    </ul>
  </footer>
}

const mapFirebaseToProps = ownProps => {
  const { authUser } = ownProps
  const uid = authUser && authUser.uid

  return {
    authUser: observeAuth(),
    user: observe("users/:uid", {uid}, snap => snap.val())
  }
}
export default firebaseConnect(mapFirebaseToProps)(Footer)
