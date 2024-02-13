const assert = require('assert')
// use local logging instead. don't have bugsnag.
// const bugsnag = require('bugsnag')
const crypto = require('crypto')
// const uuid = require('uuid/v4')
const { v4: uuidv4 } = require('uuid');
const pgp = require('pg-promise')()

module.exports =
class ModelLayer {
  constructor ({databaseURL}) {
    this.databaseURL = databaseURL
    if (this.databaseURL) {
        this.db = pgp(this.databaseURL)
    } else {
        console.warn("No DATABASE_URL configured, fallback to in-memory db");
        this.mem_db = {}
    }
  }

  async createPortal ({hostPeerId}) {
    console.log("oh, shit - got no db yet...");
    // const id = uuid()
    const id = uuidv4()
    console.log(`uuid: ${id}`);
    console.log(`hostPeerId: ${hostPeerId}`);
    if (this.db) {
        await this.db.none('INSERT INTO portals (id, host_peer_id) VALUES ($1, $2)', [id, hostPeerId])
    } else {
        this.mem_db[id] = hostPeerId
    }
    console.log("this should have worked right??");

    return id
  }

  async findPortal (id) {
    console.log("we were asked to search for portal in db.");
    try {
        if (this.db) {
            const result = await this.db.oneOrNone('SELECT * FROM portals where id = $1', [id])
            return (result == null) ? null : {hostPeerId: result.host_peer_id}
        } else {
            // console.log(this.mem_db);
            // console.log(this.mem_db[id]);
            console.log({hostPeerId: this.mem_db[id]});
            let res_host_peer_id = {hostPeerId: this.mem_db[id]};

            return res_host_peer_id;
        }
    } catch (e) {
      const malformedUUIDErrorCode = '22P02'
      if (e.code === malformedUUIDErrorCode) return null
    }
  }

  async isOperational () {
    if (this.db) {
        try {
          await this.db.one('select')
          return true
        } catch (error) {
          return false
        }
    } else {
        return true
    }
  }
}
