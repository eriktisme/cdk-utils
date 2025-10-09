import { App, Stack as DummyStack } from 'aws-cdk-lib'
import { Stack, StackProps } from '../../src'

const app = new App()

describe('Stack', () => {
  it('should throw error if region is not provided', () => {
    const props: StackProps = {
      projectName: 'test',
      stage: 'test',
      env: {},
    }

    expect(() => new Stack(app, 'MyStack', props)).toThrow(
      'Region is required in the environment configuration.'
    )
  })

  it('should throw if parent stack is not an instance of Stack', () => {
    const dummy = new DummyStack(app, 'DummyStack')

    expect(() => Stack.getStack(dummy)).toThrow(
      /Parent stack of DummyStack is not an instance of Stack/
    )
  })

  it('should set the stack name correctly', () => {
    const props: StackProps = {
      projectName: 'test',
      stage: 'test',
      env: { region: 'us-east-1' },
    }

    const stack = new Stack(app, 'MyStack', props)

    expect(stack.stackName).toBe('test-test-MyStack')
  })

  describe('getStack', () => {
    it('should return the stack instance', () => {
      const props: StackProps = {
        projectName: 'test',
        stage: 'test',
        env: { region: 'us-east-1' },
      }

      const stack = new Stack(app, 'GetStack', props)

      expect(Stack.getStack(stack)).toBe(stack)
    })
  })
})
