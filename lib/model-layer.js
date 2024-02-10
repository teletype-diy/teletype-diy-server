const assert = require('assert')
// use local logging instead. don't have bugsnag.
// const bugsnag = require('bugsnag')
const crypto = require('crypto')
// const uuid = require('uuid/v4')
const { v4: uuidv4 } = require('uuid');

module.exports =
class ModelLayer {
  constructor ({db, hashSecret}) {
    this.db = db
    this.hashSecret = hashSecret
    assert(this.hashSecret != null, 'Hash secret cannot be empty')
  }

  async createPortal ({hostPeerId}) {
    console.log("oh, shit - got no db yet...");
    // const id = uuid()
    const id = uuidv4()
    console.log(`uuid: ${id}`);
    console.log(`hostPeerId: ${hostPeerId}`);
    console.log(this.db);
    try {
        await this.db.any('select * from portals;')
    } catch (e) {
        console.log("some error...");
    } finally {
        console.log("finally..");
    }
    console.log("select was workiuung");
    await this.db.none('INSERT INTO portals (id, host_peer_id) VALUES ($1, $2)', [id, hostPeerId])
    console.log("this should have worked right??");
    return id
  }

  async findPortal (id) {
    try {
      const result = await this.db.oneOrNone('SELECT * FROM portals where id = $1', [id])
      return (result == null) ? null : {hostPeerId: result.host_peer_id}
    } catch (e) {
      const malformedUUIDErrorCode = '22P02'
      if (e.code === malformedUUIDErrorCode) return null
    }
  }

  async createEvent (event) {
    console.log("creating event. no idea what for??");
    try {
      const {name, identity, portalId} = event
      const loginHash = crypto.createHash('sha1').update(identity.id + this.hashSecret).digest('hex')
      await this.db.none(
        'INSERT INTO events (name, user_id, portal_id, created_at) VALUES ($1, $2, $3, now())',
        [name, loginHash, portalId]
      )
    } catch (error) {
      console.error(error.stack);
      // bugsnag.notify(error, event)
    }
    console.log("done with the event stuff...");
  }

  getEvents () {
    return this.db.manyOrNone('SELECT * FROM events ORDER BY created_at ASC')
  }

  async isOperational () {
    try {
      await this.db.one('select')
      return true
    } catch (error) {
      return false
    }
  }
}
