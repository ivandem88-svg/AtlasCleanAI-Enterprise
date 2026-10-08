# AtlasCleanAI Enterprise Development Guide

## Development Goals

This repository is structured to let teams work on infrastructure, backend services, and shared Flutter packages within a single delivery model. The goal is consistent local setup, predictable CI behavior, and shared standards across product surfaces.

## Prerequisites

Install:

- Docker Engine and Docker Compose
- Node.js 20+
- Flutter 3.13+
- Dart SDK matching the Flutter toolchain
- AWS CLI v2 for infrastructure work
- Terraform 1.6+ if using Terraform

## Local Bootstrapping

### Infrastructure services

Start stateful dependencies first:

```bash
docker compose up -d postgres redis nginx
```

Run the full local stack when the backend source code is available:

```bash
docker compose up --build
```

### Shared package setup

For Flutter package work:

```bash
cd packages/atlas_design_system
flutter pub get

cd ../atlas_api_client
dart pub get
```

## Coding Standards

### Infrastructure

- prefer immutable infrastructure changes
- keep environment-specific differences data-driven
- use encrypted storage and private subnet placement for stateful services
- avoid long-lived IAM credentials in CI/CD

### Dart and Flutter

- keep widgets composable and theme-aware
- centralize tokens in the design system rather than duplicating colors or text styles
- prefer typed API response parsing over unstructured maps in app code

### Backend expectations

When backend code is added:

- expose `/health` and `/ready` endpoints
- keep configuration environment-driven
- use structured logs
- isolate business logic from transport concerns

## Recommended Workflow

1. create a feature branch
2. update infrastructure or shared packages in small, reviewable slices
3. run targeted local validation
4. open a pull request against `develop`
5. allow CI to validate security scanning and package quality
6. merge to `develop` for staging deployment
7. promote to `main` for production deployment

## Validation Commands

### Shared packages

```bash
cd packages/atlas_design_system
flutter pub get
dart analyze lib

cd ../atlas_api_client
dart pub get
dart analyze lib
```

### CDK

```bash
cd infrastructure/aws/cdk
npm install
npm run synth
```

### Terraform

```bash
cd infrastructure/terraform
terraform init
terraform validate
```

## Environment Variables

### Backend runtime

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV`
- `PORT`

### CDK deployment

- `CDK_DEFAULT_ACCOUNT`
- `CDK_DEFAULT_REGION`
- `ATLAS_DOMAIN_NAME`
- `ATLAS_CERTIFICATE_ARN`
- `STAGE`

## Branching and Release Flow

- `develop` is the integration branch for staging releases
- `main` is the stable branch for production releases
- version tags such as `v1.2.0` can be used to mark production release points

## Troubleshooting

### Docker Compose backend fails to start

Check whether `backend/` exists and includes `package.json`, a build script, and an entry point compiled to `dist/main.js`.

### CDK deploy cannot assume role

Verify:

- GitHub OIDC trust is configured in AWS
- the `AWS_ROLE_TO_ASSUME` secret matches the intended role ARN
- the target environment exposes required `vars.*` values

### Terraform apply fails on credentials

Run `aws sts get-caller-identity` locally to confirm the active AWS profile or assumed role before applying.
