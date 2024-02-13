const assert = require('assert')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const {enforceProtocol} = require('./middleware')
const ModelLayer = require('./model-layer')

const PERCENTAGE_OF_TWILIO_TTL_TO_USE_FOR_CACHE_HEADER = 0.95

module.exports = ({
  modelLayer,
  fetchICEServers,
  enableExceptionReporter,
}) => {
  const app = express()
  app.use(cors())
  app.use(bodyParser.json({limit: '1mb'}))
  app.use(enforceProtocol)

  app.get('/protocol-version', function (req, res) {
    res.set('Cache-Control', 'no-store')
    res.send({version: 9})
    console.log("someone asked us the version, yay stuffs working..");
  })

  app.get('/ice-servers', async function (req, res) {
    if (fetchICEServers) {
      const {servers, ttl} = await fetchICEServers()
      const maxAgeInSeconds = ttl * PERCENTAGE_OF_TWILIO_TTL_TO_USE_FOR_CACHE_HEADER
      res.set('Cache-Control', `private, max-age=${maxAgeInSeconds}`)
      res.send(servers)
    } else {
      res.send([])
    }
  })

  app.post('/portals', async function (req, res) {
    console.log("I was called when clicked on share?");
    const id = await modelLayer.createPortal({hostPeerId: req.body.hostPeerId})

    res.send({id})
  })

  app.get('/portals/:id', async function (req, res) {
    console.log("we were asked to connect two portals, or something..");

    const portal = await modelLayer.findPortal(req.params.id)
    if (portal) {
      res.send({hostPeerId: portal.hostPeerId})
    } else {
      res.status(404).send({})
    }
  })

  app.get('/_ping', async function (req, res) {
    const statuses = await Promise.all([
      modelLayer.isOperational(),
      isICEServerProviderOperational(),
      identityProvider.isOperational()
    ])

    const unhealthyServices = []
    if (!statuses[1]) unhealthyServices.push('db')
    if (!statuses[2]) unhealthyServices.push('iceServerProvider')
    if (!statuses[3]) unhealthyServices.push('identityProvider')

    if (unhealthyServices.length === 0) {
      res.status(200).send({
        now: Date.now(),
        status: 'ok'
      })
    } else {
      res.status(503).send({
        now: Date.now(),
        status: 'failures',
        failures: unhealthyServices
      })
    }
  })

  async function isICEServerProviderOperational () {
    try {
      await fetchICEServers()
      return true
    } catch (_) {
      return false
    }
  }

  return app
}
