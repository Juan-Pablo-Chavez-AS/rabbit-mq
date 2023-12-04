const { createConnection } = require('../../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const queue = 'MessageQ'
    const exchange = 'logs'
    const exchangeOptions = { durable: true }

    ch.assertExchange(exchange, 'fanout', exchangeOptions)
      .then(() => {
        console.log(`Exchange '${exchange}' recreated with durability.`)

        setInterval(() => {
          console.log(' [x] %s - Sending message', new Date())
          ch.publish(exchange, queue, Buffer.from('Fanout message!'))
        }, 5000)
      })
      .catch(err => {
        console.error('Error:', err)
      })
  })
  .catch(err => {
    console.error('Connection error:', err)
  })
