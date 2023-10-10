variable "vpc_id" {}
variable "private_subnet_ids" {
  type = list(string)
}
variable "public_subnet_ids" {
  type = list(string)
}
variable "vpc_security_group_ids" {
  type = list(string)
}
variable "engine" {
  type    = string
  default = "mysql"
}
variable "engine_version" {
  type    = string
  default = "8.0.34"
}
variable "db_instance" {
  type    = string
  default = "db.t3.micro"
}
variable "db_identifier" {}
variable "db_name" {}
variable "db_username" {}
variable "db_password" {}