variable "system" {}
variable "env" {}
#variable "domain" {
#  type = string
#  default = ""
#}

variable "auto_scaling" {
  type = object({
    max_concurrency = optional(number, 100)
    max_size        = optional(number, 2)
    min_size        = optional(number, 1)
  })
  default = {}
}

variable "instance" {
  type = object({
    // 256|512|1024|2048|4096|(0.25|0.5|1|2|4) vCPU
    cpu = optional(number, 1024)
    // 512|1024|2048|3072|4096|6144|8192|10240|12288|(0.5|1|2|3|4|6|8|10|12) GB
    memory = optional(number, 2048)
    port   = optional(number, 3000)
  })
  default = {}
}

variable "network" {
  type = object({
    vpc_security_group_ids = list(string)
    private_subnet_ids     = list(string)
  })
}

variable "repository" {
  type = object({
    url    = string
    branch = string
  })
}

variable "service" {
  type = object({
    auto_deployments_enabled = optional(bool, false)
    build_command = string
    start_command = string
  })
}

variable "environment" {
  type = object({
    url                  = string
    database_url_ssm     = string
    jwt_token_secret     = string
  })
}