# AtlasCleanAI Enterprise Architecture

## Overview

AtlasCleanAI Enterprise is designed as a service-oriented platform that supports customer booking flows, cleaner operations, dispatch intelligence, and administrative oversight. The architecture prioritizes secure-by-default networking, workload isolation, repeatable infrastructure provisioning, and operational observability.

## Core Domains

### Customer experience

The customer-facing experience handles:

- service discovery and booking
- address and availability capture
- quote presentation and payment initiation
- booking updates, notifications, and issue reporting

### Cleaner operations

The cleaner-facing experience handles:

- shift and route awareness
- assignment acceptance and status updates
- navigation to service locations
- proof-of-service capture and issue escalation

### Operations and AI services

The internal platform handles:

- workforce scheduling
- dynamic dispatch and route optimization
- pricing and promotional logic
- customer support and SLA monitoring
- analytics, forecasting, and AI-assisted recommendations

## Reference Runtime Topology

```text
Flutter Apps / Web Clients
          |
          v
   Edge / Load Balancer
          |
          v
      API Service
          |
    +-----+-----+
    |           |
    v           v
 PostgreSQL   Redis
    |
    v
 Backups / Analytics / Reporting
```

## Network Layout

The AWS reference implementation uses a three-tier VPC layout.

### Public subnets

Public subnets contain only edge-facing resources:

- Application Load Balancer
- NAT gateways

### Application subnets

Private application subnets contain stateless compute:

- ECS Fargate tasks for the backend API
- future background workers and event processors

### Data subnets

Private isolated data subnets contain stateful services:

- Amazon RDS for PostgreSQL
- Amazon ElastiCache for Redis

This separation limits lateral movement, reduces accidental exposure risk, and supports more targeted network controls.

## Application Layer

The backend API is assumed to be a containerized Node.js service that exposes:

- REST endpoints for mobile and web clients
- health endpoints for orchestration and monitoring
- database-backed business operations
- Redis-backed cache, queue, or coordination capabilities

Recommended backend responsibilities include:

- authentication and authorization
- booking orchestration
- cleaner availability management
- pricing and payment integrations
- AI-driven scheduling and ranking services
- audit logging and compliance event capture

## Data Layer

### PostgreSQL

PostgreSQL is the system of record for:

- users and roles
- bookings and service jobs
- cleaner profiles and compliance metadata
- invoices, payouts, and reconciliation state
- operational audit events

Production guidance:

- enable encryption at rest
- keep the database private-only
- use automatic backups with defined retention
- apply schema migrations through CI/CD or controlled release automation

### Redis

Redis supports:

- cache acceleration for frequently requested data
- short-lived coordination state
- rate limiting or session invalidation
- queueing or job orchestration patterns

Production guidance:

- enable transit and at-rest encryption
- avoid treating Redis as the primary system of record
- set TTLs intentionally for ephemeral data

## Security Model

### Authentication and secrets

- Access and refresh tokens are stored and rotated via application secrets.
- Production secrets belong in AWS Secrets Manager or equivalent secret stores.
- GitHub Actions uses OIDC role assumption instead of long-lived cloud credentials.

### Transport security

- TLS termination occurs at the edge in AWS and can be simulated locally via NGINX.
- Security headers are configured at the reverse proxy layer.
- Internal service traffic stays inside the VPC.

### IAM and workload isolation

- ECS execution roles pull images and publish logs.
- ECS task roles access only the secrets and AWS APIs the service requires.
- Deployment roles are scoped to infrastructure lifecycle and image publication activities.

## Observability

Recommended production telemetry includes:

- load balancer request metrics and access logs
- API structured application logs
- ECS CPU, memory, and task restart alerts
- PostgreSQL connections, storage, and latency metrics
- Redis memory and failover metrics
- synthetic or external uptime checks against `/health`

## Scaling Strategy

### Horizontal scaling

The ECS service scales horizontally based on utilization and traffic volume.

### Vertical scaling

Increase task CPU/memory or database class sizes when sustained headroom is insufficient.

### Data growth strategy

- partition or archive old operational records where appropriate
- offload analytical workloads to downstream stores instead of primary OLTP paths
- introduce read replicas when read volume justifies the complexity

## Deployment Environments

### Staging

Used for:

- infrastructure validation
- schema verification
- deployment automation checks
- end-to-end integration and smoke testing

### Production

Used for:

- customer-facing traffic
- controlled, environment-gated releases
- stricter retention, deletion protection, and high-availability settings

## Extensibility Roadmap

The current foundation supports future additions such as:

- event-driven worker services for notifications and billing reconciliation
- AI microservices for scheduling optimization and anomaly detection
- admin dashboards and reporting services
- blue/green or canary deployment strategies
