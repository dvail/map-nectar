import produce from 'immer'

const UpdateTile = 'UpdateTile'
const actions = {};

const defaultActionFn = state => {
  console.warn('default action - this should not be called!')
  return state
}

export const MapDataAction = {
  UpdateTile,
}

export const tileKey = (q, r) => [q, r].toString()

export default function mapDataReducer(state, action) {
  const { type, data } = action
  const actionFn = actions[type] || defaultActionFn

  return actionFn(state, data)
}

actions.UpdateTile = (state, data) => produce(state, draftState => {
  let key = tileKey(data.q, data.r)
  draftState.tiles[key] = data
})
