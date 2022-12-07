/* Create S3 Buckets and Policies */

# Create S3 bucket to store OAG OVA
resource "aws_s3_bucket" "v_oag_ova_bucket" {
  bucket_prefix = "okta-access-gateway-ova"
  force_destroy = "true"
}   

# Upload OAG OVA to the S3 bucket
resource "aws_s3_bucket_object" "v_oag_ova_object" {
  bucket = aws_s3_bucket.v_oag_ova_bucket.id
  key    = var.S3_OBJECT_KEY
  source = var.OAG_OVA_FILE_PATH
  etag = filemd5(var.OAG_OVA_FILE_PATH)
}
