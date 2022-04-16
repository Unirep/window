import React from 'react'
import { observer } from 'mobx-react-lite'
import './event-cell.css'
import UIContext from 'nanoether/interface'
import { ethers } from 'ethers'
import splitCaps from '../utils/split-caps'

const Spacer = (props) => <div style={{ width: '8px', height: '8px', ...(props.style ?? {}) }} />

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
  IndexedUserStateTransitionProof: 'A ZK proof showing the state change has been completed. Includes new epoch keys.',
  SocialUserSignedUp: '',
  PostSubmitted: 'A user is creating a post.',
  CommentSubmitted: 'A user is commenting on a post.',
  VoteSubmitted: 'A user is voting on a post or comment.',
  AirdropSubmitted: 'A user is requesting an airdrop.'
}

const parseData = {
  UserSignedUp: (event) => {
    const [attesterId, airdropAmount] = ethers.utils.defaultAbiCoder.decode(
      ['uint', 'uint'],
      event.data
    )
    return {
      epoch: +event.topics[1],
      identity: event.topics[2],
      attesterId: attesterId.toString(),
      airdropAmount: airdropAmount.toString(),
    }
  },
  UserStateTransitioned: (event) => ({
    epoch: +event.topics[1],
    hashedLeaf: event.topics[2],
    // proofIndex: +event.topics[3]
  }),
  AttestationSubmitted: (event) => {
    const [
      eventType,
      [
        attesterId,
        positiveRep,
        negativeRep,
        graffiti,
        signUp,
      ],
      toProofIndex,
      fromProofIndex
    ] = ethers.utils.defaultAbiCoder.decode(
      ['uint', 'tuple(uint, uint, uint, uint, uint)', 'uint', 'uint'],
      event.data
    )
    const eventTypes = [
      'SendAttestation',
      'Airdrop',
      'SpendReputation',
    ]
    return {
      epoch: +event.topics[1],
      epochKey: event.topics[2].slice(-16),
      attesterId: +attesterId.toString(),
      eventType: eventTypes[+eventType.toString()],
      positiveRep: positiveRep.toString(),
      negativeRep: negativeRep.toString(),
      graffiti: graffiti.toString(),
      signUp: signUp.toString(),
      toProofIndex: toProofIndex.toString(),
      fromProofIndex: fromProofIndex.toString(),
    }
  },
  EpochEnded: (event) => ({
    epoch: +event.topics[1],
  }),
  IndexedEpochKeyProof: (event) => ({
    proofIndex: +event.topics[1],
    epoch: +event.topics[2],
    epochKey: event.topics[3].slice(-16),
  }),
  IndexedReputationProof: (event) => ({
    proofIndex: +event.topics[1],
    epoch: +event.topics[2],
    epochKey: event.topics[3].slice(-16),
    // TODO: decode proof
  }),
  IndexedUserSignedUpProof: (event) => ({
    proofIndex: +event.topics[1],
    epoch: +event.topics[2],
    epochKey: event.topics[3].slice(-16),
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
  }),
  SocialUserSignedUp: (event) => ({
    epoch: +event.topics[1],
  }),
  PostSubmitted: (event) => {
    const [
      postContent,
      [
        nullifiers,
        epoch,
        epochKey,
        gst,
        attesterId,
        proveReputationAmount,
        minRep,
        proveGraffiti,
        graffitiPreImage,
        proof,
      ]
    ] = ethers.utils.defaultAbiCoder.decode(
      ['string', 'tuple(uint[], uint, uint, uint, uint, uint, uint, uint, uint, uint[8])'],
      event.data
    )
    return {
      epoch: +event.topics[1],
      epochKey: event.topics[2].slice(-16),
      postContent,
      proveReputationAmount: proveReputationAmount.toString(),
      minRep: minRep.toString(),
    }
  },
  CommentSubmitted: (event) => {
    const [
      commentContent,
      [
        nullifiers,
        epoch,
        epochKey,
        gst,
        attesterId,
        proveReputationAmount,
        minRep,
        proveGraffiti,
        graffitiPreImage,
        proof,
      ]
    ] = ethers.utils.defaultAbiCoder.decode(
      ['string', 'tuple(uint[], uint, uint, uint, uint, uint, uint, uint, uint, uint[8])'],
      event.data
    )
    return {
      epoch: +event.topics[1],
      postId: event.topics[2],
      epochKey: event.topics[3].slice(-16),
      commentContent,
      proveReputationAmount: proveReputationAmount.toString(),
      minRep: minRep.toString(),
    }
  },
  VoteSubmitted: (event) => {
    const [
      upvoteValue,
      downvoteValue,
      toEpochKeyProofIndex,
      [
        nullifiers,
        epoch,
        epochKey,
        gst,
        attesterId,
        proveReputationAmount,
        minRep,
        proveGraffiti,
        graffitiPreImage,
        proof,
      ]
    ] = ethers.utils.defaultAbiCoder.decode(
      ['uint', 'uint', 'uint', 'tuple(uint[], uint, uint, uint, uint, uint, uint, uint, uint, uint[8])'],
      event.data
    )
    return {
      epoch: +event.topics[1],
      fromEpochKey: event.topics[2].slice(-16),
      toEpochKey: event.topics[3].slice(-16),
      upvoteValue: upvoteValue.toString(),
      downvoteValue: downvoteValue.toString(),
      proveReputationAmount: proveReputationAmount.toString(),
      minRep: minRep.toString(),
    }
  },
  AirdropSubmitted: (event) => ({
    epoch: +event.topics[1],
    epochKey: event.topics[2].slice(-16),
  })
}

