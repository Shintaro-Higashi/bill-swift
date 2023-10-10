///////////////
// app_runner に対してIPアドレスベースのアクセス制限をかけるWAF及びIPルールを作成
///////////////


// 許可するIPアドレスリスト
resource "aws_wafv2_ip_set" "apprunner-ip-set" {
  name               = "${var.system}-${var.env}-apprunner-ipset"
  description        = "${var.system}-${var.env} allow ip address list"
  scope              = "REGIONAL"
  ip_address_version = "IPV4"
  addresses          = var.allow_ip_address

}

// ACLメインの定義
resource "aws_wafv2_web_acl" "apprunner-web-acl" {
  name        = "${var.system}-${var.env}-apprunner-web-acl"
  description = "${var.system}-${var.env} web acl"
  scope       = "REGIONAL"

  default_action {
    block {}
  }

  rule {
    name     = "WAFIPsetRuleForAppRunner"
    priority = 1

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.apprunner-ip-set.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "waf-ip-set-rule-for-apprunner"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "${var.system}-${var.env}-apprunner-web-acl-metric"
    sampled_requests_enabled   = true
  }
}

resource "aws_wafv2_web_acl_association" "apprunner-web-acl-association" {
  resource_arn = var.apprunner_arn
  web_acl_arn  = aws_wafv2_web_acl.apprunner-web-acl.arn
}