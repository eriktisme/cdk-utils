import { AwsCdkConstructLibrary } from 'projen/lib/awscdk'
import { NodePackageManager, NpmAccess } from 'projen/lib/javascript'

const project = new AwsCdkConstructLibrary({
  author: 'eriktisme',
  authorAddress: '',
  cdkVersion: '2.219.0',
  defaultReleaseBranch: 'master',
  devDeps: ['esbuild'],
  eslintOptions: {
    dirs: ['src', 'test'],
    devdirs: ['test'],
    prettier: true,
  },
  name: 'cdk-utils',
  npmAccess: NpmAccess.PUBLIC,
  packageManager: NodePackageManager.PNPM,
  packageName: '@evandam93/cdk-utils',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/eriktisme/cdk-utils.git',
})

project.synth()
