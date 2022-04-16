import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'

export class Events {
  logs = []
  logsByTxHash = []

  constructor() {
    makeAutoObservable(this)
    if (typeof window !== 'undefined') {
      this.load()
    }
  }

  async load() {
    this.setLogs(window.__EVENT_LOGS__ || [])
    if (this.logs.length > 0) return
    // otherwise load the events from the server
    const data = await fetch('/events').then(r => r.json())
    this.setLogs(data)
  }

  setLogs(logs) {
    this.logs = logs
    this.logsByTxHash = logs.reduce((acc, val) => {
      return {
        ...acc,
        [val.transactionHash]: [...(acc[val.transactionHash] ?? []), val]
      }
    }, {})
  }
}

export default createContext(new Events())
