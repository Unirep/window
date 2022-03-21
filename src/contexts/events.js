import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'

export class Events {
  logs = []

  constructor() {
    makeAutoObservable(this)
    if (typeof window !== 'undefined') {
      this.load()
    }
  }

  async load() {
    this.logs = window.__EVENT_LOGS__ || []
    if (this.logs.length > 0) return
    // otherwise load the events from the server
    const data = await fetch('/events').then(r => r.json())
    this.logs = data
  }
}

export default createContext(new Events())
