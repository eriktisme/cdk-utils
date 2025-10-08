import { App, Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { EventBus } from 'aws-cdk-lib/aws-events'
import { EventConsumer, EventConsumerProps } from '../../src'

const app = new App()

describe('Event Consumer', () => {
  it('should create the default resources', () => {
    const stack = new Stack(app, 'TestStack')

    const eventBus = new EventBus(stack, 'TestBus', {
      //
    })

    const props: EventConsumerProps = {
      handlerProps: {
        entry: './test/event-consumer/handler.ts',
      },
      eventBus,
      eventPattern: {
        detailType: ['event-name'],
        source: ['event-source'],
      },
    }

    new EventConsumer(stack, 'TestConsumer', props)

    const template = Template.fromStack(stack)

    template.resourceCountIs('AWS::SQS::Queue', 2)
    template.resourceCountIs('AWS::Events::Rule', 1)
    template.resourceCountIs('AWS::Lambda::Function', 1)

    template.hasResourceProperties('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: Match.anyValue(),
        maxReceiveCount: Match.anyValue(),
      },
    })

    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['event-name'],
        source: ['event-source'],
      },
    })

    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      EventSourceArn: { 'Fn::GetAtt': Match.anyValue() },
      FunctionName: { Ref: Match.anyValue() },
    })
  })
})
