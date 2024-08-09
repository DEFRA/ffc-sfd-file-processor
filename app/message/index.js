const util = require('util')
const { sendToFileReceiver } = require('./send-to-file-receiver')

const handleMessage = async (message, receiver) => {
  try {
    console.log('Received message:', message.body)
    await sendToFileReceiver(message)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Message error', util.inspect(err.message, false, null, true))
  }
}

module.exports = { handleMessage }
