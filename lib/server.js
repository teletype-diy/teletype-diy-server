const buildControllerLayer = require('./controller-layer')
const pgp = require('pg-promise')()
const request = require('request-promise-native')
const IdentityProvider = require('./identity-provider')
const ModelLayer = require('./model-layer')
const PubSubGateway = require('./pusher-pub-sub-gateway')

module.exports =
class Server {
  constructor (options) {
    this.databaseURL = options.databaseURL
    this.pusherAppId = options.pusherAppId
    this.pusherKey = options.pusherKey
    this.pusherSecret = options.pusherSecret
    this.pusherCluster = options.pusherCluster
    // this.twilioAccount = options.twilioAccount
    // this.twilioAuthToken = options.twilioAuthToken
    // this.githubApiUrl = options.githubApiUrl
    // this.githubClientId = options.githubClientId
    // this.githubClientSecret = options.githubClientSecret
    // this.githubOauthToken = options.githubOauthToken
    this.boomtownSecret = options.boomtownSecret
    this.hashSecret = options.hashSecret
    this.port = options.port
  }

  async start () {
    console.log(this.databaseURL);
    const modelLayer = new ModelLayer({db: pgp(this.databaseURL), hashSecret: this.hashSecret})
    const identityProvider = new IdentityProvider({
      request,
      // apiUrl: this.githubApiUrl,
      // clientId: this.githubClientId,
      // clientSecret: this.githubClientSecret,
      oauthToken: this.githubOauthToken
    })
    const pubSubGateway = new PubSubGateway({
      appId: this.pusherAppId,
      key: this.pusherKey,
      secret: this.pusherSecret,
      cluster: this.pusherCluster
    })

    // const twilioICEServerURL = `https://${this.twilioAccount}:${this.twilioAuthToken}@api.twilio.com/2010-04-01/Accounts/${this.twilioAccount}/Tokens.json`

    const controllerLayer = buildControllerLayer({
      modelLayer,
      pubSubGateway,
      identityProvider,
      boomtownSecret: this.boomtownSecret,
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
