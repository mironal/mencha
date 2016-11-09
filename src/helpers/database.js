import firebase from "firebase"
import moment from "moment"

const rejectWithErrorMessage = msg => {
  return Promise.reject(new Error(msg))
}

export const syncDisplayName = (authUser) => {
  const { uid, displayName } = authUser

  if (!uid) {
    return rejectWithErrorMessage(`Invalid "uid"`)
  }
  if (!displayName) {
    return rejectWithErrorMessage(`Invalid "displayName"`)
  }

  return firebase.database()
    .ref("users")
    .child(uid)
    .update({displayName})
    .then(() => Promise.resolve(displayName))
}

export const addTeamEvent = (params) => {

  const {
    team_id,
    uid,
    name,
    event
  } = params

  if (!team_id) {
    return rejectWithErrorMessage(`Invalid "team_id"`)
  }
  if (!uid) {
    return rejectWithErrorMessage(`Invalid "uid"`)
  }
  if (!name) {
    return rejectWithErrorMessage(`Invalid "name"`)
  }
  if (!event) {
    return rejectWithErrorMessage(`Invalid "event"`)
  }

  return firebase.database()
    .ref("team-events")
    .child(team_id)
    .push({
      uid,
      name,
      event,
      created_at: firebase.database.ServerValue.TIMESTAMP
    })
}

export const setMental = (params, date = new Date()) => {

  const {
    team_id,
    uid,
    name,
    mental
  } = params

  if (!team_id) {
    return rejectWithErrorMessage(`Invalid "team_id"`)
  }
  if (!uid) {
    return rejectWithErrorMessage(`Invalid "uid"`)
  }
  if (!name) {
    return rejectWithErrorMessage(`Invalid "name"`)
  }
  if (!event) {
    return rejectWithErrorMessage(`Invalid "event"`)
  }

  const key = moment(date).format("YYYYMMDD")
  return firebase.database()
    .ref("team-mentals")
    .child(team_id)
    .child(key)
    .child(uid)
    .set({
      uid,
      name,
      mental,
      updated_at: firebase.database.ServerValue.TIMESTAMP
    })
}

export const createTeam = (uid, team_name) => {

  if (!uid) {
    return rejectWithErrorMessage(`Invalid "uid"`)
  }

  if (!team_name) {
    return rejectWithErrorMessage(`Invalid "team_name"`)
  }

  const id = firebase.database()
    .ref("team-metadata")
    .push()
    .key

  return firebase.database().ref("team-metadata")
    .child(id)
    .set({
      name: team_name,
      created_by_user_id: uid,
      created_at: firebase.database.ServerValue.TIMESTAMP,
      type: "private"
    })
}

export const joinTeam = (uid, team_id) => {

  if (!uid) {
    return rejectWithErrorMessage(`Invalid "uid"`)
  }
  if (!team_id) {
    return rejectWithErrorMessage(`Invalid "team_id"`)
  }

  const param = {
    [`users/${uid}/team_id`]: team_id,
    [`team-metadata/${team_id}/members/${uid}`]: true
  }
  return firebase.database().ref().update(param)
}

