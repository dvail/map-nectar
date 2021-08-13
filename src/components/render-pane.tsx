import * as React from 'react'
import { useRef, useEffect, useLayoutEffect } from 'react'

import { useStore } from '../store'
import MapView, { MapViewType } from '../rendering/map-view'

export default function RenderPane() {
  let rotation = useStore(state => state.rotation)
  let viewAngle = useStore(state => state.viewAngle)
  let mapData = useStore(state => state.mapData)
  let selectedTileImage = useStore(state => state.selectedTileSprite)
  let selectedTileColor = useStore(state => state.selectedTileColor)
  let shiftKey = useStore(state => state.shiftKey)

  let removeTile = useStore(state => state.removeTile)
  let updateTile = useStore(state => state.updateTile)
  let rotateClock = useStore(state => state.rotateClock)
  let rotateCounter = useStore(state => state.rotateCounter)
  let increaseAngle = useStore(state => state.increaseAngle)
  let decreaseAngle = useStore(state => state.decreaseAngle)

  const renderPaneRef = useRef<HTMLDivElement | null>(null)
  const mapDataRef = useRef(mapData)
  const mapViewRef: React.MutableRefObject<MapViewType | null> = useRef(null)

  useLayoutEffect(() => {
    if (renderPaneRef.current === null) {
      throw new Error("Main map view pane element is null!")
    }

    mapViewRef.current = MapView(renderPaneRef.current, mapData, {
      selectedTileColor,
      removeTile,
      updateTile,
      rotateClock,
      rotateCounter,
      increaseAngle,
      decreaseAngle,
    })
  }, [])

  useEffect(() => {
    mapDataRef.current = mapData
    mapViewRef.current?.setMapData(mapData)
  }, [mapData])

  useEffect(() => {
    mapViewRef.current?.setSelectedTileColor(selectedTileColor)
  }, [selectedTileColor])

  useEffect(() => {
    mapViewRef.current?.setSelectedTileImage(selectedTileImage)
  }, [selectedTileImage])

  useEffect(() => {
    mapViewRef.current?.setRotation(rotation)
  }, [rotation])

  useEffect(() => {
    mapViewRef.current?.setAngle(viewAngle)
  }, [viewAngle])

  useEffect(() => {
    if (shiftKey) {
      mapViewRef.current?.pauseDrag()
    } else {
      mapViewRef.current?.resumeDrag()
    }
  }, [shiftKey])

  // NOTE: It is important that this runs first, before MapView.renderTiles(), so that the underlying
  // tilesets and textures are correct before rendering tiles from the mapData
  useEffect(() => {
    mapViewRef.current?.loadTileSets(mapDataRef.current.tileSets)
  }, [mapData.tileSets])

  useEffect(() => {
    mapViewRef.current?.renderTiles(mapDataRef.current.tiles)
  }, [mapData])

  return (
    <div ref={renderPaneRef} className='relative flex-1 h-full' onContextMenu={e => e.preventDefault()} />
  )
}
