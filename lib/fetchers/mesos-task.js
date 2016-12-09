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

function selectTask(mesosState, mesosTaskId) {
  return mesosState.frameworks
                   .map( f => f.tasks )
                   .reduce( (a, b) => a.concat(b) )
                   .find( t => t.id == mesosTaskId )
}

class MesosTaskFetcher extends Base {
  constructor(options) {
    super()
    this.id = options.id
    this.state = options.state
  }

  fetch() {
    return fetchMesosState(this.state).then((mesosState) => {
      return selectTask(mesosState, this.id)
    })
  }

}

export default MesosTaskFetcher
