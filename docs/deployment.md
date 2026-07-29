# AtlasCleanAI Enterprise Deployment Guide

## Deployment Model

AtlasCleanAI Enterprise uses a staged deployment model:

1. code merges to `develop`
2. staging deployment runs automatically
3. validation occurs in staging
4. code is promoted to `main`
5. production deployment runs with environment protections

## GitHub Actions Deployment Workflows

### Staging

The staging workflow:

- triggers on pushes to `develop`
- assumes an AWS role using GitHub OIDC
- installs CDK dependencies
- synthesizes infrastructure
- deploys the `AtlasClean-staging` stack

### Production

The production workflow:

- triggers on pushes to `main` and version tags
- assumes a production-scoped AWS role
- synthesizes infrastructure before deployment
- deploys the `AtlasClean-production` stack
- should be protected by GitHub Environment approvals

## AWS Prerequisites

Create or confirm:

- dedicated staging and production AWS accounts or well-isolated environments
- ACM certificates for the deployment domain
- a Route53 hosted zone for the public domain
- an IAM role trusted by GitHub's OIDC provider
- GitHub environment variables and secrets for region, account, and certificates

## OIDC Role Guidance

The deployment role should:

- trust `token.actions.githubusercontent.com`
- restrict audience to `sts.amazonaws.com`
- scope repository and branch conditions tightly
- allow only the AWS actions required for CDK deployment

Example policy areas:

- CloudFormation stack management
- ECS, ECR, EC2, IAM pass-role, RDS, ElastiCache, Route53, and Logs permissions
- SSM or Secrets Manager access where deployment-time lookups are required

## Deployment Using CDK

### One-time setup

```bash
cd infrastructure/aws/cdk
npm install
npx cdk bootstrap aws://<account-id>/<region>
```

### Staging deploy

```bash
npm run deploy:staging
```

### Production deploy

```bash
npm run deploy:production
```

## Deployment Using Terraform

### Initialize

```bash
cd infrastructure/terraform
terraform init
```

### Plan

```bash
terraform plan \
  -var="db_password=<secure-password>" \
  -var="jwt_secret=<secure-secret>" \
  -var="jwt_refresh_secret=<secure-refresh-secret>"
```

### Apply

```bash
terraform apply \
  -var="db_password=<secure-password>" \
  -var="jwt_secret=<secure-secret>" \
  -var="jwt_refresh_secret=<secure-refresh-secret>"
```

## Operational Runbook Considerations

### Before deployment

- verify CI is green
- review infrastructure diffs or Terraform plans
- confirm database migration compatibility
- confirm image tags and release notes

### After deployment

- check the load balancer health status
- verify `/health` and `/ready`
- inspect ECS task logs for startup errors
- confirm database and Redis connectivity metrics remain healthy
- perform smoke tests for login, booking, and assignment workflows

## Rollback Strategy

### Infrastructure-level rollback

- CDK: redeploy a previous known-good commit or revert the stack change and deploy again
- Terraform: apply a previously approved configuration state after confirming impact

### Application-level rollback

- redeploy a previous backend container image tag
- avoid destructive schema changes without backwards-compatible rollout plans

## Data Protection Guidance

- enable automated backups and retention on RDS
- preserve production snapshots before risky database operations
- keep Redis focused on ephemeral workloads
- protect production resources with deletion protection and environment approvals

## Release Readiness Checklist

- environment variables and secrets configured
- DNS and certificate configuration validated
- alarms and logs visible to the operations team
- staging sign-off completed
- production approval granted
