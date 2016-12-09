import Base from './base'
import config from '../config'
import request from 'request-promise'
import url from 'url'


function generateUrl(slaveHost, slavePort) {
  return url.format({
    protocol: 'http:',
    hostname: slaveHost,
    port: slavePort == 80 ? undefined : slavePort,
    pathname: '/slave(1)/state'
  })
}

function selectExecutor(state, id) {
  let res
  state.frameworks.forEach((framework) => {
    framework.executors.forEach((executor) => {
      if (executor.id == id) {
        res = executor
      }
    })
  })
  return res
}

class MesosExecutorFetcher extends Base {
  constructor(options) {
    super()
    this.slaveHost = options.slaveHost
    this.slavePort = options.slavePort || config.mesosSlavePort
    this.taskId    = options.taskId
  }

  fetch() {
    let url = generateUrl(this.slaveHost, this.slavePort)
    return request(url).then( html => selectExecutor(JSON.parse(html), this.taskId) )
  }
}

export default MesosExecutorFetcher
