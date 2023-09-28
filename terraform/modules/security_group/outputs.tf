output "security_group_id" {
  value = aws_security_group.sg.id
  description = "セキュリティグループID"
}
output "security_group_name" {
  value       = aws_security_group.sg.name
  description = "セキュリティグループ名"
}