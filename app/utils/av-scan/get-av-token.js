const Wreck = require('@hapi/wreck')
const config = require('../../config/av-scan')

const getTokenRequestBody = new URLSearchParams({
  grant_type: config.grantType,
  client_id: config.clientId,
  client_secret: config.clientSecret,
  scope: config.scope
}).toString()

const getTokenHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

async function getAVToken () {
  try {
    const { res, payload } = await Wreck.post(config.tokenUrl, {
      payload: getTokenRequestBody,
      headers: getTokenHeaders
    })
    if (res.statusCode !== 200) {
      throw new Error(`Token Request Failed: ${res.statusCode} ${res.statusMessage}`)
    }
    const token = JSON.parse(payload.toString('utf8'))
    return `${token.token_type} ${token.access_token}`
  } catch (error) {
    console.error('ERROR in getting AV token:', error)
    throw error
  }
}

module.exports = { getAVToken }
