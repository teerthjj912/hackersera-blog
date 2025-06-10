**WSTG-ATHZ-02**

Test Name----\> Testing for Bypassing Authorization Schema

Objectives----\> \- Assess if horizontal or vertical access is possible.

**Overview-**

Bypassing the **authorization schema** occurs when users perform actions they’re not meant to, either by **escalating privileges (vertical access)** or **accessing data/resources of other users (horizontal access)**.

This usually happens when access controls are **only implemented on the client side** or are **missing/weak on the server side**. A user may manipulate URLs, cookies, or request bodies to impersonate other users or escalate roles.

**Technologies commonly affected:**

* Web apps with REST APIs

* Role-based access control (RBAC) implementations

* Multi-user platforms (e.g., CRMs, e-commerce dashboards, internal tools)

**Real World Example-**

**Incident:** An online banking app allowed users to fetch account statements via this endpoint:

GET /accounts/view*?*id\=12345  
Changing the ID to another number gave access to **another user's bank data**. Why? Because the backend didn’t verify whether the requesting user owned the account.

**What went wrong:**

* No proper authorization check on server-side

* Relied solely on "if it’s hidden from the UI, users won’t find it" — which hackers *definitely* will

**How the Vulnerability occurs-**

Bypassing authorization often results from poor backend enforcement and overreliance on frontend controls like disabling buttons or hiding elements based on roles.

**Examples of exploitation:**

* **Horizontal bypass:**  
  A regular user accesses another user’s profile:

GET /profile*?*id\=5678 → Accesses data of another user

* **Vertical bypass:**  
  A user modifies their role in the request to gain admin access:

PUT /user/role { "role": "admin" }

* **Forced browsing:**  
  Guessing admin-only URLs:

/admin/dashboard

**Secure Coding Recommendations-**

**Enforce Role-Based Access on Backend**

* Validate **both authentication AND authorization** on every protected endpoint  
* Use centralized middleware or service to enforce access control (don’t leave it to developers to remember)

**Follow the Principle of Least Privilege (PoLP)**

* Users should only have access to the **minimum resources and actions** necessary  
* Avoid assigning roles loosely or making admin access default

**Use a Secure Access Control Matrix**

* Define a proper matrix of **roles vs. actions**  
* Enforce this server-side, never rely on client-side checks or hidden fields

**Use Secure Frameworks and Libraries**

* Spring Security, Django's permission system, ASP.NET Identity, etc. offer built-in access control tools—**use them**

**Mitigation Steps (Developer Focused)-**

**Always Check Authorization Server-Side**

* For every sensitive operation, **confirm the identity and permission level of the user**  
* Never trust user-supplied IDs or roles from the client

**Implement Uniform Access Checks**

* Use a centralized authorization component to avoid inconsistency  
* Review APIs to ensure all endpoints enforce proper role/ownership validation

**Audit Logs & Monitoring**

* Log all access to protected resources  
* Alert if unusual access patterns are detected (e.g., user viewing many accounts rapidly)

**Avoid Insecure Role Assignment**

* Prevent users from modifying roles via client-side input or session tokens  
* Use secure, signed, and tamper-proof session mechanisms (e.g., JWT with proper claim validation)

