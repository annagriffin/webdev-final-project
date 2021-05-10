import React from 'react'

export default function QueueItem({item}) {
  return (
    <div className="d-flex m-2 align-items-center">
      <img src={item.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
      <div>{item.title}</div>
      <div className="text-muted">{item.artist}</div>
        </div>
    </div>
  )
}
