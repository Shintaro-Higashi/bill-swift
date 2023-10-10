# githubコードから直接Deployするための接続情報
resource "aws_apprunner_connection" "main" {
  connection_name = "${var.system}-${var.env}-connection"
  provider_type   = "GITHUB"
}

# ====================
# Apprunner Build Role
# アプリケーションビルド時のRole (ECR利用)
# ====================
resource "aws_iam_role" "apprunner-build-role" {
  name                = "${var.system}-${var.env}-apprunner-build-role"
  assume_role_policy  = data.aws_iam_policy_document.apprunner-build-assume-policy.json
}

data "aws_iam_policy_document" "apprunner-build-assume-policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type  = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "apprunner-build-policy-attachment" {
  role       = aws_iam_role.apprunner-build-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

# ====================
# Apprunner Task Role
# アプリケーション実行時のRole (SSM利用)
# ====================
resource "aws_iam_role" "apprunner-task-role" {
  name                = "${var.system}-${var.env}-apprunner-task-role"
  assume_role_policy  = data.aws_iam_policy_document.apprunner-task-assume-policy.json
}

data "aws_iam_policy_document" "apprunner-task-assume-policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type  = "Service"
      identifiers = ["tasks.apprunner.amazonaws.com"]
    }
  }
}

# アカウントID、リージョンを取得するための定義(secretmanagerのResource arnに利用)
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_iam_role_policy" "secretmanager" {
  name = "secretmanager"
  role = aws_iam_role.apprunner-task-role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement : [
      {
        Action : [
          "ssm:GetParameters"
        ],
        Effect : "Allow"
        Resource : [
          "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/billswift/${var.env}/*"
        ]
      }
    ]
  })
}

# VPC内のリソースのアクセスに必要
resource "aws_apprunner_vpc_connector" "main" {
  vpc_connector_name = "${var.system}-${var.env}-connector"
  subnets            = var.network.private_subnet_ids
  security_groups    = var.network.vpc_security_group_ids
}

resource "aws_apprunner_auto_scaling_configuration_version" "main" {
  auto_scaling_configuration_name = "${var.system}-${var.env}-config"
  max_concurrency = var.auto_scaling.max_concurrency
  max_size        = var.auto_scaling.max_size
  min_size        = var.auto_scaling.min_size
  tags = {
    Name = "${var.system}-${var.env}-config"
  }
}

resource "aws_apprunner_service" "main" {
  service_name = "${var.system}-${var.env}"
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.main.arn

  instance_configuration {
    cpu = var.instance.cpu
    memory = var.instance.memory
    instance_role_arn = aws_iam_role.apprunner-task-role.arn
  }

  source_configuration {
    authentication_configuration {
      # どちらか一方しか定義できない。ECRに今後変更する場合はaccess_role_arnを有効化
      connection_arn  = aws_apprunner_connection.main.arn
      # access_role_arn = aws_iam_role.apprunner-build-role.arn
    }
    auto_deployments_enabled = var.service.auto_deployments_enabled
    code_repository {
      code_configuration {
        code_configuration_values {
          runtime = "NODEJS_16"
          build_command = var.service.build_command
          start_command = var.service.start_command
          port = var.instance.port
          runtime_environment_variables = {
            NEXTAUTH_URL = var.environment.url
            NEXT_PUBLIC_API_BASE_URL = "${var.environment.url}/api"
          }
          runtime_environment_secrets = {
            DATABASE_URL = var.environment.database_url_ssm
            JWT_TOKEN_SECRET = var.environment.jwt_token_secret
          }
        }
        configuration_source = "API"
      }
      repository_url = var.repository.url
      source_code_version {
        type  = "BRANCH"
        value = var.repository.branch
      }
    }
  }

#  health_check_configuration {
#    path = "/api/health/check"
#  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.main.arn
    }
  }

  tags = {
    Name = "${var.system}-${var.env}-service"
  }
}

# カスタムドメインを使う場合はこちら
# CNAMEが発行されるのでroute53に設定
#resource "aws_apprunner_custom_domain_association" "main" {
#  service_arn          = aws_apprunner_service.main.arn
#  domain_name          = var.domain
#  enable_www_subdomain = false
#}