resource "aws_security_group" "sg" {
  name        = var.vpc_security_group.name
  vpc_id      = var.vpc_security_group.vpc_id
  description = var.vpc_security_group.description
  tags = {
    Name = var.vpc_security_group.name
  }
#  // インバウンドトラフィック
#  ingress {
#    security_groups = var.vpc_security_group_ingress_rule.security_groups
#    cidr_blocks     = var.vpc_security_group_ingress_rule.cidr_blocks
#    protocol        = var.vpc_security_group_ingress_rule.protocol
#    from_port       = var.vpc_security_group_ingress_rule.from_port
#    to_port         = var.vpc_security_group_ingress_rule.to_port
#    description     = var.vpc_security_group_ingress_rule.description
#  }
#
#  // アウトバウンドトラフィック
#  egress {
#    cidr_blocks = var.vpc_security_group_egress_rule.cidr_blocks
#    protocol    = var.vpc_security_group_egress_rule.protocol
#    from_port   = var.vpc_security_group_egress_rule.from_port
#    to_port     = var.vpc_security_group_egress_rule.to_port
#    description = var.vpc_security_group_egress_rule.description
#  }
}

resource "aws_security_group_rule" "egress" {
  for_each = var.egress_rule_map
  security_group_id        = aws_security_group.sg.id
  type                     = "egress"
  from_port                = each.value.from_port
  to_port                  = each.value.to_port
  protocol                 = each.value.protocol
  cidr_blocks              = each.value.cidr_blocks
  ipv6_cidr_blocks         = each.value.ipv6_cidr_blocks
  source_security_group_id = each.value.source_security_group_id
  description              = each.value.description
}
resource "aws_security_group_rule" "ingress" {
  for_each = var.ingress_rule_map
  security_group_id        = aws_security_group.sg.id
  type                     = "ingress"
  from_port                = each.value.from_port
  to_port                  = each.value.to_port
  protocol                 = each.value.protocol
  cidr_blocks              = each.value.cidr_blocks
  ipv6_cidr_blocks         = each.value.ipv6_cidr_blocks
  source_security_group_id = each.value.source_security_group_id
  description              = each.value.description
}