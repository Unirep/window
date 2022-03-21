const { ethers } = require('ethers')
const { abi } = require('@unirep/contracts/artifacts/contracts/Unirep.sol/Unirep.json')
const { abi: socialAbi } = require('@unirep/unirep-social/artifacts/contracts/UnirepSocial.sol/UnirepSocial.json')
const UNIREP = '0x79fdA522F780746AeF2b6489B52Bba7124aa70f0'
const UNIREP_SOCIAL = '0xb1F6ded0a1C0dCE4e99A17Ed7cbb599459A7Ecc0'

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

const unirepSocialContract = new ethers.Contract(UNIREP_SOCIAL, socialAbi)

const [_UserSignedUp] = unirepSocialContract.filters.UserSignedUp().topics
const [_PostSubmitted] = unirepSocialContract.filters.PostSubmitted().topics
const [_CommentSubmitted] = unirepSocialContract.filters.CommentSubmitted().topics
const [_VoteSubmitted] = unirepSocialContract.filters.VoteSubmitted().topics
const [_AirdropSubmitted] = unirepSocialContract.filters.AirdropSubmitted().topics

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

console.log({
  _UserSignedUp,
  _PostSubmitted,
  _CommentSubmitted,
  _VoteSubmitted,
  _AirdropSubmitted,
})
