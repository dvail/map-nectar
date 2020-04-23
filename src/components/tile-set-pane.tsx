import * as React from 'react'
import { useState } from 'react'

import FileInput from './bricks/file-input'
import Button, { ButtonType } from './bricks/button'
import Icon from './bricks/icon'
import { useStore, TileRegion } from '../store'

let { Weak, Action, Default } = ButtonType

export default function TileSetPane() {
  let [image, setImage] = useState<string | undefined>()
  let [atlas, setAtlas] = useState<{ [name: string]: TileRegion } | null>(null)

  let mapData = useStore(state => state.mapData)
  let addMapTileSet = useStore(state => state.addMapTileSet)

  // TODO Clear file inputs as well
  function addNewTileSet() {
    if (!image || !atlas) return

    addMapTileSet({
      image,
      atlas,
      // TODO Actually handle the file name saving here
      meta: {
        imageFileName: "TEST",
        atlasFileName: "TEST",
      },
    })
  }

  // TODO Error handling here
  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => setImage(reader.result as string)
    reader.onerror = error => console.log('Error: ', error)
  }

  // TODO Error handling here
  // TODO Validation of incoming JSON format
  function onAtlasChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    let reader = new FileReader()
    reader.readAsText(e.target.files[0])
    reader.onload = () => setAtlas(JSON.parse(reader.result as string))
    reader.onerror = error => console.log('Error: ', error)
  }

  return (
    <div>
      <div className='flex flex-row'>
        <Button type={image ? Default : Weak}>
          <FileInput onChange={onImageChange}>
            <Icon className='text-xl w-8' type='fa-file-upload' title='Load Image' />
            <span>Load Image</span>
          </FileInput>
        </Button>
        <Button type={atlas ? Default : Weak}>
          <FileInput onChange={onAtlasChange}>
            <Icon className='text-xl w-8' type='fa-file-upload' title='Load Atlas' />
            <span>Load Atlas</span>
          </FileInput>
        </Button>
        <Button disabled={!(image && atlas)} type={Action} onClick={addNewTileSet}>Add To Map</Button>
      </div>
      <ul className='flex flex-col mt-2 font-mono font-semibold'>
        {Object.entries(mapData.tileSets).map(([id, ts]) => (
          <li key={id} className='py-2 flex flex-row flex-grow justify-between items-center'>
            <span className='flex-shrink-0 px-2'>{id}</span>
            <span className='flex-shrink-0 px-2'>{ts.meta.imageFileName}</span>
            <div className='flex-grow h-16 bg-no-repeat bg-center bg-cover' style={{ backgroundImage: `url(${ts.image})` }} />
          </li>
        ))}
      </ul>
    </div>
  )
}
