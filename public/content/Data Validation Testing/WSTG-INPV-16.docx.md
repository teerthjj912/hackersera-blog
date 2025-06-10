**WSTG-INPV-16**

Test Name----\> Testing for HTTP Incoming Requests

Objectives---\> \- Monitor all incoming and outgoing HTTP requests to the Web Server to inspect any suspicious requests.

\- Monitor HTTP traffic without changes of end user Browser proxy or client-side application.

**Overview-**

Monitoring HTTP incoming requests is crucial in identifying malicious patterns, anomalous behaviors, or attempts to exploit vulnerabilities in web applications. This test ensures that all HTTP interactions with the web server are scrutinized **without disrupting the client-side configuration**, maintaining the transparency and reliability of the monitoring system.

The goal here isn’t to change or tamper with how a user’s browser behaves, but rather to **passively observe and analyze traffic** flowing into the application. This enables security testers to detect stealthy attacks such as:

* Hidden command injection payloads  
* Session fixation or hijacking attempts  
* Path traversal and file inclusion  
* HTTP parameter pollution  
* Smuggling attempts  
* Unexpected HTTP methods (e.g., CONNECT, TRACE)

In environments where **load balancers, CDNs, or reverse proxies** are in play, attackers may exploit inconsistencies in how requests are parsed or routed. This test helps validate that **the HTTP request integrity remains intact end-to-end** and that **no suspicious manipulation or exploitation attempts slip through the cracks**.

Also, since you aren’t touching the client, this type of inspection is invaluable in **production or black-box testing scenarios**, where altering the browser setup isn’t feasible or ethical.

**Real World Example-**

**The Incident:**  
In 2020, a major fintech API gateway experienced a **targeted request replay attack** from an attacker who observed differences in how GET and POST requests were handled for sensitive endpoints. Using this inconsistency, the attacker forged custom-crafted HTTP requests and flooded the system with **unauthorized transaction replays**, resulting in **financial discrepancies and data corruption**.

Upon investigation, it was found that:

* The server accepted malformed or duplicated headers like X-Original-URL.  
* Security analysts hadn’t fully monitored raw HTTP traffic and thus failed to detect early warning signs.  
* No logging mechanism existed at the **load balancer level**, which meant that key attack vectors were missed.

**What Went Wrong:**

* A lack of **centralized HTTP request monitoring** across all points (load balancer, reverse proxy, and app).  
* **Header manipulation and duplication** were not being detected or rejected.  
* Traffic was not being **properly parsed, normalized, or logged** before being passed to the app.

**How the Vulnerability occurs-**

The weakness doesn’t lie in a specific vulnerability, but in the **absence of visibility**. When testers or defenders don’t observe **raw, unaltered HTTP traffic**, they may miss:

* Malformed headers  
* Smuggled requests  
* Unusual HTTP verbs (e.g., OPTIONS, TRACK)  
* Request overloads (DoS attempts)  
* Parameter anomalies (duplicated, null-byte-terminated, overly long)

HTTP requests may be **altered, stripped, or restructured** by intermediate components like:

* **Load balancers**  
* **Web Application Firewalls (WAFs)**  
* **Reverse proxies or edge gateways**

Without an accurate picture of the full request lifecycle, these alterations go undetected, allowing sophisticated attacks to pass through the cracks undetected.

Furthermore, if applications trust headers such as:

* X-Forwarded-For  
* X-Original-URL  
* X-Host  
* X-Client-IP

…without validating or sanitizing them, attackers can spoof or manipulate them to:

* Bypass IP restrictions  
* Poison logs  
* Influence routing logic

**Secure Coding Recommendations-**

·    **Do not trust user-supplied headers blindly.** Treat headers like X-Forwarded-For, X-Real-IP, or X-Original-URL as untrusted unless explicitly set by internal components you control.

  **Implement centralized logging and monitoring** at all ingress points (reverse proxy, WAF, app server). Log raw requests before modification.

  **Normalize and validate all incoming HTTP headers** and reject malformed or duplicated ones.

  **Limit accepted HTTP methods**—only allow necessary verbs like GET, POST, etc.

  **Avoid behavior variation based on headers alone.** Route or authenticate based on authenticated session data, not headers.

  Deploy **HTTP-aware intrusion detection systems (IDS)** or **WAFs** that can identify and alert on anomalies in headers, methods, or URIs.

  **Log both pre- and post-processed requests** so that any changes made by proxies or app logic are visible to analysts.

**Mitigation Steps (Developer Focused)-**

  **Implement Request Inspection at Edge Level**  
Log and analyze full HTTP request details at the first point of contact (e.g., Nginx, HAProxy, Cloudflare, etc.).

  **Use Secure Parsers and Strict Schemas**  
Ensure request parsers follow strict validation rules—reject malformed or duplicate headers automatically.

  **Log All Suspicious or Unusual Traffic**  
Create alerting for:

* HTTP requests with non-standard methods  
* High rate of specific paths (e.g., login, password reset)  
* Requests with overly long query strings or headers

  **Configure WAFs with Custom Rules**  
Build WAF rules to detect:

* Header injection  
* Invalid request formatting  
* Abnormal header counts or patterns

  **Avoid Critical Logic Based on Headers Alone**  
Never use headers like X-Forwarded-For for access control or authentication decisions without proper validation.

  **Deploy Passive Sensors in Mirror Mode**  
Set up packet sniffers or HTTP interceptors (e.g., Zeek, Bro, Burp Passive Scanner) to passively monitor traffic **without modifying requests or requiring client-side changes**.

  **Review Third-Party Components**  
Ensure all intermediaries (load balancers, WAFs, CDN) correctly handle and forward headers without introducing ambiguity.