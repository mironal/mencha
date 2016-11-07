import React, { Component } from "react"
import firebase from "firebase"
import _ from "lodash"

function buildTemplate(template, params) {
  return template
    .split("/")
    .map(t => {
      const m = t.match(/:(.+)/)
      if (m) {
        return params[m[1]]
      }
      return t
    })
    .join("/")
}

class AuthQuery {
  isEqual(other) {
    return other instanceof AuthQuery
  }

  isValid() {
    return true
  }

  on(callback) {
    const { currentUser } = firebase.auth()
    if (currentUser) {
      callback(currentUser)
    }
    this.off = firebase.auth().onAuthStateChanged(user => {
      callback(user)
    })
  }
}

class Query {
  constructor(pathTemplate, params = {}, transform = x => x, refTransform = x => x) {
    this.pathTemplate = pathTemplate
    this.params = params
    this.transform = transform
    this.refTransform = refTransform
    this.off = null
  }

  isValid() {
    return _.every(this.params, p => !!p)
  }

  isEqual(other) {
    if (!other) {
      return false
    }
    return this.pathTemplate === other.pathTemplate && _.isEqual(this.params, other.params)
  }

  on(callback) {
    const path = buildTemplate(this.pathTemplate, this.params)
    const ref = this.refTransform(firebase.database().ref(path))
    const onValueChange = ref.on("value", snap => {
      callback(this.transform(snap))
    }, error => {
      console.error(error)
    })
    this.off = () => ref.off("value", onValueChange)
  }
}

class ConstantQuery {
  constructor(value) {
    this.value = value
  }

  isValid() {
    return !!this.value
  }

  isEqual(other) {
    return this === other
  }

  on(callback) {
    callback(this.value)
  }

  off() {}
}

function createQuery(arg) {
  if (arg instanceof Query || arg instanceof AuthQuery) {
    return arg
  }
  return new ConstantQuery(arg)
}

export const observe = (pathTemplate, params, transform, refTransform) => new Query(pathTemplate, params, transform, refTransform)
export const observeAuth = () => new AuthQuery()

export const firebaseConnect = (mapFirebaseToProps) => (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.firebaseQueries = {}
    }

    componentDidMount() {
      this.updateQueries(this.props)
    }

    updateQueries(props) {
      const map = mapFirebaseToProps({...props, ...this.state})
      const updates = _.entries(map)
        .map(e => {
          const key = e[0]
          return [key, createQuery(e[1])]
        })
        .filter(e => {
          const key = e[0]
          const query = e[1]
          const oldQuery = this.firebaseQueries[key]

          let shouldUpdate
          if (oldQuery) {
            shouldUpdate = query.isValid() && !query.isEqual(oldQuery)
          } else {
            shouldUpdate = query.isValid()
          }

          return shouldUpdate
        })

      updates.forEach(e => {
        const key = e[0]
        const query = e[1]
        const oldQuery = this.firebaseQueries[key]

        if (oldQuery) {
          oldQuery.off()
        }

        this.firebaseQueries[key] = query
      })

      // query.on が同期で実行される場合があるので最後にまとめて実行する
      updates.forEach(e => {
        const key = e[0]
        const query = e[1]
        query.on(val => {
          this.setState({ [key]: val })
          this.updateQueries(this.props)
        })
      })
    }

    componentWillReceiveProps(nextProps) {
      this.updateQueries(nextProps)
    }

    componentWillUnmount() {
      _.values(this.firebaseQueries).forEach(q => q.off())
    }

    render() {
      return <WrappedComponent {...Object.assign({}, this.props, this.state)} />
    }
  }
}
