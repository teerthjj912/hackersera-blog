**WSTG-INPV-03**

Test Name----\> Testing for HTTP Verb Tampering

Objectives---\> Identify if alternate HTTP methods (GET, POST, PUT, DELETE, etc.) can be abused to bypass access controls or alter server behaviour. 

**Overview-**

**HTTP Verb Tampering** is a clever little trick where attackers mess with the HTTP method of a request (GET, POST, PUT, DELETE, etc.) to bypass security mechanisms or access unintended functionalities.

Most developers are used to handling GET and POST, but web servers and frameworks often support the **entire HTTP alphabet** — and if these aren't locked down properly, attackers can sneak in through the lesser-used ones.

This vulnerability becomes especially dangerous when access control checks are **bound to specific HTTP verbs**.

**Real World Example-**

Let’s say an application has this rule in place:

* GET /admin/deleteUser?id=123 → Forbidden

* POST /admin/deleteUser → Requires admin authentication

Now, an attacker tries:

DELETE /admin/deleteUser*?*id\=123 HTTP/1.1  
Or:

OPTIONS /admin/deleteUser*?*id\=123 HTTP/1.1  
If the server processes the request **without checking authorization for the verb used**, the user might succeed in deleting something **without proper access**. Boom — that's verb tampering.

Some frameworks even **treat PUT or PATCH requests differently**, applying a different set of security filters.

**How the Vulnerability occurs-**

* Improper or inconsistent access control logic tied to specific HTTP verbs.

* Insecure routing rules or middleware that only inspect method types partially.

* APIs that expose dangerous functionality (like DELETE or PUT) without proper auth checks.

* Legacy endpoints that accept non-standard verbs due to backwards compatibility.

**Secure Coding Recommendations-**

**1\. Explicitly Validate HTTP Methods**

Only allow expected methods on each route. Use a whitelist approach, for example:

@app.route('/deleteUser', *methods*\=\['POST'\])

**2\. Apply Uniform Access Control Across All Verbs**

Don't just apply authentication and authorization checks to POST and forget PUT or DELETE. Ensure **every route and verb combination is protected**.

**3\. Disable Unused HTTP Methods**

In your web server (Apache, NGINX, etc.), disable support for any unnecessary methods like TRACE, OPTIONS, HEAD, PUT, DELETE, unless explicitly needed.

**Example – Apache:**

\<LimitExcept GET POST\>  
  Deny from all  
\</LimitExcept\>

Example – NGINX:

if (*$*request\_method \!\~ ^(GET|POST)*$*) {  
  return 403;  
}

**4\. Don’t Trust Client-Side Method Enforcement**

Just because your frontend sends only GET and POST, doesn’t mean a malicious client won’t send PUT, DELETE, or PATCH. **Validate everything server-side.**

**Mitigation Steps (Developer Focused)-**

| Step | Action |
| :---: | :---- |
| **1️** | Audit all endpoints and enumerate supported HTTP verbs |
| **2️** | Use framework-level routing controls to restrict accepted verbs |
| **3️** | Apply middleware or security filters across all methods |
| **4️** | Block unused verbs at the web server or API gateway level |
| **5️** | Regularly scan with tools like Burp Suite, OWASP ZAP, or Nikto |

