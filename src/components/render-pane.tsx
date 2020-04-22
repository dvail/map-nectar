import * as React from 'react'
import { useRef, useEffect } from 'react'

import { useStore } from '../store'
import MapView, { MapViewType } from '../rendering/map-view'

export default function RenderPane() {
  let rotation = useStore(state => state.rotation)
  let viewAngle = useStore(state => state.viewAngle)
  let mapData = useStore(state => state.mapData)
  let selectedTileImage = useStore(state => state.selectedTileSprite)
  let selectedTileColor = useStore(state => state.selectedTileColor)

  let removeTile = useStore(state => state.removeTile)
  let updateTile = useStore(state => state.updateTile)
  let rotateClock = useStore(state => state.rotateClock)
  let rotateCounter = useStore(state => state.rotateCounter)
  let increaseAngle = useStore(state => state.increaseAngle)
  let decreaseAngle = useStore(state => state.decreaseAngle)

  const renderPaneRef = useRef<HTMLDivElement>(null)
  const mapDataRef = useRef(mapData)
  const mapViewRef: React.MutableRefObject<MapViewType> = useRef()

  useEffect(() => {
    let mapView = MapView({
      removeTile,
      updateTile,
      rotateClock,
      rotateCounter,
      increaseAngle,
      decreaseAngle,
    })
    mapViewRef.current = mapView
    mapViewRef.current.initialize(renderPaneRef.current)
  }, [])

  useEffect(() => {
    mapDataRef.current = mapData
    mapViewRef.current.setMapData(mapData)
  }, [mapData])

  useEffect(() => {
    mapViewRef.current.setSelectedTileColor(selectedTileColor)
  }, [selectedTileColor])

  useEffect(() => {
    mapViewRef.current.setSelectedTileImage(selectedTileImage)
  }, [selectedTileImage])

  useEffect(() => {
    mapViewRef.current.setRotation(rotation)
  }, [rotation])

  useEffect(() => {
    mapViewRef.current.setAngle(viewAngle)
  }, [viewAngle])

  /*
  useEffect(() => {
    if (shiftKey) {
      pixiViewport?.plugins.pause('drag')
    } else {
      pixiViewport?.plugins.resume('drag')
    }
  }, [shiftKey])
  */

  // NOTE: It is important that this `useEffect` runs first, so that the underlying
  // tilsets and textures are correct before rendering tiles from the mapData
  useEffect(() => {
    mapViewRef.current.loadTileSets(mapDataRef.current.tileSets)
  }, [mapData.tileSets])

  useEffect(() => {
    mapViewRef.current.renderTiles(mapDataRef.current.tiles)
  }, [mapData])

  return (
    <div ref={renderPaneRef} className='relative flex-1 h-full' onContextMenu={e => e.preventDefault()} />
  )
}
