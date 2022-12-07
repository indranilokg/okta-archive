# Okta Access Gateway - Deploy in AWS

## Purpose
Build the Okta Access Gateway infrastructure in AWS

<blockquote>
The instructions assume that you are using a unix based machine such as Mac OS or Linux based OS.
</blockquote>

## Pre-requsites

* Install wget/curl in your local build machine if not already there

* Install Terraform in your local system. A quick guide is [here](https://letslearndevops.com/2017/07/23/how-to-install-terraform/).

* Install and configure AWS CLI in your local system. Instructions [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html) and [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration).


## Setup

* Clone the git repo

````
git clone https://github.com/indranilokg/Okta-Access-Gateway.git
````

* Go to the aws deploy directory

````
cd Okta-Access-Gateway/deploy/aws
````

* Create file `terraform.tfvars` from  `terraform.tfvars.template` under **`./oag-upload`** directory. Change values for the variables if needed.

*Example -*

```
S3_OBJECT_KEY = "Okta-Access-Gateway.ova"
OAG_OVA_FILE_PATH = "../../Okta-Access-Gateway.ova"
aws_region = "us-east-1"
OAG_AMI_NAME = "okta-access-gateway"
```

[How can you determine your AWS region](https://help.okta.com/en/prod/Content/Topics/Access-Gateway/setup-using-ovf-aws.htm#Determine_Region)

* Create file `terraform.tfvars` from  `terraform.tfvars.template` under **`./oag-config`** directory. Change values for the variables if needed.

*Example -*

```
OAG_KEY_PATH = "~/.ssh/oagkey.pub"
OAG_SSO_COOKIE_DOMAIN= "gateway.info"
OAG_HOSTNAME = "gw.gateway.info"
OAG_AMI_NAME = "okta-access-gateway"
```

<blockquote>The AMI Name must match the OAG AMI created in AWS. If you are using the upload script the default AMI name is okta-access-gateway, so no need to change the value for the variable OAG_AMI_NAME.</blockquote>

## Upload OAG OVA to AWS

### Create

To upload the Okta Access Gateway OVA to AWS, run the following command from aws deploy directory. 

```
make upload
```
Capture the output from successful deployment. Follow the instructions there using AWS cli. 

[Example](#upload-output)


### Destroy 
To remove the OVA, run the following command from aws deploy directory.

```
make removeUpload
```

## Configure OAG

### Create

To configure Okta Access Gateway, ensure that the OAG AMI has been created (either manually or using the provided upload script). Run the following command from aws deploy directory. 

```
make config
```

Capture the output from successful execution. Follow the instructions from output for necessary and recommended post-config steps. 

[Example](#config-output)


### Destroy

To destroy the OAG instance and related infrastructure, run the following command from aws deploy directory.

```
make removeConfig
```

## Access OAG console

Follow the instructions [here](https://help.okta.com/en/prod/Content/Topics/Access-Gateway/admin-console-setup.htm) to login to the console for the first time and initialize.

## Appendix

### <a id="upload-output">Upload script output example</a>

```

post_import_instructions = 
### Target AMI Name = okta-access-gateway

### Run the following AWS command

aws ec2 import-image --description "okta-access-gateway" --license-type "BYOL" --disk-containers Format=OVA,UserBucket="{S3Bucket=okta-access-gateway-ovaXXXXXXXXXXX,S3Key=Okta-Access-Gateway.ova}"

### Examine the output of command and note the ImportTaskId associated with the import process.

### Examine the progress of the import using the task id using the command

aws ec2 describe-import-image-tasks --import-task-ids <ImportTaskId>

### Import progress is noted in the Progress json element and represents a percentage from 0-100%. 
### Monitor the import until it reaches status completed.

### Note the <ImageId> field, it will be used to confirm the image import in the AWS console.

### Confirm that the import completed from the AWS console -> Services -> EC2 -> Images -> AMI
### Examine the image list, searching for the image with matching id.
```
**Note:** If you wish to change the `Target AMI Name` make the  changes to the **description** attribute in **import-image** command. Keep note of the new `Target AMI Name`, since it has to be provided during config step.


### <a id="config-output">Config script output example</a>

```
oag_console_setup_params =     
    SSO Cookie domain = gateway.info
    Access Gateway Hostname = gw.gateway.info

oag_ip = XXX.XXX.XXX.XXX
post_config_instructions = 
### Put the following entry in the local host file
XXX.XXX.XXX.XXX  admin gw.gateway.info gw-admin-[yourdomain].gateway.info  gw-admin.gateway.info header.gateway.info wiki.gateway.info

### Using command line ssh, connect to the new instance:
$ ssh oag-mgmt@admin
oag-mgmt@... password:<Default-Password>

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
```
