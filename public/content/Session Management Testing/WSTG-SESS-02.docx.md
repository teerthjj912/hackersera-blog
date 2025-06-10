**WSTG-SESS-02**

Test Name----\> Testing for Cookies Attributes

Objectives----\> \- Ensure that the proper security configuration is set for cookies.

**Overview-**

Cookies are small data packets stored on the client side, often used to **maintain sessions, store preferences**, or track user behavior. While useful, if improperly configured, cookies can **leak sensitive data**, be accessed by malicious scripts, or be sent over insecure channels — making them a prime target for attackers.

This test focuses on whether cookies have appropriate security attributes like HttpOnly, Secure, and SameSite to **limit exposure and reduce attack surfaces**.

**🔥 What’s at stake?**

* Session hijacking via XSS  
* Credential leakage over unsecured channels  
* Cross-Site Request Forgery (CSRF) attacks  
* Cookie theft from insecure storage or transmission

**Real World Example-**

**Incident:** In 2013, a major travel booking website was found sending session cookies over HTTP. An attacker on the same public Wi-Fi could sniff packets using tools like Wireshark and hijack sessions by copying those cookies — gaining full access to user accounts.

**What went wrong:**

* Secure attribute was missing — cookies were sent over HTTP

* No HttpOnly flag — cookies were accessible via JavaScript

* No SameSite policy — vulnerable to CSRF

**How the Vulnerability occurs-**

When cookies **lack proper attributes**, they become exploitable:

* **Without Secure:** Cookies can be transmitted over unencrypted HTTP, easily sniffed

* **Without HttpOnly:** JavaScript can access cookies (hello XSS\!)

* **Without SameSite:** Third-party requests can include cookies, enabling CSRF

* **With overly long expiration:** Sessions stay alive longer than necessary, raising the risk window

Example of an insecure cookie header:

Set\-Cookie: sessionid\=abc123

Now compare with a secure one:

Set\-Cookie: sessionid\=abc123; HttpOnly; Secure; SameSite\=Strict

**Secure Coding Recommendations-**

**Always Set Security Attributes**

| Attribute | Why It’s Needed |
| :---: | :---: |
| Secure | Ensures cookies are only sent over HTTPS |
| HttpOnly | Prevents JavaScript from accessing cookies |
| SameSite | Helps prevent CSRF by restricting cross-origin requests |
| Expires / Max-Age | Controls how long cookies persist |

**Limit Cookie Lifetime**

* Use short expiration windows for session cookies  
* Invalidate cookies on logout or after inactivity

**Clean Up on Logout**

* Always delete cookies on logout using proper expiration:

Set\-Cookie: sessionid\=deleted; Expires\=Thu, 0*1* Jan 1970 00:00:00 GMT

**Mitigation Steps (Developer Focused)-**

**Configure Cookies Properly**

Example in **Express.js (Node.js)**:

res.cookie('sessionid', token, {  
  httpOnly: true,  
  secure: true,  
  sameSite: 'Strict',  
  maxAge: 30 \* 60 \* 1000 // 30 minutes  
})*;*

**Enforce HTTPS**

* Redirect all HTTP traffic to HTTPS  
* Use HSTS headers to make browsers enforce HTTPS

**Use Session Stores (Optional)**

* Avoid storing critical data in cookies — store tokens or session info server-side  
* Use cookies only to reference a session ID (not credentials or user info)

**Test with Security Scanners**

* Tools like OWASP ZAP and Burp Suite can flag insecure cookie attributes  
* Manually inspect Set-Cookie headers in browser DevTools \> Network tab

