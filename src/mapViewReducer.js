import produce from 'immer'

const RotateClock = 'RotateClock'
const RotateCounter = 'RotateCounter'
const SetRotation = 'SetRotation'
const IncreaseAngle = 'IncreaseAngle'
const DecreaseAngle = 'DecreaseAngle'
const SetAngle = 'SetAngle'

const actions = {};

const defaultActionFn = state => {
  console.warn('default action - this should not be called!')
  return state
}

export const RotationIncrement = 360 / 12
export const AngleIncrement = 0.05

export const MapViewAction = {
  RotateClock,
  RotateCounter,
  SetRotation,
  IncreaseAngle,
  DecreaseAngle,
  SetAngle,
}

export default function mapViewReducer(state, action) {
  const { type, data } = action
  const actionFn = actions[type] || defaultActionFn

  return actionFn(state, data)
}

actions.RotateClock = state => produce(state, draftState => {
  draftState.rotation += RotationIncrement
  draftState.rotation %= 360
})

actions.RotateCounter = state => produce(state, draftState => {
  draftState.rotation -= RotationIncrement
  draftState.rotation += 360 // Don't rotate below 0 degrees
  draftState.rotation %= 360
})

actions.SetRotation = (state, rotation) => produce(state, draftState => {
  draftState.rotation = rotation
})

actions.IncreaseAngle = state => produce(state, draftState => {
  draftState.viewAngle = Math.min(draftState.viewAngle + AngleIncrement, 1)
})

actions.DecreaseAngle = state => produce(state, draftState => {
  draftState.viewAngle = Math.max(0, draftState.viewAngle - AngleIncrement)
})

actions.SetAngle = (state, angle) => produce(state, draftState => {
  draftState.viewAngle = angle
})
