# DevOps-Project Milestone 3

## Team Information

**Team:** Falcon

**Members**:

Rahul Coutinho  (rcoutin)  
Rohil Shah      (rshah8)  
Siddhant Shah   (sshah14)  
Vijay Hebbar    (vhhebbar)  

## Submission

#### Ansible Scripts

[main.yml](main.yml), the only script to be run to trigger the build of the application and perform the necessary fuzzing the generation of the prioritization report. It also provisions checkbox and executes the test generations procedures create a test script that utilizes mocked resources to generate a coverage report.

``` 
ansible-playbook main.yml --vault-password-file ./password.txt
```
where password.txt contains the [vault](secrets.yml) password.

[Deployment and Rolling Update](/roles/iTrust_build/tasks/main.yml)  
[checkbox.io Provisioning and Test Generation](/roles/checkbox_build/tasks/main.yml) + [iTrust](/roles/iTrust_build/tasks/main.yml) build jobs  
[iTrust post-build provisioning and configuration](/provision/iTrust2.yml)  
[iTrust Test Prioritization Report](testPrioritizationReport.md)

#### Checkbox.io Forked Repository
https://github.com/rcoutin/checkbox.io

#### Report
Report can be found [here](report.md)

#### Screencast

Screencast can be found here. [Screencast Video](https://youtu.be/o48Zpq0xLiU)
