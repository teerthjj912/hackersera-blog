**WSTG-SESS-03**

Test Name----\> Testing for Session Fixation

Objectives----\> \- Analyze the authentication mechanism and its flow.

\- Force cookies and assess the impact.

**Overview-**

**Session Fixation** is like a con artist handing someone a hotel key and then sneaking in later using a copy — because the front desk never changed the lock.

In technical terms, it's when an attacker sets or predicts a user's session ID **before** the user logs in. If the application doesn’t issue a **new session ID after authentication**, the attacker can use the same session ID to hijack the session.

This vulnerability arises when applications allow users to **authenticate without regenerating a new session token**. If an attacker sets a session ID and tricks the user into logging in with it, they gain access to the authenticated session.

**Real World Example-**

**Incident:** Early versions of certain Java EE applications didn't regenerate session IDs after login. An attacker could send a malicious link with a fixed session ID (e.g., in a phishing email). Once the victim logged in using that session, the attacker simply reused the same ID to access the account.

**The outcome:** Full account takeover — without any need to guess credentials.

**How the Vulnerability occurs-**

Here’s how session fixation plays out:

1. Attacker crafts a link with a fixed session ID:

https://example.com/login*?*sessionid\=abc123

2. User logs in using the link.

3. Application **does not change the session ID** after successful login.

4. Attacker now uses the same abc123 session ID and gets full access.

The core issue? **No regeneration of session tokens** post-authentication. This makes the session ID predictable and usable by others — a classic recipe for session hijacking.

**Secure Coding Recommendations-**

**Always Regenerate Session ID on Login**

* Generate a **new session ID** once the user authenticates successfully.  
* Invalidate the old session to prevent reuse.

**Reject External Session IDs**

* Never accept session IDs from **URL parameters, hidden fields, or user-controlled inputs**.  
* Rely strictly on **secure, server-set cookies** for session management.

**Use Cookie Flags:**

* Set session cookies as HttpOnly, Secure, and SameSite=Strict.

**Invalidate Sessions on Logout**

* Kill the session on logout or timeout using:

Set\-Cookie: sessionid\=deleted; Expires\=Thu, 0*1* Jan 1970 00:00:00 GMT*;*

**Mitigation Steps (Developer Focused)-**

**Regenerate Session ID After Login**

**Example in PHP:**

session\_start()*;*  
// after login success  
session\_regenerate\_id(true)*;*

**Example in Express.js (Node.js):**

req.session.regenerate(function(err) {  
  if (*\!*err) {  
    // proceed with setting user details  
  }  
})*;*

**Validate Session Origination**

* Monitor where sessions originate from (IP/User-Agent fingerprinting).  
* Implement session timeouts and automatic invalidation.

**Disable URL-based Session IDs**

* Never allow sessionid=... in query strings.  
* Force cookie-based session handling only.

**Pen-Test Frequently**

* Use tools like **Burp Suite**, **OWASP ZAP**, or even curl to simulate session fixation attempts.

