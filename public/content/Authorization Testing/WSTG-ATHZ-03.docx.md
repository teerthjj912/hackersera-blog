**WSTG-ATHZ-03**

Test Name----\> Testing for Privilege Escalation

Objectives----\> \- Identify injection points related to privilege manipulation.

\- Fuzz or otherwise attempt to bypass security measures.

**Overview-**

**Privilege Escalation** occurs when a user gains access to rights, roles, or resources beyond what was originally granted. This can be **vertical** (e.g., user becomes admin) or **horizontal** (e.g., user performs actions allowed only for other users).

The vulnerability usually stems from poor access controls, insecure role assignments, or missing verification mechanisms on sensitive functionalities.

**Technologies commonly affected:**

* Role-based web applications

* Multi-tenant SaaS platforms

* REST APIs and microservices

**Real World Example-**

**Incident:** A forum application allowed users to assign roles through a vulnerable API:

POST /api/user/update\-role  
Body: { "username": "user123", "role": "admin" }  
An attacker modified their role using an intercepted request. The backend never checked if the user had permission to perform this action.

**What went wrong:**

* Role changes were allowed based on client-side input

* No server-side check to verify the actor’s privilege level

* Insecure implementation of critical admin functionality

**How the Vulnerability occurs-**

Privilege escalation flaws are typically introduced when:

* Backend doesn’t validate if a user is allowed to perform a sensitive action

* Hidden form fields or cookies are trusted to determine user roles

* Role management functions are exposed to all users via APIs

**Example insecure code:**

*\# BAD PRACTICE*  
if request.POST\['role'\] \== 'admin':  
    user.role \= 'admin'  *\# No check on who is making the request*

Or insecure direct object references (IDORs) that let users modify role IDs:

PUT /users/123/role  
Body: { "role": "superadmin" }

**Secure Coding Recommendations-**

**Enforce Server-Side Role Validation**

* Never rely on user-supplied data to assign or validate roles  
* All access control decisions must be made server-side using verified session data

**Implement Role-Based Access Control (RBAC)**

* Use mature access control libraries or frameworks that enforce RBAC  
* Roles and permissions should be clearly defined and immutable via user input

**Block Unauthorized Privilege Modifications**

* Limit APIs or endpoints that can modify roles, access levels, or permissions  
* Ensure only specific, authenticated, and authorized users (e.g., admins) can access them

**Use Role Assertions**

* Apply assertions like assert user.has\_permission(action) before executing sensitive logic  
* Don’t assume users will only interact through the intended UI

**Mitigation Steps (Developer Focused)-**

**Implement Access Control at Every Layer**

* Verify permissions at the **controller, service, and database level**  
* Avoid shortcuts like skipping checks on backend “because the frontend hides it”

**Never Trust Client-Side Role or Privilege Flags**

* Don’t allow clients to pass their role in requests  
* Use secure session management systems to track roles (e.g., server-stored sessions or validated JWTs)

**Use Security Middleware**

* In frameworks like Express.js, Django, or Spring, use middleware to centralize access control logic  
* Don’t let every developer re-implement their own logic

**Audit Role-Change Functions**

* Identify and isolate all APIs and logic that can change roles, permissions, or access levels  
* Require admin authentication \+ logging for these actions

**Monitor & Alert**

* Set up logging and alerts when suspicious role or permission changes are attempted  
* Use rate limiting and IP restrictions on high-privilege endpoints

