## Milestone: DEPLOYMENT
As part of this milestone, our production infrastructure and deployment pipeline supports the following properties.
### Deployment
As part of the deployment scheme, we created a git hook ([post-receive](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/roles/iTrust_build/templates/pre-push.j2)) on our jenkins server which triggers a deployment of 5 instances of iTrust and two instances of checkbox on a git push to production. We commit the iTrust properties with the IP Address of our jenkins server so that all iTrust instances use the same mysql server. All these servers are hosted on DigitalOcean. The ansible script to create all these DigitalOcean VMs is [here](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/roles/createVM/tasks/main.yml). 



### Infrastructure Upgrade

#### Kubernetes Cluster
As a part of creating Kubernetes cluster from scratch, we first provisioned 4 machines on Digital Ocean, initialised one of them to be the master node of the cluster, and made the 3 other nodes to join the cluster. 
The master then deploys pods:
1. A pod containing Redis Server and MongoDB server on one of the nodes
2. A pod containing dockerised version of checkbox.io (containing nginx and server.js) on all three nodes.

As pods are on internal DO network, they can communicate with each other using internal IPs. Also, the cluster IP is the single entry-point for all services. The services running on the pods are thus load-balanced through the cluster IP and come in through the master. This is why when one of the node goes down, the service is still up and running as the master reroutes the requests to the working nodes.

#### Redis Feature Flagserver
As a part of the creation of a redis feature flagserver that can be used to turn off/on features on checkbox.io we made a small change in checkbox.io code [available here](https://github.com/rcoutin/checkbox.io). We deployed a redis master server pod on one of the nodes and created slaves pods on the other two nodes which mirrored the master node. In checkbox code, we created another end-point in server.js that takes in 'featureflag' variable value from the redis server. We called this end-point from index.html using GET REST API and changed the text of checkbox.io to 'feature.io' when redis has featureflag set to "true" (which can be any feature in the future through code). This change on master redis server is reflected on all slave nodes, thus activating the feature on all services using the redis feature flag server.

### Canary Release
As part of the canary release scheme, we have two nodes of checkbox running, one is a production node and one is a canary node. In the canary node, we are changing the HTML file just to simulate a feature addition. We then have a [load balancer](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/roles/checkbox_build/templates/loadBalancer.js) running on our jenkins server on port 80 which performs load balancing by routing 2 out of 3 requests to the production node and the third request to the canary node. If there is an error on the canary node or the node goes down, an alert is raised and then all the requests are routed to the production branch and when the canary node is back up, load balancing again works in the 2:1 scheme. We are also using a single mongodb instance, which is running on our jenkins node. Thus, a study created on one node can be accessed using another node's IP address.

### Rolling Update
As part of the rolling update scheme, we deployed 5 instances of iTrust on separate DigitalOcean droplets and we implement a [heartbeat monitoring dashboard](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/roles/iTrust_build/templates/main.js) using Socket.IO. We maintain a single instance of mysql server (which can be seen in the screencast) on the same node that runs the jenkins server. As we can see in the screencast, the green and red boxes are symbolic representations of whether a particular instance of iTrust is up (running) or not. We demonstrate rolling update by bringing down each instance of iTrust (and additionally support any change in it) while the other four instances are yet up and running.

The following screenshot shows our monitoring dahsboard (heartbeat mechanism) where one of the instances of iTrust is down, while the remaining four are yet operational.

![img](https://github.ncsu.edu/rshah8/DevOps-Project/raw/m3/content/Monitoring_Screenshot.png)
