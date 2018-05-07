## Milestone: SPECIAL (Location-based Canary Release)
As part of this milestone, we extended the canary release component for checkbox.io to include a location-based canary release.

Based on the location of the client, which is obtained from the client's public IP Address, we can assign features on checkbox.io.
For demonstration purposes, the title bar of checkbox.io's index page is modified based on the location of the client. We consider three categories for the client's location. 
1. Inside the state of North Carolina (NC),
2. Outside the state of North Carolina (NC) and inside The United States of America,
3. Outside The United States of America.

For demonstration, we host checkbox.io on two servers, one is located in The United States of America and the other is located in London. Based on the location of the client, the requests are routed to the respective servers. A client's request from within The United States of America will be routed to the former server, whereas a client's request from anywhere outside The United States of America will be routed to the latter server. Load balancing in this manner reduces latency. Moreover, these servers are a mirror of each other; in an event one of them becomes unavailable, all the requests will be routed to the other server and the clients will have no perception about which server is actually responding to them. 

The implementation design is shown below. The demonstration of this component is included in the milestone presentation.

### High Level Design

![img](/content/m4_design.png)
