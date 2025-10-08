import { Duration } from 'aws-cdk-lib'
import type { IEventBus, EventPattern } from 'aws-cdk-lib/aws-events'
import { Rule } from 'aws-cdk-lib/aws-events'
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets'
import type { SqsEventSourceProps } from 'aws-cdk-lib/aws-lambda-event-sources'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import type { QueueProps } from 'aws-cdk-lib/aws-sqs'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'
import { NodeJSLambda } from '../lambda'
import type { NodeJSLambdaProps } from '../lambda'

export interface DeadLetterQueueProps {
  readonly maxReceiveCount: number
}

export interface EventConsumerProps {
  readonly deadLetterQueueProps?: DeadLetterQueueProps
  readonly eventBus: IEventBus
  readonly eventPattern: EventPattern
  readonly eventSourceProps?: SqsEventSourceProps
  readonly handlerProps: NodeJSLambdaProps
  readonly queueProps?: QueueProps
}

export class EventConsumer extends Construct {
  readonly handler: NodeJSLambda
  readonly queue: Queue
  readonly deadLetterQueue: Queue

  constructor(scope: Construct, id: string, props: EventConsumerProps) {
    super(scope, id)

    this.deadLetterQueue = new Queue(this, 'dead-letter-queue', {
      enforceSSL: true,
    })

    this.queue = new Queue(this, 'queue', {
      ...props.queueProps,
      visibilityTimeout:
        props.queueProps?.visibilityTimeout ?? Duration.seconds(30),
      deadLetterQueue: {
        queue: this.deadLetterQueue,
        maxReceiveCount: props.deadLetterQueueProps?.maxReceiveCount ?? 3,
      },
      enforceSSL: true,
    })

    new Rule(this, 'rule', {
      eventBus: props.eventBus,
      eventPattern: props.eventPattern,
      targets: [new SqsQueue(this.queue)],
    })

    this.handler = new NodeJSLambda(this, 'handler', props.handlerProps)

    this.handler.addEventSource(
      new SqsEventSource(this.queue, props.eventSourceProps)
    )
  }
}
