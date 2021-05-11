import React from 'react'
import QueueItem from './QueueItem'

export default function Queue({ queue }) {

  return queue.map((item, index) => (
        <QueueItem
          item={item}
          index={index}
          key={item.uri}
        />
     ))

}
