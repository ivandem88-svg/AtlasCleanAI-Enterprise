variable "aws_region" {
  description = "AWS region used for AtlasCleanAI Enterprise infrastructure."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix used for resource naming."
  type        = string
  default     = "atlasclean"
}

variable "environment" {
  description = "Deployment environment name such as staging or production."
  type        = string
  default     = "staging"
}

variable "vpc_cidr" {
  description = "CIDR block for the application VPC."
  type        = string
  default     = "10.40.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.40.0.0/24", "10.40.1.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for application private subnets."
  type        = list(string)
  default     = ["10.40.10.0/24", "10.40.11.0/24"]
}

variable "data_subnet_cidrs" {
  description = "CIDR blocks for isolated data subnets."
  type        = list(string)
  default     = ["10.40.20.0/24", "10.40.21.0/24"]
}

variable "backend_image" {
  description = "Fully qualified backend image URI to deploy to ECS."
  type        = string
  default     = "public.ecr.aws/docker/library/node:18-alpine"
}

variable "backend_port" {
  description = "Backend container port."
  type        = number
  default     = 3000
}

variable "desired_count" {
  description = "Desired ECS task count."
  type        = number
  default     = 1
}

variable "cpu" {
  description = "Fargate CPU units for the backend task."
  type        = number
  default     = 512
}

variable "memory" {
  description = "Fargate memory in MiB for the backend task."
  type        = number
  default     = 1024
}

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "atlasclean"
}

variable "db_username" {
  description = "PostgreSQL master username."
  type        = string
  default     = "atlasclean"
}

variable "db_password" {
  description = "PostgreSQL master password."
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret for application access tokens."
  type        = string
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT signing secret for refresh tokens."
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Optional Route53 hosted zone and application domain name."
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "Optional ACM certificate ARN used to enable HTTPS on the load balancer."
  type        = string
  default     = ""
}
