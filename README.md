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
  

[setup_cluster.yml](https://github.ncsu.edu/rshah8/DevOps-Project/blob/m3/infrastructure/setup_cluster.yml), for Kubernetes and Redis Feature Flag, we run the script: 
``` 
ansible-playbook infrastructure/setup_cluster.yml --vault-password-file ./password.txt
```

where password.txt contains the [vault](secrets.yml) password.

[Deployment and Rolling Update](/roles/iTrust_build/tasks/main.yml)  
[Canary Release](/roles/checkbox_build/tasks/main.yml)  
[Deployment of redis-master-server and mongodb](/infrastructure/deploy_secondary.yml)  
[Deployment of pods containing dockerized version of server.js and redis-slaves](infrastructure/deploy_primary.yml)  
[Redis feature flag server changes in checkbox](https://github.com/rcoutin/checkbox.io)

#### Checkbox.io Forked Repository
https://github.com/rcoutin/checkbox.io

#### Report
Report can be found [here](report.md)

#### Screencast

Screencast can be [found here](https://youtu.be/klThbyALL2U).
