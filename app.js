let express = require('express')
let config = require('./lib/config')
let appInfo = require('./package')
let app = express()

import MesosStateFetcher from './lib/fetchers/mesos-state'
import MesosTaskFetcher from './lib/fetchers/mesos-task'
import MesosSlaveFetcher from './lib/fetchers/mesos-slave'
import MesosExecutorFetcher from './lib/fetchers/mesos-executor'
import CadvisorDockerContainerFetcher from './lib/fetchers/cadvisor-docker-container'

function errorHandler (res, err) {
  res.status(500).json({
    error: err.toString()
  })
}

app.get('/', (req, res) => {
  res.json({
    name: appInfo.name,
    version: appInfo.version,
    author: appInfo.author
  })
})

app.get('/state', (req, res) => {
  new MesosStateFetcher()
    .fetch()
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      errorHandler(res, err)
    })
})

app.get('/tasks/:id', (req, res) => {
  new MesosTaskFetcher({id: req.params.id})
    .fetch()
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      errorHandler(res, err)
    })
})

app.get('/tasks/:id/slave', (req, res) => {
  new MesosTaskFetcher({id: req.params.id})
    .fetch()
    .then((data) => {
      new MesosSlaveFetcher({id: data.slave_id})
        .fetch()
        .then((data) => {
          res.json(data)
        })
        .catch((err) => {
          errorHandler(res, err)
        })
    })
    .catch((err) => {
      errorHandler(res, err)
    })
})

app.get('/tasks/:id/executor', (req, res) => {
  new MesosTaskFetcher({id: req.params.id})
    .fetch()
    .then((task) => {
      new MesosSlaveFetcher({id: task.slave_id})
        .fetch()
        .then((slave) => {
          new MesosExecutorFetcher({
            taskId: req.params.id,
            slaveHost: slave.hostname
          }).fetch().then((executor) => {
            res.json(executor)
          })
          .catch((err) => {
            errorHandler(res, err)
          })
        })
        .catch((err) => {
          errorHandler(res, err)
        })
    })
    .catch((err) => {
      errorHandler(res, err)
    })
})

app.get('/tasks/:id/cadvisor', (req, res) => {
  new MesosTaskFetcher({id: req.params.id})
    .fetch()
    .then((task) => {
      new MesosSlaveFetcher({id: task.slave_id})
        .fetch()
        .then((slave) => {
          new MesosExecutorFetcher({
            taskId: req.params.id,
            slaveHost: slave.hostname
          }).fetch().then((executor) => {
            new CadvisorDockerContainerFetcher({
              host: slave.hostname,
              slaveId: slave.id,
              executorContainer: executor.container
            }).fetch()
              .then((container) => {
                res.json(container)
              })
              .catch((err) => {
                errorHandler(res, err)
              })
          })
          .catch((err) => {
            errorHandler(res, err)
          })
        })
        .catch((err) => {
          errorHandler(res, err)
        })
    })
    .catch((err) => {
      errorHandler(res, err)
    })
})

app.get('/slaves/:id', (req, res) => {
  new MesosSlaveFetcher({id: req.params.id})
    .fetch()
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      errorHandler(res, err)
    })
})

app.listen(config.port, () => {
  console.log('app listening on port ' + config.port + '!')
})
