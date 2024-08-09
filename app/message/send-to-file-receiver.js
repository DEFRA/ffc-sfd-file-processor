const { MessageSender } = require('ffc-messaging')
const { senderConfig } = require('../config')

const sendToFileReceiver = async (message) => {
  const sender = new MessageSender(senderConfig.senderTopic)
  try {
    await sender.sendMessage({
      body: message.body,
      type: 'send-to-file-receiver',
      source: 'ffc-sfd-file-processor'
    })
    console.log('Message sent to file receiver:', message.body)
  } catch (error) {
    throw new Error(`Error sending message to file receiver: ${error.message}`)
  }
}

module.exports = { sendToFileReceiver }
