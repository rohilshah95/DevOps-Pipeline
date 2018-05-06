# DevOps-Project Milestone : Special (Location-based Canary Release)

## Team Information

**Team:** Falcon

**Members**:

Rahul Coutinho  (rcoutin)  
Rohil Shah      (rshah8)  
Siddhant Shah   (sshah14)  
Vijay Hebbar    (vhhebbar)  

## Submission

#### Ansible Scripts

[main.yml](main.yml), the only script to be run to trigger the build of the application and perform the deployment of 5 iTrust images and 2 checkbox images and performs load balancing for checkbox and rolling updates support for iTrust.

``` 
ansible-playbook main.yml --vault-password-file ./password.txt
```
  

where ```password.txt``` contains the [vault](secrets.yml) password.

[Canary Release](/roles/checkbox_build/tasks/main.yml)  
[Location based Feature Release and Load Balancing](/roles/checkbox_build/templates/loadBalancer.js)
#### Checkbox.io Forked Repository
https://github.com/rcoutin/checkbox.io

#### Report
Report can be found [here](report.md)

#### Screencast

Screencast can be [found here](https://youtu.be/2dtvdnBwCDg).
