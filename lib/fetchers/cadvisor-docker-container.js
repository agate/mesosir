import Base from './base'
import config from '../config'
import request from 'request-promise'

const CADVISOR_PORT = 9080

function selectContainer(containers, alias) {
  let res
  containers.forEach((container) => {
    console.log(container.aliases, alias)
    if (container.aliases &&
      container.aliases.join("").indexOf(alias) >= 0) {
      res = container
    }
  })
  return res
}

class CadvisorDockerContainerFetcher extends Base {
  constructor(options) {
    super()
    this.host = options.host
    this.port = options.port || CADVISOR_PORT
    this.slaveId = options.slaveId
    this.executorContainer = options.executorContainer
    this.alias = `${this.slaveId}.${this.executorContainer}`
  }

  fetch() {
    return request(this.url()).then((html) => {
      let containers = JSON.parse(html)
      return selectContainer(containers, this.alias)
    })
  }

  url() {
    return `http://${this.host}:${this.port}/api/v1.3/subcontainers/docker`
  }

}

export default CadvisorDockerContainerFetcher
