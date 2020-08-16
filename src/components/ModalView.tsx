/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { HideModalAction } from '../Actions'
import { DispatchContext } from '../App'

interface Props {
    foo?: any
}

export const ModalView: React.FunctionComponent<Props> = (props) => {
  const dispatch = useContext(DispatchContext)

  const close = () => {
    dispatch(HideModalAction())
  }

  return (
    <div id='modal-wrapper' onClick={close}>
      <div id='modal'>
        <button
          onClick={close}
          className="close"
          style={{ float: 'right', padding: '20px' }}
        >
            x
        </button>
        {props.children}
      </div>
    </div>
  )
}
