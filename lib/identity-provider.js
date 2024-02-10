const {StatusCodeError} = require('request-promise-core/lib/errors')

module.exports =
class IdentityProvider {
  constructor ({request, oauthToken}) {
    this.request = request
    // this.apiUrl = apiUrl
    this.oauthToken = oauthToken
  }

  async identityForToken (oauthToken) {
    // we do not care, let anyone in...
    return {id: "all_i_got_was_this_lousy_tshirt", login: oauthToken}
    // try {
    //   const headers = {
    //     'User-Agent': 'api.teletype.atom.io',
    //     'Authorization': `token ${oauthToken}`
    //   }
    //   const response = await this.request.get(this.apiUrl + '/user', {headers})
    //   const user = JSON.parse(response)
    //   return {id: user.id.toString(), login: user.login}
    // } catch (e) {
    //   let errorMessage, statusCode
    //   if (e instanceof StatusCodeError) {
    //     const error = JSON.parse(e.error)
    //     const description = (error.message != null) ? error.message : e.error
    //     errorMessage = `${this.apiUrl} responded with ${e.statusCode}: ${description}`
    //     statusCode = e.statusCode
    //   } else {
    //     errorMessage = `Failed to query ${this.apiUrl}: ${e.message}`
    //     statusCode = 500
    //   }
    //
    //   const error = new Error(errorMessage)
    //   error.statusCode = statusCode
    //   throw error
    // }
  }

  async isOperational () {
    // we are always ready.
    return true

    // try {
    //   const headers = {
    //     'User-Agent': 'api.teletype.atom.io',
    //     'Authorization': `token ${this.oauthToken}`
    //   }
    //
    //   await this.request.get(this.apiUrl, {headers})
    //
    //   return true
    // } catch (e) {
    //   return false
    // }
  }
}
