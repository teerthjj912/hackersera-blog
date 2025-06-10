**WSTG-SESS-09**

Test Name----\> Testing for Session Hijacking

Objectives----\> \- Identify vulnerable session cookies.

\- Hijack vulnerable cookies and assess the risk level.

**Overview-**

Session Hijacking is the cybersecurity equivalent of identity theft. If an attacker gets their hands on a user's session token — usually stored in cookies — they can impersonate that user without needing a password. Poof\! They're in.

This attack commonly exploits insecure cookies, poor transport layer security (TLS), or bad practices like exposing tokens in URLs, browser history, or logs.

**Bottom line:** If the session token is exposed or predictable, the attacker becomes the user. No questions asked.

**Real World Example-**

**Scenario:** A user logs into a banking site over HTTP (not HTTPS). The session cookie is transmitted in plaintext. An attacker on the same network sniffs traffic with Wireshark, grabs the session token, and uses it to log in as the victim — complete access to accounts, funds, and personal data.

Alternatively, some developers set cookies without HttpOnly or Secure flags. A malicious script (via XSS or browser extension) reads the cookie and sends it to an attacker. Game over.

**How the Vulnerability occurs-**

* **Session IDs sent over HTTP** instead of HTTPS.

* Cookies without Secure, HttpOnly, or SameSite attributes.

* Predictable or poorly randomized session tokens.

* Session IDs stored in URLs (e.g., /account?sid=12345abc).

* Session tokens exposed to XSS attacks.

**Secure Coding Recommendations-**

**Set Strong Cookie Attributes**

* HttpOnly: Prevents JavaScript access to cookies.  
* Secure: Forces cookies over HTTPS only.  
* SameSite=Strict: Reduces CSRF exposure.

**Example (Set-Cookie header):**

Set\-Cookie: sessionId\=abc123; Secure; HttpOnly; SameSite\=Strict

**Use Strong, Random Tokens**

* Generate session IDs with **cryptographically secure** random number generators.  
* Avoid sequential, guessable IDs.

**Always Use HTTPS**

* Redirect all HTTP traffic to HTTPS.  
* Use HSTS headers to enforce secure connections:

Strict\-Transport\-Security: max\-age\=31536000; includeSubDomains

**Don’t Store Session Data in URLs**

* Session tokens in the URL \= logged in browser history, referrers, and server logs \= attacker heaven.

**Implement Session Expiry**

* Short-lived tokens \+ idle session timeouts \= reduced attack window.

**Mitigation Steps (Developer Focused)-**

**1\. Harden Cookie Configuration**

Make sure cookies are locked down:

response.set\_cookie(  
    'session\_id',  
    *value*\=session\_id,  
    *httponly*\=True,  
    *secure*\=True,  
    *samesite*\='Strict'  
)

**2\. Enable HTTPS and HSTS**

In Flask or Express, redirect all HTTP to HTTPS. Then configure the server (Nginx, Apache, etc.) for HSTS:

add\_header Strict\-Transport\-Security "max-age=63072000; includeSubDomains" always*;*

**3\. Validate Session on Each Request**

Tie the session to the user agent or IP to prevent reuse across devices:

if session.get('user\_agent') \!= request.headers\['User-Agent'\]:  
    logout\_user()

**4\. Monitor for Anomalies**

Log session activity and alert on:

* Multiple locations  
* Rapid logins  
* Session reuse after logout

**5\. Destroy Sessions on Logout**

Don't just remove the cookie on client-side — destroy it server-side:

session.clear()

