**WSTG-SESS-04**

Test Name----\> Testing for Exposed Session Variables

Objectives----\> \- Ensure that proper encryption is implemented.

\- Review the caching configuration.

\- Assess the channel and methods' security.

**Overview-**

**Exposed Session Variables** are like leaving your house keys under the doormat — maybe hidden, but not secure. In web apps, these session variables often include tokens or identifiers used to maintain user sessions — and if improperly handled, they’re an open invitation to attackers.

Session variables can be leaked through insecure cookies, improperly cached responses, logs, or even URLs. If these variables are not encrypted, protected, or isolated, session hijacking becomes a cakewalk for threat actors.

**Real World Example-**

**Incident:** In a poorly configured webmail client, session tokens were exposed via query parameters and browser history. The application cached authenticated pages without invalidating session tokens, and users on shared machines unknowingly leaked access to their inboxes.

**The result?** Full session takeover and unauthorized email access.

**How the Vulnerability occurs-**

Exposed session variables typically occur due to:

* **Improper storage** of session tokens (e.g., localStorage or sessionStorage instead of HttpOnly cookies).

* **Lack of HTTPS**, leading to session data being visible in transit.

* **URL-based session tokens**, which get logged in browser history, proxy logs, or analytics tools.

* **Misconfigured caching**, allowing session pages to be served to unauthorized users.

If attackers can access session variables through any of these routes, they can impersonate the user — no password guessing required.

**Secure Coding Recommendations-**

**Use Encrypted, Secure Cookies**

* Store session tokens in cookies with:  
  * HttpOnly: prevents JavaScript access.  
  * Secure: ensures it’s sent only over HTTPS.  
  * SameSite=Strict: prevents cross-site token leakage.

**Avoid Local Storage or URL Parameters**

* Never store session identifiers in:  
  * localStorage or sessionStorage  
  * URL query strings

**Disable Caching for Authenticated Pages**

* Use response headers:

Cache\-Control: no\-store, no\-cache, must\-revalidate  
Pragma: no\-cache

**Use Encrypted Channels Only**

* Force HTTPS throughout the session lifecycle.  
* Redirect all HTTP requests to HTTPS.

**Mitigation Steps (Developer Focused)-**

**Configure Secure Cookie Attributes**

**Example in Express.js:**

res.cookie('session\_id', token, {  
  httpOnly: true,  
  secure: true,  
  sameSite: 'Strict'  
})*;*

**Disable Client-Side Storage for Tokens**

* Ensure tokens are never stored in localStorage, especially for Single Page Applications (SPAs).  
* Use **HttpOnly** cookies exclusively for session handling.

**Enforce TLS (HTTPS)**

* Redirect all insecure traffic:

return 301 https://*$*host*$*request\_uri*;*

**Set Proper Cache-Control Headers**

* For any page that displays user data or requires authentication:

Cache\-Control: no\-store, no\-cache, must\-revalidate  
Pragma: no\-cache  
Expires: 0

**Sanitize and Monitor Logs**

* Ensure that logs do **not** contain session identifiers or sensitive headers.  
* Use a logging strategy that masks or redacts these fields.

