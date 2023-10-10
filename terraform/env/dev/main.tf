variable "service" { type = string }
variable "environment" { type = string }
variable "access_key" { type = string }
variable "secret_key" { type = string }
variable "region" { type = string }
variable "db_identifier" { type = string }
variable "db_name" { type = string }
variable "db_username" { type = string }
variable "db_password" { type = string }
variable "source_url" { type = string }
variable "source_branch" { type = string }
variable "app_env_url" { type = string }
variable "app_env_jwt_token_secret" { type = string }
variable "app_env_database_url_ssm" { type = string }
variable "build_command" { type = string }
variable "start_command" { type = string }
variable "webacl_allow_ip" { type = list(string) }

terraform {
  required_version = ">=1.5.7"
  # ※backendブロックは 一度指定のs3を作成後に有効化すること
  # ※変数は利用できない
  backend "s3" {
    bucket  = "terraform-state-bill-swift-develop"
    region  = "ap-northeast-1"
    key     = "terraform.tfstate"
    profile = "bill-swift-develop" # profile を利用している場合は指定
    encrypt = true
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.3.0"
    }
  }
}

provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region

  default_tags {
    tags = {
      Environment = var.environment
      Service     = var.service
    }
  }
}

// tfstateを管理するためのS3 バケット
resource "aws_s3_bucket" "terraform_state" {
  bucket = "terraform-state-bill-swift-develop"
}

// VPC関係
module "network" {
  source   = "../../modules/vpc"
  system   = var.service
  env      = var.environment
  cidr_vpc = "10.255.0.0/16"
  cidr_public = [
    "10.255.1.0/24",
    "10.255.2.0/24"
  ]
  cidr_private = [
    "10.255.101.0/24",
    "10.255.102.0/24"
  ]
  cidr_secure = []
}

// RDS接続許可用
module "security_group_rds" {
  source = "../../modules/security_group"

  vpc_security_group = {
    vpc_id      = module.network.vpc_id
    name        = "${var.service}-${var.environment}-rds-sg"
    description = "for RDS"
  }

  # インバウンドルール
  ingress_rule_map = {
    rds = {
      from_port                = 3306
      to_port                  = 3306
      source_security_group_id = module.security_group_app_runner.security_group_id
      description              = "allow RDS"
    }
  }
  egress_rule_map = {
    rds = {
      from_port   = 0
      to_port     = 65535
      cidr_blocks = ["0.0.0.0/0"]
      description = "Outbound ALL"
    }
  }
}

// RDS
module "rds" {
  source                 = "../../modules/rds"
  vpc_id                 = module.network.vpc_id
  vpc_security_group_ids = [module.security_group_rds.security_group_id]
  private_subnet_ids     = module.network.private_subnet_ids
  db_identifier          = var.db_identifier
  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
}

// APP Runner
module "security_group_app_runner" {
  source = "../../modules/security_group"
  vpc_security_group = {
    vpc_id      = module.network.vpc_id
    name        = "${var.service}-${var.environment}-app_runner-sg"
    description = "for AppRunner"
  }

  # インバウンドルール
  ingress_rule_map = {
    node = {
      from_port   = 3000
      to_port     = 3000
      cidr_blocks = ["0.0.0.0/0"]
      description = "allow node.js on Next.js"
    }
  }
  egress_rule_map = {
    node = {
      from_port   = 0
      to_port     = 65535
      cidr_blocks = ["0.0.0.0/0"]
      description = "Outbound ALL"
    }
  }
}

module "app_runner" {
  source = "../../modules/app_runner"
  system = var.service
  env    = var.environment
  network = {
    vpc_security_group_ids = [module.security_group_app_runner.security_group_id]
    private_subnet_ids     = module.network.private_subnet_ids
  }
  repository = {
    url : var.source_url
    branch : var.source_branch
  }
  service = {
    build_command = var.build_command
    start_command = var.start_command
  }
  environment = {
    url              = var.app_env_url
    jwt_token_secret = var.app_env_jwt_token_secret
    database_url_ssm = var.app_env_database_url_ssm
  }
}

module "app_runner_acl" {
  source           = "../../modules/app_runner_acl"
  system           = var.service
  env              = var.environment
  region           = var.region
  apprunner_arn    = module.app_runner.service_arn
  allow_ip_address = var.webacl_allow_ip
}