## Milestone: SPECIAL (Location-based Canary Release)
As part of this milestone, we extended the canary release component for checkbox.io to include a location-based canary relase. 

Based on the location of the client, which is obtained from the client's ISP, we turn on/off features on checkbox.io. The title bar of checkbox.io's index page is modified based on the location of the client. We consider three categories for the client's location. 
1. Inside the state of North Carolina (NC),
2. Outside the state of North Carolina (NC) and inside The United States of America,
3. Outside The United States of America.

As an additional component, we host two servers for checkbox.io, one which will be located in The United States of America and one which will be located in London. Based on the location of the client, the requests will be routed to the respective servers. A client's request from within The United States of America will be routed to the former server, whereas a client's request from anywhere outside The United States of America will be routed to the latter server. This reduces latency and performs load balancing.