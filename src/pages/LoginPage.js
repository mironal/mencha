import React from "react"
import Helmet from "react-helmet"

import { signIn } from "../helpers/auth"
import { syncDisplayName } from "../helpers/database"
import { firebaseConnect, observeAuth } from "../hocs/firebaseConnect"

function LoginPage(props) {
  const onClickSignIn = () => {
    signIn()
      .then(uc => {
        return syncDisplayName(uc.user)
      })
      .then(displayName => {
        console.log("displayName updated!", displayName)
      })
  }
  return <div className="LoginPage">
    <Helmet title="mencha - login" />
    <button onClick={onClickSignIn}>ログイン</button>
  </div>
}

const mapFirebaseToProps = ownProps => {
  const { authUser, router } = ownProps

  // ログインしていたらリダイレクトする
  if (authUser) {
    router.push("/")
  }

  return {
    authUser: observeAuth()
  }
}

export default firebaseConnect(mapFirebaseToProps)(LoginPage)
