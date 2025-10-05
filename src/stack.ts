import type { StackProps as BaseStackProps } from 'aws-cdk-lib'
import { Stack as BaseStack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

export interface StackProps extends BaseStackProps {
  readonly projectName: string
  readonly stage: string
}

export class Stack extends BaseStack {
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
  }
}
