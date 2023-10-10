variable "system" {}
variable "env" {}
variable "region" {}
variable "apprunner_arn" {}
variable "allow_ip_address" {
  type = list(string)
}

