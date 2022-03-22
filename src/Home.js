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
  'SocialUserSignedUp',
  'PostSubmitted',
  'CommentSubmitted',
  'VoteSubmitted',
  'AirdropSubmitted'
]

export default observer(() => {
  const ui = React.useContext(UIContext)
  const events = React.useContext(EventContext)
  const [showingLogs, setShowingLogs] = React.useState(eventNames.reduce((acc, name) => ({
    [name]: true,
    ...acc,
  }), {}))
  const [showingAll, setShowingAll] = React.useState(true)
  return (
    <div className={`container ${ui.modeCssClass}`}>
      <div className={`header ${ui.modeCssClass}`}>
        <div className="header5">
          Unirep Window
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
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        maxWidth: '960px',
        alignSelf: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '320px'}}>
          <Checkbox
            onChange={(enabled) => setShowingAll(enabled) || setShowingLogs(eventNames.reduce((acc, name) => ({
              [name]: enabled,
              ...acc,
            }), {}))}
            checked={showingAll}
          />
          <div>All</div>
          <Spacer />
        </div>
        {
          eventNames.map((n) => (
            <div style={{ display: 'flex', alignItems: 'center', width: '320px'}}>
              <Checkbox
                onChange={(enabled) => setShowingLogs((prev) => ({ ...prev, [n]: enabled }))}
                checked={showingLogs[n]}
              />
              <div>{n}</div>
              <Spacer />
            </div>
          ))
        }
      </div>
      <div className="section-components">
        {Object.entries(events.logsByTxHash)
          .map(([hash, logs]) => [hash, logs.filter(l => showingLogs[l.name])])
          .filter(([hash, logs]) => logs.length > 0)
          .map(([hash, logs]) => <TxCell hash={hash} events={logs} />)}
      </div>
    </div>
  )
})
