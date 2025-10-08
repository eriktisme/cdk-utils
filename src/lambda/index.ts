import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda'
import type { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import {
  NodejsFunction,
  OutputFormat,
  SourceMapMode,
} from 'aws-cdk-lib/aws-lambda-nodejs'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import type { Construct } from 'constructs'

export interface NodeJsLambdaRetentionProps {
  readonly days?: RetentionDays
  readonly removalPolicy?: RemovalPolicy
}

export interface NodeJSLambdaProps extends NodejsFunctionProps {
  readonly retention?: NodeJsLambdaRetentionProps
}

export class NodeJSLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: NodeJSLambdaProps) {
    super(scope, id, {
      ...props,
      memorySize: props.memorySize ?? 256,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: false,
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: true,
        target: 'ESNext',
        format: OutputFormat.ESM,
        keepNames: true,
        sourceMap: true,
        sourceMapMode: SourceMapMode.INLINE,
        bundleAwsSDK: false,
        sourcesContent: false,
        banner: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        ...props.bundling,
      },
      runtime: Runtime.NODEJS_22_X,
      timeout: props.timeout ?? Duration.seconds(15),
      tracing: Tracing.ACTIVE,
      environment: {
        ...props.environment,
        AWS_XRAY_CONTEXT_MISSING: 'IGNORE_ERROR',
      },
    })

    new LogGroup(this, 'log-group', {
      logGroupName: `/aws/lambda/${this.functionName}`,
      retention: props.retention?.days ?? RetentionDays.FIVE_DAYS,
      removalPolicy: props.retention?.removalPolicy ?? RemovalPolicy.DESTROY,
    })
  }
}
