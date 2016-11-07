import firebase from "firebase"

export const signIn = () => {
  const provider = new firebase.auth.GithubAuthProvider()
  return firebase.auth().signInWithPopup(provider)
}

export const signOut = () => {
  return firebase.auth().signOut()
}

