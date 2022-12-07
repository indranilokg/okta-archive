resource "aws_iam_role" "v_oag_vmimport_role" {
  name = "vmimport"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement":[ {
        "Effect": "Allow",
        "Principal": { "Service": "vmie.amazonaws.com" },
        "Action": "sts:AssumeRole",
        "Condition": {
        "StringEquals":{ "sts:Externalid": "vmimport"}
            }
      }]
}
EOF
}
resource "aws_iam_policy" "v_oag_vmimport_role_policy" {
  name        = "oag-vmimport-role-policy"
  description = "Policy for associating the import role with the import storage bucket."

  policy = <<EOF
{
    "Version":"2012-10-17",
    "Statement":[{
        "Effect":"Allow",
                 "Action":[
                  "s3:GetBucketLocation",
                  "s3:GetObject",
                  "s3:ListBucket" 
                  ],
         "Resource":[
             "${aws_s3_bucket.v_oag_ova_bucket.arn}",
             "${aws_s3_bucket.v_oag_ova_bucket.arn}/*"
          ]
       }, {
        "Effect":"Allow",
                "Action":[
                  "s3:GetBucketLocation",
                  "s3:GetObject",
                  "s3:ListBucket",
                  "s3:PutObject",
                  "s3:GetBucketAcl"
                  ],
            "Resource":[
             "${aws_s3_bucket.v_oag_ova_bucket.arn}",
             "${aws_s3_bucket.v_oag_ova_bucket.arn}/*"
             ]
       }, {
         "Effect":"Allow",
                  "Action":[
                   "ec2:ModifySnapshotAttribute",
                   "ec2:CopySnapshot",
                   "ec2:RegisterImage",
                   "ec2:Describe*"],
            "Resource":"*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "v_oag_vmimport_role_attachment" {
  role       = aws_iam_role.v_oag_vmimport_role .name
  policy_arn = aws_iam_policy.v_oag_vmimport_role_policy.arn
}