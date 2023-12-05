const { createConnection } = require('../../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Consumer channel created!')

    const exchange = 'my_fanout_exchange'
    const queue = 'my_queue'

    // Assert the fanout exchange
    ch.assertExchange(exchange, 'fanout', { durable: true })

    // Assert the queue and bind it to the fanout exchange
    ch.assertQueue(queue, { durable: true })
      .then(() => {
        ch.bindQueue(queue, exchange, '')
        console.log(`Queue '${queue}' bound to exchange '${exchange}'`)

        // Start consuming messages from the queue
        ch.consume(queue, (msg) => {
          if (msg !== null) {
            console.log(`Received message: ${msg.content.toString()}`)
            // Acknowledge the message to inform RabbitMQ that it has been processed
            ch.ack(msg)
          }
        })
      })
      .catch(err => {
        console.error('Queue assertion error:', err)
      })
  })
  .catch(err => {
    console.error('Connection error:', err)
  })
