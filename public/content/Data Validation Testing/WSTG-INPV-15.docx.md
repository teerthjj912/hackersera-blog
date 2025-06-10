**WSTG-INPV-15**

Test Name----\> Testing for HTTP Splitting Smuggling

Objectives---\> \- Assess if the application is vulnerable to splitting, identifying what possible attacks are achievable.

\- Assess if the chain of communication is vulnerable to smuggling, identifying what possible attacks are achievable.

**Overview-**

**HTTP Splitting** and **HTTP Smuggling** are advanced injection techniques that exploit how web servers, proxies, and application frameworks parse and interpret HTTP requests. These vulnerabilities occur due to **inconsistencies in parsing** between front-end (e.g., reverse proxies, load balancers) and back-end (e.g., origin servers, app servers) components.

* **HTTP Response Splitting** happens when user-controlled input is injected into HTTP headers in such a way that it introduces **newline characters** (\\r\\n), tricking the server into generating **multiple responses**. This can lead to **cache poisoning, open redirects, or cross-site scripting.**

* **HTTP Request Smuggling** exploits discrepancies in how two systems parse **HTTP requests**—especially **Transfer-Encoding** and **Content-Length** headers. An attacker sends a carefully crafted request that causes the front-end to think the request ends at one point while the back-end interprets it differently. This desynchronization allows:

  * **Bypassing security controls**

  * **Session hijacking**

  * **Web cache poisoning**

  * **Credential theft**

  * **Request interference (desync attacks)**

These attacks are especially dangerous in microservices and cloud architectures where proxies, CDNs, and APIs operate in complex communication chains. Exploiting these vulnerabilities can give attackers a foothold deep within the system—often invisible to conventional logging or monitoring tools.

**Real World Example-**

**The Incident:**  
In 2019, security researcher James Kettle (PortSwigger) discovered multiple HTTP Request Smuggling vulnerabilities across major platforms, including Amazon, Netflix, and Akamai. In one notable case involving a major CDN provider, a carefully crafted smuggled request allowed the attacker to:

* Poison shared cache entries

* Inject unauthorized responses

* Leak sensitive internal traffic

The request used conflicting Transfer-Encoding: chunked and Content-Length headers. The frontend proxy (e.g., Nginx) interpreted the request differently from the backend server (e.g., Apache), allowing the attacker to **hide malicious payloads in the body of a desynced request**. These payloads were then processed as legitimate requests by the backend server, **bypassing authentication and access controls**.

**What Went Wrong:**

* Different servers in the request chain interpreted **HTTP message boundaries differently**.

* The system **trusted headers without validation**.

* There were **no safeguards to detect abnormal or malformed HTTP sequences**.

* The cache stored attacker-controlled responses, delivering malicious data to innocent users.

**How the Vulnerability occurs-**

**HTTP Response Splitting**

1. An application dynamically reflects user input into HTTP response headers (e.g., Location: or Set-Cookie:).

2. The attacker injects special characters like \\r\\n into the input.

3. This breaks the original response and allows the attacker to:

   * Create a second, attacker-controlled response

   * Perform **cross-user defacement**

   * **Poison caches**

   * Trigger **cross-site scripting**

Example payload:

name\=attacker%*0D*%*0AContent*\-Length%*3A0*%*0D*%*0A*%*0D*%*0AHTTP*/1.1\+200\+OK%*0D*%*0AContent*\-Type%*3Atext*/html%*0D*%*0A*%*0D*%*0A*\<h1\>XSS\</h1\>

**HTTP Request Smuggling**

1. Frontend proxies and backend servers use different parsing logic.  
2. Attacker submits a specially crafted request like:

POST / HTTP/1.1  
Host: vulnerable.site  
Transfer\-Encoding: chunked  
Content\-Length: 4

0

GET /admin HTTP/1.1  
Host: vulnerable.site

3. Frontend treats it as one request; backend sees it as **two**. The backend processes the injected request (GET /admin) **without logging it**, or even under the previous user's session.

Smuggling works through:

* **CL.TE**: Content-Length used by front-end, Transfer-Encoding by back-end

* **TE.CL**: vice versa

* **TE.TE**: conflicting Transfer-Encoding headers

**Secure Coding Recommendations-**

·    **Validate and sanitize all user-controlled data** before inserting it into HTTP headers.

  **Do not allow CR (\\r) or LF (\\n) characters** in any input that could end up in headers.

  **Normalize HTTP headers** and enforce strict parsing rules.

  **Set up proper HTTP protocol enforcement** on both front-end and back-end servers—make sure they follow the same HTTP spec.

  **Disable Transfer-Encoding where not required**, or explicitly configure it in both front-end and back-end.

  **Use modern reverse proxies and web servers** that are regularly patched and not known to mishandle chunked encoding.

  Avoid combining Content-Length and Transfer-Encoding in requests.

  **Use HTTP-aware WAFs and reverse proxies** that can detect and block desync patterns.

**Mitigation Steps (Developer Focused)-**

1. **Strict Header Validation**  
   Strip or reject any input containing CR (%0D) or LF (%0A) characters.

2. **Unify HTTP Parsing Logic**  
   Ensure front-end proxies (e.g., Nginx) and back-end servers (e.g., Apache, Node.js) agree on parsing rules—especially for Content-Length and Transfer-Encoding.

3. **Patch and Harden Reverse Proxies**  
   Apply latest security patches for Nginx, HAProxy, Apache, etc. Enable mitigations for known smuggling vectors.

4. **Avoid Ambiguous Headers**  
   Avoid requests that contain both Content-Length and Transfer-Encoding. They are fertile ground for desyncs.

5. **Use Protocol-Aware Security Tools**  
   Deploy tools that understand HTTP protocol semantics (e.g., Burp Suite with Desync Scanner, ModSecurity rules for smuggling).

6. **Log and Monitor Low-Level Traffic**  
   Instrument reverse proxies and app servers to log raw HTTP headers for debugging potential smuggling attempts.

7. **Fuzz Request Boundaries**  
   During testing, send malformed and edge-case requests to verify how different components parse boundaries.

