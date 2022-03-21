import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import html from './html'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Home from '../src/Home'
import UIContext, { Interface } from 'nanoether/interface'
import EventContext, { Events } from '../src/contexts/events'

const OPTIMISM_NODE = 'https://opt-kovan.g.alchemy.com/v2/b5eaS0X3OMk54IppGh9ApffGoIOLIHOU'
const GOERLI_NODE = 'https://goerli.infura.io/v3/5b122dbc87ed4260bf9a2031e8a0e2aa'

// Enables edge cdn - https://developers.cloudflare.com/workers/learning/how-the-cache-works/
const DEBUG = false
const ENABLE_ASSET_CACHE = true
const ENABLE_SSR_CACHE = false // TODO: cache bust after deployment

addEventListener('scheduled', (event) => {
  event.waitUntil((async () => {
    const data = await loadLogs()
    await UNIREP_DATA.put('latest', JSON.stringify(data))
  })())
})

addEventListener('fetch', (event) => {
  event.respondWith(generateResponse(event))
})

async function generateResponse(event) {
  // is it a request for ssr or a static asset?
  const isSSR = ! /.+\.[a-zA-Z]+$/.test(event.request.url)
  if (!isSSR && ENABLE_ASSET_CACHE) {
    // take a peek in the cache and return if the url is there
    const response = await caches.default.match(event.request.url)
    if (DEBUG) {
      console.log(`Cache hit: ${event.request.url}`)
    }
    if (response) return response
  }
  if (/\/events$/.test(event.request.url)) {
    const data = await loadLogs(event)
    const response = new Response(JSON.stringify(data))
    response.headers.set('content-type', 'application/json')
    return response
  }
  return isSSR ? ssr(event) : staticAsset(event)
}

async function ssr(event) {
  try {
    const cookie = event.request.headers.get('Cookie')
    const iface = new Interface()
    if (typeof cookie === 'string' && cookie.indexOf('darkmode=true') !== -1) {
      // render in darkmode
      iface.setDarkmode(true)
    }
    const events = new Events()
    const fullLogs = JSON.parse(await UNIREP_DATA.get('latest'))
    events.logs = fullLogs.slice(0, 20)
    const app = ReactDOMServer.renderToString(
      <UIContext.Provider value={iface}>
        <EventContext.Provider value={events}>
          <Home />
        </EventContext.Provider>
      </UIContext.Provider>
    )
    // use npm run
    const finalIndex = html
      .replace(
        '<div id="root"></div>',
        `<div id="root">
          <script>
            // store hydration, find a more general way to do this?
            window.__EVENT_LOGS__ = JSON.parse('${JSON.stringify(fullLogs)}');
          </script>
          ${app}
        </div>`
      )
    const response = new Response(finalIndex)
    response.headers.set('content-type', 'text/html')
    response.headers.set('Cache-Control', 'max-age=604800,s-maxage=604800,public')
    if (ENABLE_SSR_CACHE) {
      // cache the ssr html itself
      event.waitUntil(
        caches.default.put(event.request.url, new Response(finalIndex))
      )
    }
    return response
  } catch (err) {
    return new Response(err.toString(), {
      status: 500,
    })
  }
}

async function staticAsset(event) {
  // https://www.npmjs.com/package/@cloudflare/kv-asset-handler#optional-arguments
  const asset = await getAssetFromKV(event, {
    bypassCache: !ENABLE_ASSET_CACHE,
  })
  let body = asset.body
  if (ENABLE_ASSET_CACHE) {
    // put the asset in the cache
    // split the response stream, give one to the cache
    if (DEBUG) {
      console.log('Stream split')
    }
    const [b1, b2] = asset.body.tee()
    // cause the script to stay alive until this promise resolves
    event.waitUntil(
      caches.default.put(event.request.url, new Response(b1, asset))
    )
    body = b2
  }
  // build response from body
  const response = new Response(body, asset)
  response.headers.set('Referrer-Policy', 'unsafe-url')
  // tell browsers to cache if it's an svg
  // WARN: if we use anything other than svg we need to change this lol
  if (/.+\.svg$/.test(event.request.url)) {
    response.headers.set('Cache-Control', 'max-age=604800,s-maxage=604800,public')
  }
  return response
}

