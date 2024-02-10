// well, i do not care for pusher, lets try this a again with socket.io
const Pusher = require('pusher')
// const { Server } = require("socket.io")

const { io } = require("socket.io-client");

const socket = io("http://127.0.0.1:3456/");

module.exports =
class PusherPubSubGateway {
  constructor ({appId, key, secret, cluster}) {
    this.pusherClient = new Pusher({
      appId,
      key,
      secret,
      cluster: cluster,
      encrypted: true
    })
  }

  broadcast (channelName, eventName, data) {
    channelName = channelName.replace(/\//g, '.')
    // this.pusherClient.trigger(channelName, eventName, data)
    console.log(channelName);
    console.log(eventName);
    console.log(data);
    socket.emit("halo", channelName, eventName, data)
  }

  async isOperational () {
    return new Promise((resolve) => {
      // always just works...
      return true
      // this.pusherClient.get({path: '/channels/unexisting-channel'}, (error, request, response) => {
      //   if (error) {
      //     resolve(false)
      //     return
      //   }
      //
      //   const success = 200 <= response.statusCode && response.statusCode < 400
      //   resolve(success)
      // })
    })
  }
}
