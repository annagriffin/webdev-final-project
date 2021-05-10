import React from 'react'
import QueueItem from './QueueItem'

export default function Queue({queue}) {
  return (
    <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {queue.map(item => (
           <QueueItem
           item={item}
           key={item.uri}
         />
        ))}
      </div>
  )
}
