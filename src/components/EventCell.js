import React from 'react'
import { observer } from 'mobx-react-lite'
import './event-cell.css'
import UIContext from 'nanoether/interface'

const Spacer = () => <div style={{ width: '8px', height: '8px' }} />

const descriptions = {
  UserSignedUp: 'Attester has registered a new semaphore identity commitment.',
  UserStateTransitioned: 'User state has transitioned from one epoch to the next.',
  AttestationSubmitted: 'An attester is attesting to a ZK proof of reputation.',
  EpochEnded: 'An epoch has ended.',
  IndexedEpochKeyProof: 'A proof that an epoch key is owned by an individual.',
  IndexedReputationProof: 'A ZK proof that an individual controlling an epoch key has a certain amount of reputation.',
  IndexedUserSignedUpProof: 'A ZK proof that a user controlling a semaphore identity would like to register in the state tree.',
  IndexedStartedTransitionProof: 'A ZK proof that a user would like to begin a state transition.',
  IndexedProcessedAttestationsProof: 'A ZK proof allowing the attester to blind and process state changes for a user.',
  IndexedUserStateTransitionProof: 'A ZK proof showing the state change has been completed. Includes new epoch keys.'
}

const parseData = {
  UserSignedUp: (event) => ({
    epoch: +event.topics[1],
    identity: event.topics[2],
    attesterId: +event.topics[3],
    airdropAmount: +event.topics[4],
  }),
  UserStateTransitioned: (event) => ({
    epoch: +event.topics[1],
    hashedLeaf: event.topics[2],
    proofIndex: +event.topics[3]
  }),
  AttestationSubmitted: (event) => ({
    epoch: +event.topics[1],
    epochKey: event.topics[2].slice(-8),
    attester: '0x' + event.topics[3].slice(-40),
    // TODO
  }),
  EpochEnded: (event) => ({
    epoch: +event.topics[1],
  }),
  IndexedEpochKeyProof: (event) => ({
    proofIndex: +event.topics[1],
    epoch: +event.topics[2],
    epochKey: event.topics[3].slice(-8),
  }),
  IndexedReputationProof: (event) => ({
    proofIndex: +event.topics[1],
    epoch: +event.topics[2],
    epochKey: event.topics[3].slice(-8),
    // TODO: decode proof
  }),
  IndexedUserSignedUpProof: (event) => ({
    proofIndex: +event.topics[1],
    epoch: +event.topics[2],
    epochKey: event.topics[3].slice(-8),
    // TODO: decode proof
  }),
  IndexedStartedTransitionProof: (event) => ({
    proofIndex: +event.topics[1],
  }),
  IndexedProcessedAttestationsProof: (event) => ({
    proofIndex: +event.topics[1],
  }),
  IndexedUserStateTransitionProof: (event) => ({
    proofIndex: +event.topics[1],
    // TODO: decode proof
  })
}

export default observer(({
  event,
}) => {
  const ui = React.useContext(UIContext)
  return (
    <div className={`event-cell-outer ${ui.modeCssClass}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div className="header6">{event.name}</div>
        <div>Block {+event.blockNumber}</div>
      </div>
      <Spacer />
      <div style={{ display: 'flex' }}>
        <div style={{ fontSize: '20px' }}>{descriptions[event.name]}</div>
      </div>
      <Spacer />
      <div className={`data-container ${ui.modeCssClass}`} style={{ display: 'flex', flexDirection: 'column' }}>
        {
          Object.entries(parseData[event.name] && parseData[event.name](event) || {})
            .map(([key, val]) => (
              <div style={{ display: 'flex', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                <div>{key}:</div>
                <Spacer />
                <div style={{ textOverflow: 'ellipsis' }}>{val}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
})
