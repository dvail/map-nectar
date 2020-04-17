import * as React from 'react'
import { useState } from 'react'

import FileInput from './bricks/file-input'
import Button, { ButtonType } from './bricks/button'
import FaIcon from './fa-icon'
import { useStore } from '../store'

let { Weak, Action, Default } = ButtonType

export default function TileSetPane() {
  let [image, setImage] = useState(null)
  let [atlas, setAtlas] = useState(null)

  let mapData = useStore(state => state.mapData)
  let addMapTileSet = useStore(state => state.addMapTileSet)

  // TODO Clear file inputs as well
  function addNewTileSet() {
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
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => setImage(reader.result)
    reader.onerror = error => console.log('Error: ', error)
  }

  // TODO Error handling here
  // TODO Validation of incoming JSON format
  function onAtlasChange(e: React.ChangeEvent<HTMLInputElement>) {
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
            <FaIcon className='text-xl w-8' type='fa-file-upload' title='Load Image' />
            <span>Load Image</span>
          </FileInput>
        </Button>
        <Button type={atlas ? Default : Weak}>
          <FileInput onChange={onAtlasChange}>
            <FaIcon className='text-xl w-8' type='fa-file-upload' title='Load Atlas' />
            <span>Load Atlas</span>
          </FileInput>
        </Button>
        <Button disabled={!(image && atlas)} type={Action} onClick={addNewTileSet}>Add To Map</Button>
      </div>
      <ul className='flex flex-row'>
        {Object.entries(mapData.tileSets).map(([id, ts]) => (
          <li key={id}>
            <span>{id}</span>
            <span>{ts.meta.imageFileName}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
