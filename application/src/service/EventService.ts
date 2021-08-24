import Debug from "debug";
import {IMetaData, IEventHubConnectionProps, IEventService} from '../types'
import { EventHubProducerClient } from '@azure/event-hubs'
const assert = require('assert')
const debug = require('debug')('eventproducer')

export const EventService = (props:IEventHubConnectionProps) : IEventService => {
  const { connectionString, eventHubName } = props

  debug(`EventFactory`)
  debug(`connectionString: ${connectionString}`)
  debug(`eventHubName: ${eventHubName}`)
  
  async function produce (eventsToSend: IMetaData[]) {
    assert(Array.isArray(eventsToSend), 'eventsToSend should be array')

    const producer = new EventHubProducerClient(connectionString, eventHubName)

    debug('Creating and sending a batch of events...')

    try {
      // By not specifying a partition ID or a partition key we allow the server to choose
      // which partition will accept this message.
      //
      // This pattern works well if the consumers of your events do not have any particular
      // requirements about the ordering of batches against other batches or if you don't care
      // which messages are assigned to which partition.
      //
      // If you would like more control you can pass either a `partitionKey` or a `partitionId`
      // into the createBatch() `options` parameter which will allow you full control over the
      // destination.
      const batchOptions = {
        // The maxSizeInBytes lets you manually control the size of the batch.
        // if this is not set we will get the maximum batch size from Event Hubs.
        //
        // For this sample you can change the batch size to see how different parts
        // of the sample handle batching. In production we recommend using the default
        // and not specifying a maximum size.
        //
        // maxSizeInBytes: 200
      }

      let batch = await producer.createBatch(batchOptions)

      let numEventsSent = 0

      // add events to our batch
      let i = 0
      while (i < eventsToSend.length) {
        // messages can fail to be added to the batch if they exceed the maximum size configured for
        // the EventHub.

        debug(eventsToSend[i])

        const isAdded = batch.tryAdd({ body: eventsToSend[i] })

        if (isAdded) {
          debug(`Added eventsToSend[${i}] to the batch`)
          ++i
          continue
        }

        if (batch.count === 0) {
          // If we can't add it and the batch is empty that means the message we're trying to send
          // is too large, even when it would be the _only_ message in the batch.
          //
          // At this point you'll need to decide if you're okay with skipping this message entirely
          // or find some way to shrink it.
          debug(`Message was too large and can't be sent until it's made smaller. Skipping...`)
          ++i
          continue
        }

        // otherwise this just signals a good spot to send our batch
        debug(`Batch is full - sending ${batch.count} messages as a single batch.`)
        await producer.sendBatch(batch)
        numEventsSent += batch.count

        // and create a new one to house the next set of messages
        batch = await producer.createBatch(batchOptions)
      }

      // send any remaining messages, if any.
      if (batch.count > 0) {
        debug(`Sending remaining ${batch.count} messages as a single batch.`)
        await producer.sendBatch(batch)
        numEventsSent += batch.count
      }

      debug(`Sent ${numEventsSent} events`)

      if (numEventsSent !== eventsToSend.length) {
        throw new Error(`Not all messages were sent (${numEventsSent}/${eventsToSend.length})`)
      }
    } catch (err) {
      debug('Error when creating & sending a batch of events: ', err)
    } finally {
      await producer.close()
      debug(`Closed event producer`)
    }
  }

  return {
    produce    
  }
}

