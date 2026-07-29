#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AtlasCleanStack } from '../lib/atlasclean-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') ?? process.env.STAGE ?? 'staging';
const domainName = app.node.tryGetContext('domainName') ?? process.env.ATLAS_DOMAIN_NAME;
const certificateArn = app.node.tryGetContext('certificateArn') ?? process.env.ATLAS_CERTIFICATE_ARN;

new AtlasCleanStack(app, `AtlasClean-${stage}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION ?? 'us-east-1',
  },
  stage,
  domainName,
  certificateArn,
});
