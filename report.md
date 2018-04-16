## Milestone: DEPLOYMENT
As part of this milestone, our production infrastructure and deployment pipeline supports the following properties.
### Deployment
As part of the deployment scheme, we created a git hook ([post-receive](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/roles/iTrust_build/templates/pre-push.j2)) on our jenkins server which triggers a deployment of 5 instances of iTrust and two instances of checkbox on a git push to production. We commit the iTrust properties with the IP Address of our jenkins server so that all iTrust instances use the same mysql server. All these servers are hosted on DigitalOcean. The ansible script to create all these DigitalOcean VMs is [here](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/roles/createVM/tasks/main.yml). 



### Infrastructure Upgrade

#### Kubernetes Cluster

#### Redis Feature Flagserver
### Canary Release
### Rolling Update
As part of the rolling update scheme, we deployed 5 instances of iTrust on separate DigitalOcean droplets and we implement a [heartbeat monitoring dashboard](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/roles/iTrust_build/templates/main.js) using Socket.IO. We maintain a single instance of mysql server (which can be seen in the screencast) on the same node that runs the jenkins server. As we can see in the screencast, the green and red boxes are symbolic representations of whether a particular instance of iTrust is up (running) or not. We demonstrate rolling update by bringing down each instance of iTrust (and additionally support any change in it) while the other four instances are yet up and running.

The following screenshot shows our monitoring dahsboard (heartbeat mechanism) where one of the instances of iTrust is down, while the remaining four are yet operational.

![img](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/content/Monitoring_Screenshot.png)
