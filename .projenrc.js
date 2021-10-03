const { AwsCdkConstructLibrary, DevEnvironmentDockerImage, Gitpod } = require('projen');
const { Mergify } = require('projen/lib/github');
const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  description: 'CDK construct library for CloudFront Extensions',
  cdkVersion: '1.73.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-cloudfront-plus',
  repositoryUrl: 'https://github.com/pahud/cdk-cloudfront-plus.git',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-cloudfront-origins',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-kinesisfirehose',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-sam',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-deployment',
  ],
  devDeps: [
    '@types/node',
    'aws-sdk',
    'esbuild',
    'axios',
  ],
  bundledDeps: [
    'dotenv',
    'esbuild',
  ],
  publishToPypi: {
    distName: 'cdk-cloudfront-plus',
    module: 'cdk_cloudfront_plus',
  },
  keywords: [
    'cdk',
    'cloudfront',
    'cdn',
    'extension',
  ],
  cdkTestDependencies: [
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-deployment',
  ],
  testdir: 'src/__tests__',
  mergify: false,
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud'],
  },
});

project.package.addField('resolutions', {
  'pac-resolver': '^5.0.0',
  'set-value': '^4.0.1',
  'ansi-regex': '^5.0.1',
});


const gitpodPrebuild = project.addTask('gitpod:prebuild', {
  description: 'Prebuild setup for Gitpod',
});
// install and compile only, do not test or package.
gitpodPrebuild.exec('yarn install --frozen-lockfile --check-files');
gitpodPrebuild.exec('npx projen compile');

let gitpod = new Gitpod(project, {
  dockerImage: DevEnvironmentDockerImage.fromImage('public.ecr.aws/pahudnet/gitpod-workspace:latest'),
  prebuilds: {
    addCheck: true,
    addBadge: true,
    addLabel: true,
    branches: true,
    pullRequests: true,
    pullRequestsFromForks: true,
  },
});

gitpod.addCustomTask({
  init: 'yarn gitpod:prebuild',
  // always upgrade after init
  command: 'npx projen upgrade',
});

gitpod.addVscodeExtensions(
  'dbaeumer.vscode-eslint',
  'ms-azuretools.vscode-docker',
  'AmazonWebServices.aws-toolkit-vscode',
);

const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'dependabot.yml',
  'demo-assets',
  '.env',
];
project.npmignore.exclude(...common_exclude, 'images');
project.gitignore.exclude(...common_exclude);

project.synth();
