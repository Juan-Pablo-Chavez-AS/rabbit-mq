const { createConnection } = require('../../connection')
const { sample } = require('lodash')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const exchange = 'direct_logs'

    ch.assertExchange(exchange, 'direct', { durable: true })

    setInterval(() => {
      const severity = sample(['critical', 'info', 'warning'])
      console.log(' [x] Sending message [%s]', severity)
      ch.assertQueue(exchange, severity, Buffer.from('Hello World!')).then((q) => {
        ch.sendToQueue(q.queue)
      })
    }, 1000)
  })
