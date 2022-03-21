import React from 'react'
import EventCell from './EventCell'
import UIContext from 'nanoether/interface'
import { observer } from 'mobx-react-lite'
import './tx-cell.css'

const Spacer = () => <div style={{ width: '8px', height: '8px' }} />

export default observer(({
  hash,
  events,
}) => {
  const ui = React.useContext(UIContext)
  return (
    <div className={`tx-cell-outer ${ui.modeCssClass}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div
          className="header6"
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(`https://kovan-optimistic.etherscan.io/tx/${hash}`, '_blank')}
        >
          {hash.slice(0, 10)}{events.length > 1 ? ` - ${events.length} events` : ''}
        </div>
        <div>Block {+events[0].blockNumber}</div>
      </div>
      {
        events.map((event) => (
          <>
            <Spacer />
            <EventCell event={event} />
          </>
        ))
      }
    </div>
  )
})
