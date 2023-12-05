const { createConnection } = require('../../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Producer channel created!')

    const exchange = 'my_fanout_exchange'

    // Assert the fanout exchange
    ch.assertExchange(exchange, 'fanout', { durable: true })

    // Message to be sent
    const message = 'Hello, this is a fanout message from the producer!'

    // Close the channel and the connection
    setInterval(() => {
      ch.publish(exchange, '', Buffer.from(message))
      console.log(`Message sent to fanout exchange '${exchange}': ${message}`)
    }, 1000) // Adjust the time here (in milliseconds) as per your requirement
  })
  .catch(err => {
    console.error('Connection error:', err)
  })
