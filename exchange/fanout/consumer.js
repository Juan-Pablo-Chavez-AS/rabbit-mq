const { createConnection } = require('../../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const queue = 'MessageQ'
    const exchange = 'logs'
    ch.assertExchange(exchange, 'fanout', { durable: true })

    // When we supply queue name as an empty string, we create a non-durable queue
    // with a generated name
    ch.assertQueue(queue, { exclusive: true })
      .then(q => {
        console.log(' [*] Waiting for messages in %s.', q.queue)
        ch.bindQueue(q.queue, exchange, '')

        ch.consume(q.queue, (msg) => {
          if (msg !== null) {
            console.log(' [x] %s', msg.content.toString())
          }
        }, {
          noAck: true
        })
      })
  })
