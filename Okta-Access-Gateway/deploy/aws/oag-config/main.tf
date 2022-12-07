provider "aws" {
 region = var.aws_region
}

data "aws_ami" "v_oag_ami" {
  most_recent      = true
  owners = ["self"]

  tags = {
    Name   = var.OAG_AMI_NAME
  }
}