export default observer(({
  event,
  index,
}) => {
  const ui = React.useContext(UIContext)
  const data = parseData[event.name] && parseData[event.name](event) || {}
  return (
    <div className={`event-cell-outer ${ui.modeCssClass}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#464748',
          borderRadius: '24px',
          border: '2.6px solid #464748',
          width: '24px',
          height: '24px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div>
            {index + 1}
          </div>
        </div>
        <Spacer />
        <div style={{ fontSize: '24px', fontWeight: '600', color: '#464748' }}>
          {splitCaps(event.name)}
        </div>
      </div>
      <Spacer style={{ height: '26px' }} />
      {descriptions[event.name] && (
        <>
          <div style={{ borderRadius: '4px', background: '#F0F2F2', padding: '16px' }}>
            {descriptions[event.name]}
          </div>
          <Spacer />
        </>
      )}
      <div style={{ display: 'flex', flex: '1', flexWrap: 'wrap', margin: '0px -4px' }}>
        <div className="gray-box">
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.eventType ? <><div>Event Type</div><Spacer /></> : null}
            {data.postContent ? <><div>Post Content</div><Spacer /></> : null}
            {data.postContent ? <><div>{data.postContent}</div><Spacer /></> : null}
            {data.commentContent ? <><div>Comment Content</div><Spacer /></> : null}
            {data.commentContent ? <><div>{data.commentContent}</div><Spacer /></> : null}
            {data.identity ? <><div>Identity</div><Spacer /></> : null}
            {data.identity ? <><div style={{ wordBreak: 'break-all' }}>{data.identity}</div><Spacer /></> : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.eventType ? <><div>{data.eventType}</div><Spacer /></> : null}
          </div>
        </div>
        <div className="gray-box" style={{ minWidth: '240px' }}>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.epoch ? <><div>Epoch</div><Spacer /></> : null}
            {data.epochKey ? <><div>Epoch Key</div><Spacer /></> : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.epoch ? <><div>{data.epoch}</div><Spacer /></> : null}
            {data.epochKey ? <><div>{data.epochKey}</div><Spacer /></> : null}
          </div>
        </div>
        <div className="gray-box">
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.proofIndex ? <><div>Proof Index</div><Spacer /></> : null}
            {data.toProofIndex > 0 ? <><div>To proof index</div><Spacer /></> : null}
            {data.fromProofIndex > 0 ? <><div>From proof index</div><Spacer /></> : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.proofIndex ? <><div>{data.proofIndex}</div><Spacer /></> : null}
            {data.toProofIndex > 0 ? <><div>{data.toProofIndex}</div><Spacer /></> : null}
            {data.fromProofIndex > 0 ? <><div>{data.fromProofIndex}</div><Spacer /></> : null}
          </div>
        </div>
        <div className="gray-box">
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.positiveRep ? <><div>Positive REP</div><Spacer /></> : null}
            {data.negativeRep ? <><div>Negative REP</div><Spacer /></> : null}
            {data.upvoteValue ? <><div>Up vote</div><Spacer /></> : null}
            {data.downvoteValue ? <><div>Down vote</div><Spacer /></> : null}
            {data.proveReputationAmount ? <><div>Prove REP</div><Spacer /></> : null}
            {data.minRep ? <><div>Min REP</div><Spacer /></> : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.positiveRep ? <><div>{data.positiveRep}</div><Spacer /></> : null}
            {data.negativeRep ? <><div>{data.negativeRep}</div><Spacer /></> : null}
            {data.upvoteValue ? <><div>{data.upvoteValue}</div><Spacer /></> : null}
            {data.downvoteValue ? <><div>{data.downvoteValue}</div><Spacer /></> : null}
            {data.proveReputationAmount ? <><div>{data.proveReputationAmount}</div><Spacer /></> : null}
            {data.minRep ? <><div>{data.minRep}</div><Spacer /></> : null}
          </div>
        </div>
        <div className="gray-box">
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.graffiti ? <><div>Graffiti</div><Spacer /></> : null}
            {data.signUp ? <><div>Sign up</div><Spacer /></> : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {data.graffiti ? <><div>{data.graffiti}</div><Spacer /></> : null}
            {data.signUp ? <><div>{data.signUp}</div><Spacer /></> : null}
          </div>
        </div>
      </div>
    </div>
  )
})
