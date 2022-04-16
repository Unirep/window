import React from 'react'
import { observer } from 'mobx-react-lite'

import './home.css'

import Tooltip from 'nanoether/Tooltip'
import Button from 'nanoether/Button'
import Checkbox from 'nanoether/Checkbox'
import UIContext from 'nanoether/interface'
import Textfield from 'nanoether/Textfield'

import TxCell from './components/TxCell'
import EventContext from './contexts/events'
import FilterBox from './components/FilterBox'

const Spacer = () => <div style={{ width: '8px', height: '8px' }} />

export default observer(() => {
  const ui = React.useContext(UIContext)
  const events = React.useContext(EventContext)
  const [showingLogs, setShowingLogs] = React.useState({})
  return (
    <div className={`container ${ui.modeCssClass}`}>
      <div className={`header ${ui.modeCssClass}`}>
        <img src={require('../assets/logo.svg')} />
        <div className="app-button" onClick={() => window.open('https://unirep.social')}>
          <div className="app-button-text">App →</div>
        </div>
      </div>
      <div style={{ height: '48px' }} />
      <div style={{ color: '#070707', fontSize: '32px', fontWeight: '600' }}>
        Attester ID 1
      </div>
      <Spacer />
      <div style={{ color: '#070707', fontSize: '24px', fontWeight: '600' }}>
        A look at the events in the UniRep system
      </div>
      <div style={{ height: '40px' }} />
      <FilterBox updateVisibleLogs={(visible) => setShowingLogs(visible)} />
      <div className="section-components">
        {Object.entries(events.logsByTxHash)
          .map(([hash, logs]) => [hash, logs.filter(l => showingLogs[l.name])])
          .filter(([hash, logs]) => logs.length > 0)
          .map(([hash, logs]) => <TxCell hash={hash} events={logs} />)}
      </div>
    </div>
  )
})
