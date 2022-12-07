# This is the aws CLI command that must be run
output "post_import_instructions" {
  value = <<EOF

### Target AMI Name = ${var.OAG_AMI_NAME}

### Run the following AWS command

aws ec2 import-image --description "${var.OAG_AMI_NAME}" --license-type "BYOL" --disk-containers Format=OVA,UserBucket="{S3Bucket=${aws_s3_bucket.v_oag_ova_bucket.bucket},S3Key=${var.S3_OBJECT_KEY}}"

### Examine the output of command and note the ImportTaskId associated with the import process.

### Examine the progress of the import using the task id using the command

aws ec2 describe-import-image-tasks --import-task-ids <ImportTaskId>

### Import progress is noted in the Progress json element and represents a percentage from 0-100%. 
### Monitor the import until it reaches status completed.

### Note the <ImageId> field, it will be used to confirm the image import in the AWS console.

### Confirm that the import completed from the AWS console -> Services -> EC2 -> Images -> AMI
### Examine the image list, searching for the image with matching id.

EOF
}
