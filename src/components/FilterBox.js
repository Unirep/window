import React from 'react'
import './filter-box.css'
import { observer } from 'mobx-react-lite'
import Checkbox from 'nanoether/Checkbox'
const Spacer = () => <div style={{ width: '8px', height: '8px' }} />

const eventNames = [
  // operations
  'UserSignedUp',
  'AttestationSubmitted',
  'UserStateTransitioned',
  'EpochEnded',
  // proofs
  'IndexedEpochKeyProof',
  'IndexedReputationProof',
  'IndexedUserSignedUpProof',
  'IndexedStartedTransitionProof',
  'IndexedProcessedAttestationsProof',
  'IndexedUserStateTransitionProof',
  // Unirep social
  'SocialUserSignedUp',
  'PostSubmitted',
  'CommentSubmitted',
  'VoteSubmitted',
  'AirdropSubmitted'
]

const operationEvents = eventNames.slice(0, 4)
const proofEvents = eventNames.slice(4, 10)
const socialEvents = eventNames.slice(10)

const EventCheckbox = ({ name, visible }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '4px' }}>
    <Checkbox
      onChange={(enabled) => eventChanged(name, enabled)}
      checked={visible}
    />
    <div>{name}</div>
    <Spacer />
  </div>
)

export default observer(({ updateVisibleLogs }) => {
  const [showingLogs, setShowingLogs] = React.useState(eventNames.reduce((acc, name) => ({
    [name]: true,
    ...acc,
  }), {}))
  const [showingAll, setShowingAll] = React.useState(true)
  const [collapsed, setCollapsed] = React.useState(false)

  const allChanged = (enabled) => {
    setShowingAll(enabled)
    setShowingLogs(eventNames.reduce((acc, name) => ({
      [name]: enabled,
      ...acc,
    }), {}))
  }

  const eventChanged = (event, enabled) => {
    setShowingLogs((prev) => ({ ...prev, [event]: enabled }))
  }

  React.useEffect(() => {
    updateVisibleLogs(showingLogs)
  }, [showingLogs])

  return (
    <div className="filter-box-outer">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0px 8px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <img src={require('../../assets/filter.svg')} />
          <Spacer />
          <div style={{ fontSize: '16px' }}>Show or hide event types</div>
        </div>
        <img
          src={require('../../assets/arrow_up.svg')}
          style={{ transform: collapsed ? 'rotate(180deg)' : '' }}
        />
      </div>
      {!collapsed && (
        <>
          <div style={{ height: '16px' }} />
          <div style={{
            display: 'flex',
            flexWrap: 'wrap'
          }}>
            <div style={{ flexDirection: 'column', }} className="filter-gray-box">
              <div className="filter-section-title">All Events</div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '4px' }}>
                <Checkbox
                  onChange={allChanged}
                  checked={showingAll}
                />
                <div>All</div>
                <Spacer />
              </div>
              <div className="filter-section-title">Operations</div>
              {operationEvents.map((n) => <EventCheckbox name={n} visible={showingLogs[n]} />)}
              <div style={{ flex: '1' }} />
            </div>
            <div className="filter-gray-box">
              <div className="filter-section-title">Proofs</div>
              {proofEvents.map((n) => <EventCheckbox name={n} visible={showingLogs[n]} />)}
              <div style={{ flex: '1' }} />
            </div>
            <div className="filter-gray-box">
              <div className="filter-section-title">Unirep Social Events</div>
              {socialEvents.map((n) => <EventCheckbox name={n} visible={showingLogs[n]} />)}
              <div style={{ flex: '1' }} />
            </div>
          </div>
        </>
      )}
    </div>
  )
})
