### Jenkins Server - rshah8 & sshah14
#### Learnings

* Implementing roles in ansible playbooks. 
* Setting up the authentication of jenkings using ansible playbook.
* Installing and configuring java, boto, maven and other such packages automatically.

#### Challenges

* Learning how to write groovy scripts and integrating groovy with Jenkins to skip the initial setup task [(Reference to fix)](https://github.com/geerlingguy/ansible-role-jenkins/issues/50#issuecomment-246454894)


### Jobkins Job-Builder - rshah8 & sshah14
#### Learnings
* Using plugins in Jenkins using jenkins_plugin module in ansible.
* We also learnt how to use the Jenkins' command line interface using various Jenkins' user security mechanisms.
* Another important concept we learnt was the creation, updating and deletion of jobs in ansible.
* Setup build jobs to build applications automatically, can be periodic and then being able to run a ppst build action that can run additional scripts after the build is a success. We can use this to run tests automatically on a build if the build job passes.



#### Challenges

* Since the script had to be idempotent, we had to figure out a way to restart the Jenkins server and also handle user login using Jenkins' command line interface.
* We experienced little difficulty in parsing the XML format Jenkins Job file.
* Waiting for Jenkins to start before creating the build job was also troublesome due to the jenkins server taking very long to restart.
* Changing the owner and group of the AWS private key to `jenkins` so that the jenkins build can ssh into the EC2 instances and provision the checkbox.io and iTrust2 applications.
* Adding `jenkins` user to list of sudoers so that it can run `sudo` commands.


### Checkbox.io - vhhebbar

#### Learnings

* Installing and configuring nginx automatically 
* Configuring environment variables permanently on a node in an idempotent manner
* Installing and configuring mongodb automatically

#### Challenges

* **Pymongodb** - In the initial stage where we installed dependencies manually, ansible could not find the pymongodb module although it was installed. It appears that the python module was visible only when installed from the ansible playbook.

* **nginx** - After configuring nginx files on vagrant - nginx.conf and sites-available/defaults, the nginx server still showed the old welcome page. Changing the nginx.conf to point to the sites-enabled/defaults instead of sites-available/defaults seemed to solve the problem, although this step was not necessary. However, this issue was solved after deploying nginx on AWS; on hindsight, it was most probably an environment issue.

#### iTrust2 - rcoutin
