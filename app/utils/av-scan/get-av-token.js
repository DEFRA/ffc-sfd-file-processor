const Wreck = require('@hapi/wreck')
const avConfig = require('../../config/index')

const getTokenRequestBody = new URLSearchParams({
  grant_type: avConfig.grantType,
  client_id: avConfig.clientId,
  client_secret: avConfig.clientSecret,
  scope: avConfig.scope
}).toString()

const getTokenHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

const getAVToken = async () => {
  try {
    const { res, payload } = await Wreck.post(avConfig.tokenUrl, {
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
