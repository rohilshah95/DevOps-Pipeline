## Milestone: DEPLOYMENT
As part of this milestone, our production infrastructure and deployment pipeline supports the following properties.
### Deployment
### Infrastructure Upgrade
#### Kubernetes Cluster

#### Redis Feature Flagserver
### Canary Release
### Rolling Update
As part of the rolling update scheme, we deployed 5 instances of iTrust on separate DigitalOcean droplets and we implement a heartbeat monitoring dashboard using Socket.IO. We maintain a single instance of mysql server (which can be seen in the screencast) on the same node that runs the jenkins server. As we can see in the screencast, the green and red boxes are symbolic representations of whether a particular instance of iTrust is up (running) or not. We demonstrate rolling update by bringing down each instance of iTrust (and additionally support any change in it) while the other four instances are yet up and running.