async function loadSocialLogs() {
  const UNIREP_SOCIAL = '0xb1F6ded0a1C0dCE4e99A17Ed7cbb599459A7Ecc0'
  const filters = {
    SocialUserSignedUp: '0xe43c2a2d0ba801f72bfb7df8c728919e1886a4d9a6a12d45eeee7417bae2f155',
    PostSubmitted: '0x6da51c4a7f6055cf90f927a5dd196677509f6bff613f1087859c131e54d45ba8',
    CommentSubmitted: '0x49b90d3022da381379a9322dd5c48fb3b2dabc811dd97afd94e8e0c3625093b9',
    VoteSubmitted: '0x203d880d1533b25a9d06611aae6dec1a560907b90df8479cdab40e445188bce4',
    AirdropSubmitted: '0xcdc7a13869e4f8a627dbe2aaaf80ccb2acf27bea2ab437cd6de6d6789d1697bb'
  }
  const topics = [Object.keys(filters).reduce((acc, key) => {
    acc.push(filters[key])
    return acc
  }, [])]
  const filterNamesByHash = Object.keys(filters).reduce((acc, key) => {
    return {
      [filters[key]]: key,
      ...acc,
    }
  }, {})

  const data = (await ethRequest(OPTIMISM_NODE, 'eth_getLogs', {
    fromBlock: 'earliest',
    toBlock: 'latest',
    address: UNIREP_SOCIAL,
    topics,
  }))
    .map(d => {
      // now add a human readable event name where possible
      return {
        name: filterNamesByHash[d.topics[0]],
        ...d,
      }
    })
  return data
}

async function loadUnirepLogs() {
  const UNIREP = '0xfddf504e7b74d982e91ed3a70cdbd58c52a141f6'
  const filters = {
    UserSignedUp: '0xaf92f92b28945d280b51131bc986d2da66b560950f1a5126f12b7f847dae8f7d',
    UserStateTransitioned: '0x5e4945fc83b420d245560b51ac02c824732652e0552b5d8537800db0c690a663',
    AttestationSubmitted: '0xdbd3d665448fee233664f2b549d5d40b93371f736ecc7f9bc421fe927bf0b376',
    EpochEnded: '0x751bb1ba7b27b3979a32844d4d05aa16a46a771b751593704834a80311e3a9b9',
    IndexedEpochKeyProof: '0xf897f63ef79d1e56ab9f314e1e74d030bcd34a4f0d09ed2834f1efeebf9a4ed9',
    IndexedReputationProof: '0xb2bf4a676a6a5ef7e686a52ccf9f83f83acb1cac5d2eef1e090206a688c7777e',
    IndexedUserSignedUpProof: '0x58b1080086db5bb58e2e8e2f28dc2a26b705277257655e9296c7ebfcfb817136',
    IndexedStartedTransitionProof: '0xc70a0250765c7e3a778b8771883540e979ac92fa4002835744533497db870646',
    IndexedProcessedAttestationsProof: '0xf32686467e2fc0ec47df070bcf076510ff790a7ec36e2c65de53ce0d17906b69',
    IndexedUserStateTransitionProof: '0x5b552a9df44a1ab5bbe960f96fe04b35454baded1ca53c89d13903661cf9fee1'
  }
  const topics = [Object.keys(filters).reduce((acc, key) => {
    acc.push(filters[key])
    return acc
  }, [])]
  const filterNamesByHash = Object.keys(filters).reduce((acc, key) => {
    return {
      [filters[key]]: key,
      ...acc,
    }
  }, {})

  const data = (await ethRequest(OPTIMISM_NODE, 'eth_getLogs', {
    fromBlock: 'earliest',
    toBlock: 'latest',
    address: UNIREP,
    topics,
  }))
    .map(d => {
      // now add a human readable event name where possible
      return {
        name: filterNamesByHash[d.topics[0]],
        ...d,
      }
    })

  return data
}

async function loadLogs() {
  const [unirepLogs, socialLogs] = await Promise.all([
    loadUnirepLogs(),
    loadSocialLogs(),
  ])
  return [unirepLogs, socialLogs].flat().sort((a, b) => {
    if (+a.blockNumber !== +b.blockNumber) {
        return +a.blockNumber - +b.blockNumber
    }
    if (+a.transactionIndex !== +b.transactionIndex) {
        return +a.transactionIndex - +b.transactionIndex
    }
    return +a.logIndex - +b.logIndex
  })
}

async function ethRequest(node, method, ...args) {
  const id = Math.floor(Math.random() * 100000)
  const res = await fetch(node, {
    method: 'post',
    body: JSON.stringify({
      id,
      jsonrpc: '2.0',
      params: [...args],
      method,
    }),
    cf: {
      cacheTtl: 100,
      cacheEverything: true,
    }
  })
  const data = await res.json()
  return data.result
}
