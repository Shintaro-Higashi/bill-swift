variable "vpc_security_group" {
  type = object({
    name        = string
    vpc_id      = string
    description = optional(string)
  })
}

#variable "vpc_security_group_ingress_rule" {
#  type = object({
#    security_groups = optional(list(string))
#    cidr_blocks     = optional(list(string))
#    protocol        = optional(string,"tcp")
#    from_port       = optional(number,0)
#    to_port         = optional(number,65535)
#    description     = optional(string,"Inbound ALL")
#  })
#}
#
#variable "vpc_security_group_egress_rule" {
#  type = object({
#    cidr_blocks = optional(list(string),["0.0.0.0/0"])
#    protocol    = optional(string,"tcp")
#    from_port   = optional(number,0)
#    to_port     = optional(number,65535)
#    description = optional(string,"Outbound ALL")
#  })
#  default = {}
#}
////////////////////////////////////////////////////////

# インバウンドルール
variable "ingress_rule_map" {
  type = map(object({
    from_port                = number                       # 開始ポート
    to_port                  = number                       # 終了ポート
    protocol                 = optional(string, "TCP")      # プロトコル
    cidr_blocks              = optional(list(string), null) # IPv4 CIDRブロックのリスト
    ipv6_cidr_blocks         = optional(list(string), null) # IPv6 CIDRブロックのリスト
    source_security_group_id = optional(string)             # 送信元セキュリティグループID
    description              = string                       # ルールの説明
  }))
  default     = {}
  description = "セキュリティグループingressルールのマップ"
}

# アウトバウンドルール
variable "egress_rule_map" {
  type = map(object({
    from_port                = number                           # 開始ポート
    to_port                  = number                           # 終了ポート
    protocol                 = optional(string, "TCP")          # プロトコル
    cidr_blocks              = optional(list(string), null)     # IPv4 CIDRブロックのリスト
    ipv6_cidr_blocks         = optional(list(string), null)     # IPv6 CIDRブロックのリスト
    source_security_group_id = optional(string)                 # 送信元セキュリティグループID
    description              = optional(string, "Outbound ALL") # ルールの説明
  }))
  default     = {}
  description = "セキュリティグループegressルールのマップ"
}