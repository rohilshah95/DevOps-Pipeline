# DevOps-Project

## Team Information

**Team:** Falcon

**Members**:

Rahul Coutinho  (rcoutin)  
Rohil Shah      (rshah8)  
Siddhant Shah   (sshah14)  
Vijay Hebbar    (vhhebbar)  

## Subbmission

#### Ansible Scripts

[main.yml](main.yml), the only script to be run on the Configuration Management Server (machin having ansible) using the following command:

``` 
ansible-playbook main.yml --vault-password-file ./password.txt
```
where password.txt contains the [vault](secrets.yml) password.


[Jenkins automation](/roles/jenkins/tasks/main.yml)  
[checkbox.io](/roles/checkbox_build/tasks/main.yml) + [iTrust](/roles/iTrust_build/tasks/main.yml) build jobs  
[Provisioning two machines for deploying checkbox.io and iTrust](/provision/provision.yml)  
[iTrust post-build configuration](/provision/iTrust2.yml)  
[checkbox.io post-build configuration](/provision/checkbox.yml)  

#### Report

Report can be found [here](report.md)

#### Screencast

Screencast can be found [here](https://youtu.be/DSW7Yd2M64s)
