const { ethers } = require('ethers')
const { abi } = require('@unirep/contracts/artifacts/contracts/Unirep.sol/Unirep.json')
const UNIREP = '0x79fdA522F780746AeF2b6489B52Bba7124aa70f0'


const unirepContract = new ethers.Contract(
  UNIREP,
  abi,
)

const [UserSignedUp] = unirepContract.filters.UserSignedUp().topics
const [UserStateTransitioned] = unirepContract.filters.UserStateTransitioned().topics
const [AttestationSubmitted] = unirepContract.filters.AttestationSubmitted().topics
const [EpochEnded] = unirepContract.filters.EpochEnded().topics
const [IndexedEpochKeyProof] = unirepContract.filters.IndexedEpochKeyProof().topics
const [IndexedReputationProof] = unirepContract.filters.IndexedReputationProof().topics
const [IndexedUserSignedUpProof] = unirepContract.filters.IndexedUserSignedUpProof().topics
const [IndexedStartedTransitionProof] = unirepContract.filters.IndexedStartedTransitionProof().topics
const [IndexedProcessedAttestationsProof] = unirepContract.filters.IndexedProcessedAttestationsProof().topics
const [IndexedUserStateTransitionProof] = unirepContract.filters.IndexedUserStateTransitionProof().topics

console.log(`Address: ${UNIREP}`)
console.log({
  UserSignedUp,
  UserStateTransitioned,
  AttestationSubmitted,
  EpochEnded,
  IndexedEpochKeyProof,
  IndexedReputationProof,
  IndexedUserSignedUpProof,
  IndexedStartedTransitionProof,
  IndexedProcessedAttestationsProof,
  IndexedUserStateTransitionProof,
})
