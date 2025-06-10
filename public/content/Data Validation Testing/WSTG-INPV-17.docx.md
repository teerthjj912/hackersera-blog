**WSTG-INPV-17**

Test Name----\> Testing for Host Header Injection

Objectives---\> \- Assess if the Host header is being parsed dynamically in the application.

\- Bypass security controls that rely on the header.

**Overview-**

**Host Header Injection** is a web vulnerability that arises when the server blindly trusts the Host header value from the HTTP request without validating it. This header typically indicates which domain the client wants to access (especially on shared hosting setups). However, if this value is used dynamically in the application—for redirects, password reset links, email generation, or caching logic—it opens the door to several attack vectors.

Common exploit scenarios include:

* **Web cache poisoning**

* **Password reset poisoning**

* **SSRF (Server-Side Request Forgery) via internal redirection**

* **Open redirection**

* **URL-based phishing or spoofed emails**

The crux of the issue lies in **server-side logic that trusts the header for dynamic link generation or routing decisions**, enabling attackers to manipulate it to point users toward malicious domains while making it look like it came from a legitimate source.

Attackers can send a request like:

GET /forgot\-password HTTP/1.1    
Host: attacker.com    
If the app generates a password reset link using Host, the victim might receive something like:

https://attacker.com/reset*?*token\=abc123  
Game over.

**Real World Example-**

**The Incident:**  
In 2017, a fintech firm’s internal tool had a "forgot password" functionality that generated a tokenized reset link based on the Host header and emailed it to users. An attacker discovered that by modifying the Host header to their own domain (malicious.example.com) and triggering a password reset for a user, the application sent the reset link with the manipulated domain.

The attacker simply:

* Sent a POST /forgot-password request with a **custom Host header**

* Waited for the user to receive the email and click the link

* Captured the token when the victim landed on malicious.example.com/reset?token=xyz

* Used the token to reset the account password and take over the user account

**What Went Wrong:**

* The application **used Host directly** from the incoming request instead of relying on a hardcoded, trusted value.

* There was **no sanitization or validation** of the header.

* Security controls around password resets were dependent on a **user-controlled value**.

**How the Vulnerability occurs-**

The vulnerability manifests when:

* The application **trusts and reflects the Host header** dynamically.

* It uses this value for building links (reset URLs, verification links, canonical tags) or performs logic (e.g., routing, domain checks) based on it.

* There’s **no whitelist or domain check** before processing the Host value.

* It’s combined with **lack of HTTPS enforcement** or **misconfigured DNS/virtual hosts**.

Compounding risks include:

* **Proxy misconfigurations** that forward Host headers without sanitization.

* **Shared hosting environments**, where virtual hosts are mapped dynamically based on the Host header.

* **CDN or caching layers**, where poisoned Host headers can poison the cache with malicious responses.

An attacker may craft requests like:

GET /reset\-password HTTP/1.1    
Host: evil.com    
If the response or redirection logic reflects this, it can cause:

* Phishing

* Cookie theft (if domain attributes are misused)

* Cache poisoning (if responses get cached under evil domains)

* SSRF or internal resource access (if internal redirect happens via host header manipulation)

**Secure Coding Recommendations-**

* **Never trust the Host header** from user input for critical decisions.

* For generating links (like password resets), always **use a hardcoded base URL or a configuration setting** (e.g., APP\_BASE\_URL).

* Implement **server-side validation to reject unexpected Host headers**—whitelist only known, allowed domains.

* If reverse proxies or load balancers are used, configure them to **normalize or strip untrusted headers**.

* Avoid logic branching based on the host header unless explicitly necessary—and even then, **require strict validation**.

* Set headers like X-Forwarded-Host or Forwarded in a controlled environment only (e.g., behind a proxy that injects them), and **verify their integrity**.

* Use **Content Security Policy (CSP)** to limit how resources are loaded to prevent script or resource injection via malicious redirects.

**Mitigation Steps (Developer Focused)-**

* **Use Config-Defined Base URLs**  
  Do not build URLs from request.headers\['Host'\]. Use constants or environment variables.

reset\_url \= *f*"{APP\_BASE\_URL}/reset-password?token={token}"

* **Whitelist Valid Hosts on the Server Side**  
  Explicitly validate the Host header:

if host\_header not in \['yourapp.com', 'www.yourapp.com'\]:  
    return HTTP 400 Bad Request

* **Sanitize All Header Inputs**  
  Normalize all incoming headers and reject malformed or duplicated ones.  
* **Set Host Header in Proxies**  
  In reverse proxies like Nginx or HAProxy, strip the incoming Host header and inject a safe one.

proxy\_set\_header Host yourapp.com*;*

* **Implement Security Headers**  
  Use headers like Strict-Transport-Security and Content-Security-Policy to mitigate redirection-based attacks.

* **Monitor for Suspicious Host Headers**  
  Log and alert on abnormal Host header values (e.g., non-canonical domains, IP addresses, or known attack payloads).

* **Test Across All Environments**  
  Make sure dev, staging, and prod environments handle Host consistently and reject spoofed headers.

