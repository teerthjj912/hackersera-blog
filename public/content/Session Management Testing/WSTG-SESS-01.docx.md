**WSTG-SESS-01**

Test Name----\> Testing for Session Management Schema

Objectives----\> \- Gather session tokens, for the same user and for different users where possible.

\- Analyze and ensure that enough randomness exists to stop session forging attacks.

\- Modify cookies that are not signed and contain information that can be manipulated.

**Overview-**

Session management is the **backbone of user authentication continuity** — it's how a user stays logged in after verifying their credentials. The session management schema defines how sessions are **created**, **maintained**, and **terminated**.

A flawed session management schema can allow attackers to **forge or hijack sessions**, impersonating legitimate users without knowing their credentials. This includes issues like predictable session tokens, unsigned cookies, or poor session expiration logic.

**What can go wrong?**

* Predictable or sequential session tokens  
* Tokens that don’t expire or regenerate after login/logout  
* Modifiable cookies storing sensitive or trusted data

**Technologies Commonly Affected:**

* Web apps using weak session ID generation  
* Applications not using HTTPS for cookie transmission  
* Systems using base64-encoded or plaintext cookie values

**Real World Example-**

**Incident:** In 2015, a vulnerability was discovered in a healthcare web portal where the session IDs were simply base64-encoded usernames with a static suffix. Attackers could forge session tokens for other users by reverse-engineering the pattern and gain unauthorized access to sensitive health records.

**What went wrong:**

* Weak and predictable session ID generation

* No signature or token integrity check

* No expiration or rotation of session identifiers

**How the Vulnerability occurs-**

Session management vulnerabilities arise when developers:

* Generate tokens using predictable logic (e.g., user IDs, timestamps)

* Fail to apply cryptographic integrity (e.g., HMAC) to session data

* Rely on client-side session data that can be manipulated

* Don’t invalidate or rotate tokens after critical actions like login/logout

**Example of an insecure session token:**

Set\-Cookie: session\_id\=MTIzNDU2Nzg5Cg\==; Path\=/; HttpOnly  
This base64 string decodes to "123456789", easily guessable and forgeable.

**Secure Coding Recommendations-**

**Use Strong, Random Session Tokens**

* Generate session IDs using secure random functions (e.g., crypto.randomBytes in Node.js, secrets.token\_urlsafe() in Python)  
* Ensure tokens are long enough (at least 128 bits of entropy)

**Never Trust Client-Stored Sensitive Data**

* Avoid putting user info, roles, or permissions in cookies  
* If storing anything client-side, **sign it** using HMAC or encrypt it

**Mark Cookies Securely**

* Use HttpOnly, Secure, and SameSite=Strict flags for session cookies  
* Prevent cookies from being accessed via JavaScript or sent over insecure channels

**Rotate Tokens on Login and Privilege Changes**

* Create new session tokens after login or privilege escalation  
* Invalidate old tokens immediately

**Mitigation Steps (Developer Focused)-**

**Implement Cryptographically Secure Session IDs**

import secrets  
session\_id \= secrets.token\_urlsafe(32)

**Sign or Encrypt Session Data**

If you absolutely must store data in the cookie:

import hmac, hashlib  
cookie\_data \= "user\_id=42"  
signature \= hmac.new(SECRET\_KEY, cookie\_data.encode(), hashlib.sha256).hexdigest()  
cookie\_value \= *f*"{cookie\_data}|{signature}"

**Disable Client-Side Access to Cookies**

Set\-Cookie: session\=xyz123; HttpOnly; Secure; SameSite\=Strict

**Expire and Invalidate Sessions Correctly**

* Set short expiry durations for inactive sessions  
* Invalidate tokens after logout or session timeout  
* Maintain a server-side session store to track valid tokens and revoke access

**Log Abnormal Session Behavior**

* Detect multiple active sessions from unusual geolocations or IPs  
* Flag repeated session ID reuse attempts

