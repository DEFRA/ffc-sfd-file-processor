const util = require('util')
const { sendToFileReceiver } = require('./send-to-file-receiver')
const { MessageReceiver } = require('ffc-messaging')
const messageConfig = require('../config/receiver')

const handleMessage = async (message, receiver) => {
  try {
    console.log('Received message:', message.body)
    await sendToFileReceiver(message)
  } catch (err) {
    console.error('Message error', util.inspect(err.message, false, null, true))
  }
}
const startMessaging = async () => {
  let filesReceiver //eslint-disable-line
  const receiverAction = (message) => handleMessage(message, filesReceiver)
  console.log('Receiver Subscription Config:', messageConfig.receiverSubscription)
  filesReceiver = new MessageReceiver(
    messageConfig.receiverSubscription,
    receiverAction
  )
  await filesReceiver.subscribe()
  console.log('Subscribed to Service Bus')
}

module.exports = { handleMessage, startMessaging }
