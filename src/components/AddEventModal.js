import React from "react"

import Modal from "react-modal"
import moment from "moment"

import "./AddEventModal.css"

function AddEventModal(props) {
  const {
    day,
    event,
    onSubmit,
    onClose,
    onChange
  } = props

  const submit = e => {
    e.preventDefault()
    onSubmit(day, event)
  }

  return <Modal
    className="AddEventModal"
    isOpen={!!day}
    onRequestClose={onClose}
    contentLabel="AddEventModal"
  >
    <div className="AddEvent">
      <h1>WHAT’S HAPPENING ! </h1>
      <h3>{moment(day).format("MM/DD (dd)")}</h3>
      <form onSubmit={submit}>
        <input autoFocus={true} name="event" type="text" value={event} onChange={onChange} placeholder="enter event here!!"/>
        <input name="add" type="submit" value="Add" />
      </form>
    </div>
  </Modal>
}

AddEventModal.defaultProps = {
  event: ""
}

export default AddEventModal
