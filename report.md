### Jenkins Server - rshah8 & sshah14

### Jobkins Job-Builder - rshah8 & sshah14

### Checkbox.io - vhhebbar

#### Learnings

* Installing and configuring nginx automatically 
* Configuring environment variables in an idempotent manner
* Installing and configuring mongodb via ansible

#### Challenges

* **Pymongodb** - In the initial stage where we installed dependencies manually, ansible could not find the pymongodb module although it was installed. It appears that the python module was visible only when installed from the ansible playbook.

* **nginx** - After configuring nginx files on vagrant - nginx.conf and sites-available/defaults, the nginx server still showed the old welcome page. Changing the nginx.conf to point to the sites-enabled/defaults instead of sites-available/defaults seemed to solve the problem, although this step was not necessary. However, this issue was solved after deploying nginx on AWS; on hindsight, it was most probably an environment issue.

#### iTrust2 - rcoutin