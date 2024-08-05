const Wreck = require('@hapi/wreck')
const config = require('../../config/av-scan')

async function sendToAvScan (token, fileDetails) {
  const fetchUrl = `${config.avBaseUrl}syncAv/${fileDetails.collection}/${fileDetails.key}?persistFile=false`
  const headers = { Authorization: token }

  try {
    console.log('Sending the file for scanning...')
    const { payload, res } = await Wreck.put(fetchUrl, {
      payload: fileDetails,
      headers,
      json: true
    })

    if (res.statusCode === 200) {
      return parseScanResult(payload.toString('utf8'), fileDetails)
    } else if (res.statusCode === 504) {
      return createScanResult('un-readable', fileDetails, false)
    } else {
      throw new Error('Could not get a successful response from the server')
    }
  } catch (error) {
    console.error('Error in sending file to scan:', error)
    throw error
  }
}

function parseScanResult (data, fileDetails) {
  const status = data.split(' ')[1]
  const isSafe = status === 'Clean'
  return createScanResult(status, fileDetails, isSafe)
}

function createScanResult (status, fileDetails, isSafe) {
  return {
    status,
    key: fileDetails.key,
    collection: fileDetails.collection,
    fileName: fileDetails.fileName,
    isSafe,
    isScanned: true
  }
}

module.exports = { sendToAvScan }
