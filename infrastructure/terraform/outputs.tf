output "vpc_id" {
  description = "ID of the AtlasClean VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs for ingress resources."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Application private subnet IDs for ECS services."
  value       = aws_subnet.private[*].id
}

output "data_subnet_ids" {
  description = "Isolated data subnet IDs for stateful resources."
  value       = aws_subnet.data[*].id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster."
  value       = aws_ecs_cluster.main.name
}

output "backend_ecr_repository_url" {
  description = "ECR repository URL for the backend image."
  value       = aws_ecr_repository.backend.repository_url
}

output "load_balancer_dns_name" {
  description = "Public DNS name of the application load balancer."
  value       = aws_lb.main.dns_name
}

output "database_endpoint" {
  description = "RDS PostgreSQL endpoint address."
  value       = aws_db_instance.main.address
}

output "redis_primary_endpoint" {
  description = "Primary Redis endpoint."
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}
