const { createConnection } = require('../../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const exchange = 'direct_logs'
    ch.assertExchange(exchange, 'direct', { durable: true })

    // When we supply wueue name as an empty string, we create a non-durable queue
    // with a generated name
    ch.assertQueue(exchange)
      .then(q => {
        console.log(' [*] Waiting for messages in %s.', q.queue)
        // Binding all routingKey
        ch.bindQueue(q.queue, exchange, 'info')
        ch.bindQueue(q.queue, exchange, 'warning')
        ch.bindQueue(q.queue, exchange, 'critical')

        ch.consume(q.queue, (msg) => {
          if (msg !== null) {
            console.log('%s [x] %s [%s]', Date.now(), msg.content.toString(), msg.fields.routingKey)
          }
        }, {
          noAck: true
        })
      })
  })
