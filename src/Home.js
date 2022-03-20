import React from 'react'
import { observer } from 'mobx-react-lite'

import './home.css'

import Tooltip from 'nanoether/Tooltip'
import Button from 'nanoether/Button'
import Checkbox from 'nanoether/Checkbox'
import UIContext from 'nanoether/interface'
import Textfield from 'nanoether/Textfield'

import EventCell from './components/EventCell'

const Spacer = () => <div style={{ width: '8px', height: '8px' }} />
const eventNames = [
  'UserSignedUp',
  'UserStateTransitioned',
  'AttestationSubmitted',
  'EpochEnded',
  'IndexedEpochKeyProof',
  'IndexedReputationProof',
  'IndexedUserSignedUpProof',
  'IndexedStartedTransitionProof',
  'IndexedProcessedAttestationsProof',
  'IndexedUserStateTransitionProof',
]

export default observer(() => {
  const ui = React.useContext(UIContext)
  const [logs, setLogs] = React.useState([])
  const [showingLogs, setShowingLogs] = React.useState(eventNames.reduce((acc, name) => ({
    [name]: true,
    ...acc,
  }), {}))
  React.useEffect(() => {
    fetch('/events')
      .then(r => r.json())
      .then(setLogs)
  }, [])
  return (
    <div className={`container ${ui.modeCssClass}`}>
      <div className={`header ${ui.modeCssClass}`}>
        <div className="header5">
          Unirep Op Window
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', margin: '8px'}}>
        <div className={`section-box ${ui.modeCssClass}`}>
          <div>A look at the events in the Unirep system.</div>
          <div style={{ width: '8px' }} />
          <Button size="xsmall" onClick={() => ui.setDarkmode(!ui.darkmode)}>
            {ui.darkmode ? 'Light' : 'Dark'}
          </Button>
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight: `${80*(eventNames.length/Math.ceil(ui.screenWidth/330))}px`,
        flexWrap: 'wrap'
      }}>
        {
          eventNames.map((n) => (
            <div style={{ display: 'flex', alignItems: 'center', width: '330px'}}>
              <Checkbox
                onChange={(enabled) => setShowingLogs({ ...showingLogs, [n]: enabled })}
                checked={showingLogs[n]}
              />
              <div>{n}</div>
              <Spacer />
            </div>
          ))
        }
      </div>
      <div className="section-components">
        {logs
          .filter(l => showingLogs[l.name])
          .map((l) => <EventCell event={l} />)}
      </div>
    </div>
  )
})
