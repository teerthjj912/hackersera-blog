**WSTG-CLNT-06**

Test Name----\> Testing for Client Side Resource Manipulation

Objectives---\> \- Identify sinks with weak input validation.

\- Assess the impact of the resource manipulation.

**Overview-**

Client-Side Resource Manipulation occurs when an attacker tampers with locally referenced or browser-handled resources—like JavaScript files, CSS stylesheets, images, or even API endpoints—due to inadequate validation or authorization in the front-end logic. Since browsers rely on a lot of client-side code for dynamic functionality, attackers often target these areas to trick the application into doing unintended things.

What makes this dangerous is that modern applications often perform critical logic on the client side for responsiveness—file uploads, resource loading, or even session handling can be client-driven. When these mechanisms aren't backed by strict server-side validation, it's a free-for-all for attackers.

**Real-World Example-**

**The Incident:**  
An online document editor stored user projects using predictable local file names, e.g., /resources/docs/12345.json. While browsing with developer tools, a curious user noticed the pattern and manually altered the filename to access another user’s document via a GET request. No authentication checks were enforced on the client side—or the server side.

**What Went Wrong:**

* No server-side validation or access control; trusted the file path provided by the client.  
* Weak file/resource naming scheme made guessing easy.  
* Application failed to implement checks for ownership or permission of requested resources.

**How the Vulnerability occurs-**

**Where It Happens:**

* **Resource URLs in Client Code:** Static or dynamic file paths that can be modified via developer tools, query parameters, or JavaScript injection.  
* **Query String or Form Manipulation:** Altering values that determine what resources are fetched.  
* **DOM-Based Referencing:** DOM elements like \<img\>, \<script\>, or \<iframe\> referencing user-controlled URLs.  
* **Local Storage/Session Storage Abuse:** Modifying client-side stored paths or tokens that are trusted by subsequent requests.

**Common Exploits:**

* **Accessing Unauthorized Resources:** Changing a file ID or path to access files belonging to another user.  
* **Bypassing Functionality Restrictions:** Replacing resource types or endpoints (e.g., swapping image file types to executable scripts in disguise).  
* **Loading Untrusted Scripts or Libraries:** Exploiting dynamic script or CSS loading mechanisms to inject malicious third-party resources.

**Secure Coding Recommendations-**

  **Never Trust Client Input for Resources:** Always validate and sanitize client requests server-side before processing any resource retrieval or file access.

  **Use Indirect References:** Instead of using direct file names or paths, use opaque tokens or UUIDs mapped to resources internally.

  **Implement Strong Access Control Checks:** Ensure every resource request is authenticated and authorized. Ownership and role-based access checks are essential.

  **Avoid Exposing Internal Resource Structures:** Don’t let the client know actual file paths, bucket names, or server directories. Keep these abstracted.

  **Monitor and Log Access Attempts:** Track abnormal resource access attempts (e.g., sequential guessing of file IDs or paths) and trigger alerts for abuse.

**Mitigation Steps (Developer Focused)-**

* **Audit all client-facing endpoints and resource references** — ensure every dynamic file or data fetch goes through authorization filters server-side.

* **Harden API responses and backend logic** — even if the client sends something valid-looking, verify it on the backend, always.

* **Disable directory listing** on servers, and restrict what file types and resources are publicly accessible.

* **Use Content Security Policy (CSP)** headers to prevent the browser from loading external or untrusted resources unless explicitly allowed.

* **Conduct fuzz testing** using tools like Burp Suite or Postman to manipulate query parameters and observe server behavior.

* **Educate developers** on the dangers of trusting client-side logic, especially when referencing or interacting with sensitive resources.

