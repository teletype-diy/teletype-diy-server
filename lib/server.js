const buildControllerLayer = require('./controller-layer')
const pgp = require('pg-promise')()
const ModelLayer = require('./model-layer')

module.exports =
class Server {
  constructor (options) {
    this.databaseURL = options.databaseURL
    this.signalURL = options.signalURL
    this.hashSecret = options.hashSecret
    this.port = options.port
  }

  async start () {
    console.log(this.databaseURL);
    const modelLayer = new ModelLayer({db: pgp(this.databaseURL), hashSecret: this.hashSecret})

    const controllerLayer = buildControllerLayer({
      modelLayer,
      fetchICEServers: async () => {
        // we don't have twilio. fake it for now.
        // TODO: fix this
        return {ttl: 60, servers: ["what do you want??"]}
        // const response = JSON.parse(await request.post(twilioICEServerURL))
        // return {ttl: parseInt(response.ttl), servers: response.ice_servers}
      },
      enableExceptionReporter: false
    })

    return new Promise((resolve) => {
      this.server = controllerLayer.listen(this.port, resolve)
    })
  }

  stop () {
    return new Promise((resolve) => this.server.close(resolve))
  }
}
