**WSTG-ATHN-05**

Test Name----\> Testing for Vulnerable Remember Password

Objectives----\> \- Validate that the generated session is managed securely and do not put the user's credentials in danger.

**Overview-**

The **"Remember Me"** or **"Keep Me Logged In"** functionality, while convenient for users, can be a ticking time bomb when implemented insecurely. A weak implementation may store **plaintext credentials, session tokens without expiration, or predictable identifiers**, putting user accounts at serious risk.

These flaws can lead to **account hijacking, session fixation, or persistent unauthorized access**, especially on shared or compromised devices.

**Commonly affected technologies:**

* Web apps using cookies or local storage

* Mobile applications with persistent sessions

* Frameworks lacking secure session/token management

**Real World Example-**

**Incident:** In 2022, a travel booking platform faced backlash when security researchers discovered that the "Remember Me" token stored **plaintext usernames and passwords in cookies**. Attackers who accessed a user's device or intercepted the cookie via XSS could instantly log in without needing MFA or credentials.

**What went wrong:** The devs misunderstood the “Remember Me” concept — instead of issuing a separate long-lived secure token, they just stored the login credentials.

**How the Vulnerability occurs-**

Here’s how it typically happens:

* **Credentials (username/password)** are stored directly in cookies or localStorage.

* "Remember Me" tokens never expire or lack rotation.

* The token isn't tied to device, IP, or user-agent, allowing reuse elsewhere.

* Tokens aren’t encrypted, signed, or validated properly.

* App auto-logs in users without verifying session integrity.

**Example insecure implementation (DON’T do this):**

document.cookie \= "rememberMe=admin:password123";

**Secure Coding Recommendations-**

If you're implementing “Remember Me”:

* **Never store passwords** (even hashed) in cookies, localStorage, or anywhere on the client side.

* Use **secure, random tokens** issued upon login, linked to a user ID and device fingerprint.

* Ensure **tokens are stored server-side**, mapped to the user and checked on each login attempt.

* Set **reasonable expiration** (e.g., 2 weeks max) and **allow users to revoke tokens** (e.g., "Log out of all devices").

* Use **HttpOnly, Secure, and SameSite=strict** cookie attributes to reduce XSS/CSRF risk.

* Rotate tokens after each use (i.e., implement refresh tokens).

* Invalidate tokens on logout or device change.

**Recommended libraries and practices:**

* Use JWTs with short expiry and refresh tokens for long-lived sessions.

* For web apps: Implement token-based auth via OAuth2 flows.

* Use frameworks that handle persistent sessions securely, like Spring Security or Django with PersistentTokenBasedRememberMeServices.

**Mitigation Steps (Developer Focused)-**

**Secure Token Strategy**

* Implement a **dedicated token** for "Remember Me" — never reuse session tokens or passwords.  
* Token should:  
  * Be randomly generated (e.g., 256-bit)  
  * Be hashed before storing on the server  
  * Be single-use and rotate upon authentication  
  * Be tied to user-agent, IP address, or device fingerprint

**Cookie Hardening**

* Store tokens in cookies with:  
  * Secure flag (HTTPS only)  
  * HttpOnly (not accessible via JS)  
  * SameSite=Strict or Lax to prevent CSRF  
* Set a **max-age** or expiration on the cookie

Set\-Cookie: rememberMeToken\=XYZ123; Max\-Age\=1209600; Secure; HttpOnly; SameSite\=Strict

**Session Hygiene**

* On logout or token misuse detection:  
  * Invalidate the token server-side  
  * Expire all related sessions  
* Provide a **“Log out from all devices”** option  
* Regularly purge stale tokens from your database

**Logging & Alerts**

* Log the issuance and use of remember-me tokens.  
* Alert on suspicious reuse (e.g., same token used from multiple IPs or devices).