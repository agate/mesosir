import Base from './base'
import MesosStateFetcher from './mesos-state'
import config from '../config'
import request from 'request-promise'

function fetchMesosState(mesosState) {
  if (mesosState) {
    return new Promise((resolve, reject) => {
      resolve(mesosState)
    })
  } else {
    return new MesosStateFetcher().fetch()
  }
}

function selectSlave(mesosState, mesosSlaveId) {
  return mesosState.slaves
                   .find( s => s.id == mesosSlaveId )
}

class MesosSlaveFetcher extends Base {
  constructor(options) {
    super()
    this.id = options.id
    this.state = options.state
  }

  fetch() {
    return fetchMesosState(this.state).then((mesosState) => {
      return selectSlave(mesosState, this.id)
    })
  }

}

export default MesosSlaveFetcher
