**WSTG-CLNT-07**

Test Name----\> Test Cross Origin Resource Sharing

Objectives---\> \- Identify endpoints that implement CORS.

\- Ensure that the CORS configuration is secure or harmless.

**Overview-**

**Cross-Origin Resource Sharing (CORS)** is a security mechanism that allows a web application running in one domain to request resources from a different domain. By default, browsers restrict this behavior to protect users from malicious sites silently accessing data on trusted domains — this is known as the **Same-Origin Policy (SOP)**.

CORS lets developers selectively lift this restriction by setting HTTP headers like Access-Control-Allow-Origin, Access-Control-Allow-Credentials, and others. The problem? **One misconfigured header can allow malicious third-party sites to perform unauthorized actions on behalf of a user** — essentially breaking SOP and opening the door to data theft, session hijacking, or worse.

**Real-World Example-**

**The Incident:**  
In 2021, a major fintech application exposed an internal API to CORS by responding with the wildcard header:

Access\-Control\-Allow\-Origin: \*

Even worse, it also allowed credentials (cookies) to be sent by including:

Access\-Control\-Allow\-Credentials: true  
This is a **direct violation of the CORS spec**. A security researcher discovered that an attacker could craft a malicious site that made authenticated requests (using the victim's cookies) to sensitive internal APIs — leaking personal financial data cross-origin.

**What Went Wrong:**

* Used a wildcard \* in Access-Control-Allow-Origin **while allowing credentials**, which should never be allowed.

* No origin whitelisting or validation logic.

* Sensitive data was exposed to any domain capable of making a cross-origin call.

**How the Vulnerability occurs-**

**Common Misconfigurations:**

* **Wildcard Origins (\*) \+ Credentials:** When both are enabled, it allows **any website** to interact with sensitive endpoints **using the victim’s session**.  
* **Overly Permissive Origin Lists:** Applications dynamically reflect the origin header (Access-Control-Allow-Origin: \<input\>), enabling origin spoofing.  
* **Missing Vary: Origin Header:** Can lead to incorrect caching of CORS responses by shared proxies.  
* **Allowing Unsafe HTTP Methods:** Enabling PUT, DELETE, or PATCH cross-origin without rigorous checks can enable full remote manipulation of application state.

**Attack Vectors:**

* **Data Exfiltration via XHR/Fetch from Attacker-Controlled Domain**  
* **Session Hijacking/Token Theft if Auth Tokens are sent cross-origin**  
* **CSRF-like Exploits with Enhanced Access** — bypassing anti-CSRF tokens if they rely solely on SOP

**Secure Coding Recommendations-**

  **Avoid Wildcard Origins (\*) in Sensitive Endpoints:** Especially for APIs that process cookies or session-based authentication.

  **Use an Explicit Allowlist of Trusted Origins:** Maintain a tight, static list of allowed domains. Do not dynamically echo the Origin header without validation.

  **Disallow Credentials When Not Necessary:** Only use Access-Control-Allow-Credentials: true if you **must** include cookies, and then limit Access-Control-Allow-Origin to a single trusted domain.

  **Implement CORS on a Per-Route Basis:** Don’t apply blanket CORS headers application-wide. Keep it tight and context-aware.

  **Use the Vary: Origin Header:** To prevent cache poisoning and ensure correct behavior under load balancers and proxies.

  **Log and Monitor CORS Preflight Requests:** They’re a goldmine for detecting probing behavior from attackers.

**Mitigation Steps (Developer Focused)-**

  **Audit all endpoints for Access-Control-\* headers.** Use tools like curl, browser dev tools, or proxy tools like Burp Suite to inspect every endpoint’s response headers.

  **Deploy a strict CORS policy** using server-side configuration (e.g., in Express.js, Django, Spring, Nginx) that only permits known origins and enforces the correct methods and headers.

  **Test CORS behavior using malicious origins** (like https://evil.example.com) and verify that requests are denied or blocked by the browser.

  **Use browser developer tools** to simulate OPTIONS preflight requests and test how the server responds to various origin and method combinations.

  **For APIs exposed to third-party apps, use token-based auth (e.g., OAuth) instead of relying on cookies.** This reduces the reliance on SOP and prevents cross-origin cookie issues.