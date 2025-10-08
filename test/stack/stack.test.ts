import { App } from 'aws-cdk-lib'
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

  it('should set the stack name correctly', () => {
    const props: StackProps = {
      projectName: 'test',
      stage: 'test',
      env: { region: 'us-east-1' },
    }

    const stack = new Stack(app, 'MyStack', props)

    expect(stack.stackName).toBe('test-test-MyStack')
  })
})
