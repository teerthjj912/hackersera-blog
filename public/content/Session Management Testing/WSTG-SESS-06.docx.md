**WSTG-SESS-06**

Test Name----\> Testing for Logout Functionality

Objectives----\> \- Assess the logout UI.

\- Analyze the session timeout and if the session is properly killed after logout.

**Overview-**

The logout button isn’t just a “See you later” — it’s your bouncer, and it needs to throw out the session like it means it. Insecure logout mechanisms can leave doors open for attackers to hijack active sessions or re-use tokens, especially on shared or public devices.

This test focuses on whether the logout process truly terminates the session, clears session identifiers, and protects users from session hijacking or replay.

**Real World Example-**

**Incident:** A retail web app in 2021 allowed users to hit the back button after logging out and still access cached authenticated pages. Even worse, the session cookie remained active. Attackers who got access to the user’s device (think shared computer) could revisit the site without needing credentials.

**Outcome?** Multiple accounts were compromised, and the logout button became a liability instead of a safeguard.

**How the Vulnerability occurs-**

Logout issues arise due to:

* Session tokens not being **invalidated or cleared** from the client side or server side.

* Poorly configured **cache headers**, allowing access to authenticated pages after logout via browser history.

* **Session IDs not rotated** post-login or logout.

* The logout button simply redirecting without **actually ending the session**.

**Secure Coding Recommendations-**

**Invalidate Session Server-Side**

* Ensure server explicitly kills the session (e.g., destroys session data, invalidates tokens).

**Clear Client-Side Tokens**

* Remove session identifiers or auth tokens from cookies and local storage during logout.

**Disable Caching of Sensitive Pages**

Use response headers to prevent authenticated pages from being cached:

Cache\-Control: no\-store, no\-cache, must\-revalidate  
Pragma: no\-cache  
Expires: 0

**Rotate Session IDs**

* Don’t reuse the same session ID after login/logout events.  
* Ensure a fresh session is created upon re-authentication.

**Implement Proper Session Expiry**

* Set reasonable session idle timeouts and absolute expiration.

**Mitigation Steps (Developer Focused)-**

**1\. Terminate Server-Side Session**

**In PHP:**

session\_start()*;*  
*$*\_SESSION \= \[\]*;*  
session\_destroy()*;*

**In Express.js:**

req.session.destroy()*;*  
res.clearCookie("sessionId")*;*

**2\. Expire Auth Cookies**

Set expired headers to kill cookies immediately:

Set\-Cookie: sessionId\=deleted; expires\=Thu, 0*1* Jan 1970 00:00:00 GMT

**3\. Prevent Page Caching**

**In Node.js:**

res.setHeader('Cache-Control', 'no-store')*;*

**4\. Validate Logout Button Logic**

* Ensure that clicking logout actually terminates the session, not just redirects the user to the login page.  
* Perform a request post-logout to verify access is denied.

