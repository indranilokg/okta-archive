resource "aws_key_pair" "v_oag_instance_key" {
  key_name = "oagkey"
  public_key = file("${var.OAG_KEY_PATH}")
}

resource "aws_security_group" "v_oag_security_group" {
  name = "oag-security-group"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress{
    from_port = 0
    to_port = 0
    protocol = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "v_oag_instance" {
 ami = data.aws_ami.v_oag_ami.id
 instance_type = "t2.micro"
 key_name = "oagkey"
 vpc_security_group_ids = [aws_security_group.v_oag_security_group.id]
 tags = {
  Name = "Okta Access Gateway"
 }
}

resource "aws_eip" "v_oag_public_ip" {
  instance = aws_instance.v_oag_instance.id
  vpc      = true
}

