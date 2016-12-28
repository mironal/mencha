import React from "react"

import Modal from "react-modal"

import "./ConfirmModal.css"

function ConfirmModal(props) {

  const {
    title,
    message,
    okButton,
    cancelButton,
    open,
    onCancel,
    onConfirm
  } = props

  return <Modal
    className="Modal"
    isOpen={open}
    onRequestClose={onCancel}
    contentLabel="ConfirmModal"
  >
    <div className="Confirm">
      <h1>{title || "title"}</h1>
      <p>{message || "message"}</p>
      <div className="Control">
        <button className="secondary" type="button" onClick={onCancel} >{cancelButton || "Cancel"}</button>
        <button type="button" onClick={onConfirm}>{okButton || "OK"}</button>
      </div>
    </div>
  </Modal>
}

export default ConfirmModal
