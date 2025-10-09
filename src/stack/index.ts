import type { StackProps as BaseStackProps } from 'aws-cdk-lib'
import { Stack as BaseStack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

export interface StackProps extends BaseStackProps {
  readonly projectName: string
  readonly stage: string
}

export class Stack extends BaseStack {
  public static getStack(scope: Construct): Stack {
    const stack = Stack.of(scope)

    if (!(stack instanceof Stack)) {
      throw Error(
        `Parent stack of ${scope.node.path} is not an instance of Stack`
      )
    }

    return stack
  }

  /**
   * The name of the project.
   */
  readonly projectName: string

  /**
   * The stage of the project, e.g., 'dev', 'staging', 'prod'.
   */
  readonly stage: string

  constructor(scope: Construct, id: string, props: StackProps) {
    if (!props.env?.region) {
      throw new Error('Region is required in the environment configuration.')
    }

    super(scope, `${props.stage}-${props.projectName}-${id}`, {
      ...props,
      stackName: [
        props.stage,
        props.projectName,
        ...scope.node.scopes.map((p) => p.node.id).filter((v) => !!v),
        id,
      ].join('-'),
    })

    this.projectName = props.projectName
    this.stage = props.stage
  }
}
