
resource "aws_db_subnet_group" "db_subnet_group" {
  name        = var.db_identifier
  description = "db subent group of ${var.db_identifier}"
  subnet_ids  = var.private_subnet_ids
}

resource "aws_db_instance" "db" {
  allocated_storage = 20
  storage_type      = "gp2"
  engine            = var.engine
  engine_version    = var.engine_version
  instance_class    = var.db_instance
  identifier        = var.db_identifier
  db_name           = var.db_name
  username          = var.db_username
  password          = var.db_password
  skip_final_snapshot = true
  vpc_security_group_ids = var.vpc_security_group_ids
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
}