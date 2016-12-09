import Base from './base'
import config from '../config'
import request from 'request-promise'
import url from 'url'

const URL = url.format({
  protocol: 'http:',
  hostname: config.mesosHost,
  port: config.mesosPort == 80 ? undefined : config.mesosPort,
  pathname: '/master/state'
})

class MesosStateFetcher extends Base {
  fetch() {
    return request(URL).then( html => JSON.parse(html) )
  }
}

export default MesosStateFetcher
