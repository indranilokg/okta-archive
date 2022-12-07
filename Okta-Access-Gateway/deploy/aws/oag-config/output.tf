# This is the aws CLI command that must be run
output "oag_ip" {
  value = aws_eip.v_oag_public_ip.public_ip
}

output "post_config_instructions" {
  value = <<EOF

### Put the following entry in the local host file
${aws_eip.v_oag_public_ip.public_ip}  admin gw.gateway.info gw-admin-[yourdomain].gateway.info  gw-admin.gateway.info header.gateway.info wiki.gateway.info

### Using command line ssh, connect to the new instance:
$ ssh oag-mgmt@admin
oag-mgmt@... password:OktaMgmt@123

Reset the Gateway from SSH main menu
  1. Select 5 System.
  2. Select 7 - Reset.
  3. Select Y to clear the configuration.
  4. Select Y to initialize the system.

Note: The instance may pause for 2-3 minutes but will respond and will return to the system menu.

After the system is initialized successfully, press any key to return to the menu.

### Reset UI console admin password

Change UI console admin password using "Change Access Gateway Password" option on the administration menu.

### Recommended: Reset command line user password

Change command line console password using "Change Password" option on the administration menu.
EOF
}

output "oag_console_setup_params" {
  value = <<EOF
    
    SSO Cookie domain = ${var.OAG_SSO_COOKIE_DOMAIN}
    Access Gateway Hostname = ${var.OAG_HOSTNAME}
  EOF
}

