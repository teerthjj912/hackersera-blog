**WSTG-ATHN-01**

Test Name----\> Testing for Credentials Transported over an Encrypted Channel

Objectives----\> Assess whether any use case of the web site or application causes the server or the client to exchange credentials without encryption.

**Overview-**

Insecure transmission of credentials is a critical vulnerability that can lead to credential theft, session hijacking, and unauthorized access. This typically occurs when login information (e.g., usernames and passwords) is transmitted over an unencrypted channel such as HTTP instead of HTTPS.

Attackers can exploit this vulnerability by intercepting network traffic (commonly via **Man-in-the-Middle (MitM)** attacks), especially on open or compromised networks. Modern applications must enforce secure transport (e.g., TLS 1.2 or higher) for **all** credential exchanges—including login, password reset, token exchange, and API authentication.

Technologies commonly affected:

* Web applications using HTTP instead of HTTPS

* Mobile apps with poorly implemented SSL/TLS

* APIs lacking SSL/TLS enforcement

* IoT devices with weak or no encryption

**Real World Example-**

**Incident:** In 2014, a major vulnerability was exposed in several mobile banking applications which were **transmitting credentials over HTTP** rather than HTTPS.

**What went wrong:** Attackers on the same network were able to **sniff traffic** and collect usernames and passwords in plaintext, leading to widespread account takeovers. The issue stemmed from poor SSL implementation and lack of TLS enforcement at the server side.

**How the Vulnerability occurs-**

**Insecure Sample Code (Client-side login form):**

\<form action\="http://example.com/login" method\="post"\>  
  \<input *type*\="text" name\="username"\>  
  \<input *type*\="password" name\="password"\>  
  \<input *type*\="submit" value\="Login"\>  
\</form\>  
In this example, credentials are submitted over **HTTP**, making them visible to anyone with access to the network traffic.

**Why it’s a flaw:**

* HTTP transmits data in plaintext.

* Sensitive data (credentials) are exposed.

* Easy to exploit with tools like Wireshark, Ettercap, or browser plugins.

**Secure Coding Recommendations-**

* **Always enforce HTTPS/TLS** on any endpoint that handles credentials or sensitive tokens.

* Redirect HTTP to HTTPS using 301 redirects and HSTS headers.

* **Use TLS 1.2 or 1.3 only**; disable outdated versions like SSLv3 and TLS 1.0/1.1.

* Validate certificates correctly; avoid accepting self-signed or invalid certs without warnings.

* **Mobile apps & APIs** must also perform SSL pinning (if appropriate) to reduce MitM risk.

**Recommended tools/frameworks:**

* Let’s Encrypt (for free HTTPS certs)

* OpenSSL (for configuring and testing)

* OWASP ZAP or Burp Suite (for identifying insecure transport)

**Mitigation Steps (Developer Focused)-**

Here’s what developers should do to avoid unencrypted credential transport:

 **Enforce HTTPS Everywhere**

* Configure web servers (Apache, Nginx, etc.) to **redirect all HTTP to HTTPS** using 301 permanent redirects.

* Force HTTPS at the application level by rejecting requests that come over HTTP.

**Set HTTP Security Headers**

* Use Strict-Transport-Security (HSTS) to tell browsers to **only use HTTPS**:

Strict\-Transport\-Security: max\-age\=31536000; includeSubDomains; preload  
**Secure Cookies and Sessions**

* Mark authentication cookies as Secure and HttpOnly:

Set\-Cookie: sessionId\=abc123; Secure; HttpOnly  
**Configure TLS Correctly**

* Use **TLS 1.2 or 1.3** only. Disable SSLv3, TLS 1.0, and 1.1.

* Regularly update your web server and libraries to patch known SSL/TLS vulnerabilities.

**Validate with Automation**

* Integrate transport security checks into your CI/CD pipelines.

* Use automated scanners (e.g., Nikto, OWASP Dependency-Check) to detect misconfigurations.

