# AtlasCleanAI Enterprise

AtlasCleanAI Enterprise is a production-oriented monorepo for an AI-powered cleaning services platform. The platform serves customers booking cleaning services, field cleaners managing schedules and job execution, and internal operations teams overseeing workforce, routing, billing, and service quality.

## Repository Purpose

This repository contains the operational foundation for the platform:

- local development infrastructure with Docker Compose
- AWS deployment infrastructure with both CDK and Terraform options
- GitHub Actions pipelines for continuous integration and staged deployments
- shared Flutter packages for design and API integration consistency
- architecture, API, development, and deployment documentation

## Platform Capabilities

AtlasCleanAI Enterprise is designed to support:

- customer booking and service lifecycle management
- cleaner onboarding, scheduling, and work assignment flows
- secure authentication with short-lived access tokens and refresh tokens
- Redis-backed caching, session coordination, and asynchronous work orchestration
- PostgreSQL-backed transactional data for bookings, cleaners, pricing, and billing
- AI-powered scheduling, dispatch optimization, and service recommendations
- observability, environment isolation, and repeatable cloud deployments

## Monorepo Structure

```text
.
├── .github/workflows/          # CI and deployment automation
├── docs/                       # Architecture, API, dev, and deployment guides
├── infrastructure/
│   ├── aws/cdk/                # AWS CDK application
│   ├── docker/                 # Container build definitions
│   ├── nginx/                  # Reverse proxy and TLS configuration
│   └── terraform/              # Terraform alternative to CDK
├── packages/
│   ├── atlas_api_client/       # Shared Dart API client
│   └── atlas_design_system/    # Shared Flutter design system
└── docker-compose.yml          # Local development dependencies and services
```

## Architecture Overview

The recommended runtime architecture is:

- **Ingress**: NGINX locally and Application Load Balancer in AWS
- **API tier**: containerized Node.js backend running on ECS Fargate
- **Persistence**: PostgreSQL for relational data, Redis for cache and background workflows
- **Secrets**: AWS Secrets Manager and GitHub Actions secrets/OIDC integration
- **Observability**: CloudWatch logs, alarms, and health endpoints
- **Clients**: Flutter customer and cleaner applications using shared packages from `packages/`

Detailed design guidance is available in:

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/api.md`](docs/api.md)
- [`docs/development.md`](docs/development.md)
- [`docs/deployment.md`](docs/deployment.md)

## Local Development

### Prerequisites

Install the following on your workstation:

- Docker Engine 24+
- Docker Compose v2+
- Node.js 20 LTS or newer
- Flutter 3.13+
- AWS CLI v2 for cloud deployments
- Terraform 1.6+ if using the Terraform workflow

### Start supporting services

```bash
docker compose up -d postgres redis nginx
```

### Start the full local stack

```bash
docker compose up --build
```

The default local endpoints are:

- API: `http://localhost:3000`
- NGINX: `http://localhost` and `https://localhost`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### Environment variables

The backend expects the following core settings:

- `NODE_ENV`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `PORT` (optional, defaults to `3000`)

For local development, Docker Compose supplies working defaults. In shared or cloud environments, move secrets to environment-specific secret stores.

## CI/CD Strategy

The repository includes three GitHub Actions workflows:

- **CI Pipeline**: validates backend quality, Flutter packages/apps, and runs a repository security scan
- **Deploy Staging**: builds and deploys infrastructure/application changes to the staging AWS account
- **Deploy Production**: gated production deployment using GitHub Environments and AWS OIDC

### Required GitHub secrets and variables

Configure these repository or environment values before enabling deployments:

| Name | Type | Purpose |
| --- | --- | --- |
| `AWS_ROLE_TO_ASSUME` | Secret/Variable | IAM role assumed through OIDC |
| `AWS_REGION` | Variable | Target AWS region |
| `CDK_DEFAULT_ACCOUNT` | Variable | AWS account ID for CDK deployments |
| `CDK_DEFAULT_REGION` | Variable | AWS region for CDK deployments |
| `ATLAS_DOMAIN_NAME` | Variable | Public DNS name for the application |
| `ATLAS_CERTIFICATE_ARN` | Secret/Variable | ACM certificate ARN for HTTPS |
| `ECR_BACKEND_REPOSITORY` | Variable | Optional existing ECR repository name |

## Infrastructure Options

Two infrastructure-as-code implementations are provided so teams can choose the best fit for their delivery model.

### AWS CDK

Use the CDK project when you want strongly typed infrastructure definitions in TypeScript and closer integration with the application delivery pipeline.

```bash
cd infrastructure/aws/cdk
npm install
npm run synth
```

### Terraform

Use the Terraform configuration when you want provider-agnostic workflow conventions, stateful plan/apply operations, or to integrate with existing Terraform estates.

```bash
cd infrastructure/terraform
terraform init
terraform plan
```

## Shared Packages

### `atlas_design_system`

A reusable Flutter package with:

- Atlas brand colors
- consistent typography tokens
- pre-styled buttons, cards, and text fields
- a theme definition for customer and cleaner applications

### `atlas_api_client`

A reusable Dart package for:

- HTTP communication with the AtlasCleanAI backend
- consistent JSON parsing
- standard success/error response handling
- authenticated requests using bearer tokens

## Security Principles

This repository follows a production-minded baseline:

- no plaintext production secrets in source control
- isolated network tiers for public, application, and data resources
- TLS termination at the edge
- RDS and ElastiCache deployed into private subnets
- least-privilege IAM roles for workloads and deployment automation
- automated vulnerability scanning during CI

## Operational Notes

- Use staging as the first destination for schema, infrastructure, and deployment validation.
- Treat production deployments as environment-gated and reviewable operations.
- Prefer immutable image deployments via ECR rather than patching live containers.
- Keep infrastructure and application rollouts traceable through GitHub Actions workflow history.

## Next Steps

1. Add the backend service source code in `backend/` if it does not yet exist.
2. Add Flutter applications in `apps/customer_app` and `apps/cleaner_app` if they are not yet present.
3. Wire the shared Dart packages into the consuming mobile apps.
4. Provision AWS accounts, OIDC roles, and environment protections before enabling production deployment.
5. Establish migration, seeding, and backup policies for PostgreSQL.

## License

This repository should use the organization-approved proprietary or commercial license for AtlasCleanAI Enterprise deployment assets.
