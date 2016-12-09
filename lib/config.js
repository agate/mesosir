module.exports = {
  port: process.env['PORT'] || 3000,
  mesosHost: process.env['MESOS_HOST'],
  mesosPort: process.env['MESOS_PORT'],
  mesosSlavePort: process.env['MESOS_SLAVE_PORT'],
  cAdvisorPort: process.env['CADVISOR_PORT'],
};
