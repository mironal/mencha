import React from "react"
import Helmet from "react-helmet"

import {
  signInGithub,
  signInTwitter,
} from "../helpers/auth"

import { syncDisplayName } from "../helpers/database"
import { firebaseConnect, observeAuth } from "../hocs/firebaseConnect"

function LoginPage(props) {

  const onClickSignIn = signInFunc => () => {
    signInFunc()
      .then(uc => syncDisplayName(uc.user) )
      .then(displayName => console.log("displayName updated!", displayName))
      .catch(error => console.error(error) )
  }

  return <div className="LoginPage">
    <Helmet title="mencha - login" />
    <button className="LoginButton" onClick={onClickSignIn(signInGithub)}>GitHub でログイン</button>
    <button className="LoginButton" onClick={onClickSignIn(signInTwitter)}>Twitter でログイン</button>
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
