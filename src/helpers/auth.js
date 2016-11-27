import firebase from "firebase"

export const initFirebaseIfNeeded = () => {
  if (firebase.apps.length > 0) {
    // 初期化済みなら何もしない
    return
  }

  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  }

  if (!config.apiKey) {
    throw new Error("API KEY not found. Please read README.md")
  }

  firebase.initializeApp(config)
}

export const isLoggedIn = () => {
  return firebase.apps.length > 0 && firebase.auth().currentUser
}

export const signInGithub = () => {
  const provider = new firebase.auth.GithubAuthProvider()
  return firebase.auth().signInWithPopup(provider)
}

export const signInTwitter = () => {
  const provider = new firebase.auth.TwitterAuthProvider()
  return firebase.auth().signInWithPopup(provider)
}

export const signOut = () => {
  return firebase.auth().signOut()
}

export const linkGithub = () => {
  const provider = new firebase.auth.GithubAuthProvider()
  return firebase.auth().currentUser.linkWithPopup(provider)
}

export const linkTwitter = () => {
  const provider = new firebase.auth.TwitterAuthProvider()
  return firebase.auth().currentUser.linkWithPopup(provider)
}

export const unlink = providerId => {
  return firebase.auth().currentUser.unlink(providerId)
}

