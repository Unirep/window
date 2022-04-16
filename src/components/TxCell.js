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
        <div style={{ display: 'flex' }}>
          <div>Transaction <span style={{
            fontWeight: '600',
          }}>{hash.slice(0, 13)}</span></div>
          <div style={{ margin: '0px 8px'}}>|</div>
          <div>Events <span style={{ fontWeight: '600' }}>{events.length}</span></div>
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(`https://${events[0].goerli ? 'goerli' : 'kovan-optimistic'}.etherscan.io/tx/${hash}`, '_blank')}
        >
        Etherscan</div>
      </div>
      <div
        style={{
          // divider
          marginTop: '16px',
          marginBottom: '26px',
          width: 'calc(100% + 32px + 32px)',
          height: '1px',
          position: 'relative',
          left: '-32px',
          background: '#EAEEF0',
        }}
      />
      {events.map((event, i) => (
        <>
          <EventCell event={event} index={i} />
          {i < events.length - 1 ? <div style={{ height: '26px' }} /> : null}
        </>
      ))}
    </div>
  )
})
