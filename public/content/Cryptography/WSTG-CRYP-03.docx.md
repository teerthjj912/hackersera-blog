**WSTG-CRYP-03**

Test Name----\> Testing for Sensitive Information Sent via Unencrypted Channels

Objectives---\> \- Identify sensitive information transmitted through the various channels.

\- Assess the privacy and security of the channels used.

**Overview-**

Transmitting sensitive information over **unencrypted or improperly secured channels** is the digital equivalent of whispering your bank password to a friend across a crowded bus. If anyone’s listening, it’s game over.

This vulnerability arises when data such as **credentials, tokens, financial data, health records, or PII** are sent over protocols that do not enforce **strong encryption**—like HTTP instead of HTTPS, or raw TCP instead of TLS-wrapped connections. Attackers in a privileged network position (e.g., on the same Wi-Fi or internal network) can intercept and extract this information through **packet sniffing**, **Man-in-the-Middle (MitM)** attacks, or **traffic manipulation**.

Such insecure transmission isn’t just bad practice—it's a **regulatory red flag** under GDPR, HIPAA, PCI-DSS, and almost every data privacy law out there.

**Real World Example-**

**The Incident:**  
In 2018, a major airline was found to be transmitting **passport numbers and payment details** via HTTP when customers checked in online using certain older endpoints. Attackers intercepted this traffic over public Wi-Fi and harvested data without needing to crack any encryption—because there was none.

**What Went Wrong:**

* The check-in and booking flows used legacy HTTP endpoints.

* Sensitive parameters like booking codes, emails, and payment info were passed via **GET requests** and visible in browser history, logs, and intercepted packets.

* There was **no TLS enforcement**, allowing attackers on the same network to see this traffic in plaintext.

**How the Vulnerability occurs-**

**Unencrypted Channels**

* Use of plain **HTTP** instead of **HTTPS**.  
* Unsecured **FTP, SMTP, or telnet** communications.  
* APIs or web services using unprotected endpoints.

**Sensitive Data in Transit**

* Login credentials, session tokens, or cookies.  
* Personally Identifiable Information (PII) like names, addresses, passport numbers.  
* Health data, financial details, or internal configuration.

**Common Risk Scenarios**

* Mobile apps or IoT devices sending API calls to unprotected endpoints.  
* Internal systems assuming "trusted network" and sending secrets over raw TCP.  
* Misconfigured TLS certificates leading to fallback on HTTP.  
* Developers unintentionally logging sensitive request parameters.

**Key Insight**

* Even if data is encrypted at rest, **if it’s exposed during transit**, it can be intercepted and weaponized.

**Secure Coding Recommendations-**

  **Enforce HTTPS Site-wide:**

* Redirect all HTTP traffic to HTTPS.

* Use HTTP Strict Transport Security (HSTS) to enforce TLS connections.

  **Use Modern TLS Versions:**

* Support only TLS 1.2 or higher.

* Disable SSL, TLS 1.0/1.1, and weak cipher suites.

  **Encrypt All Communication Channels:**

* Use TLS for APIs, internal microservices, email (STARTTLS), file transfers (SFTP), etc.

  **Secure Mobile and Desktop Clients:**

* Hardcode HTTPS endpoints.

* Pin certificates where feasible.

* Detect and block MitM attempts.

  **Secure Cookies and Headers:**

* Use Secure, HttpOnly, and SameSite flags.

* Avoid transmitting session tokens via URL parameters.

  **Validate Certificates:**

* Always check certificate validity and host matching.

* Block connections with expired, untrusted, or self-signed certificates unless explicitly allowed.

  **Log Carefully:**

* Scrub or avoid logging sensitive fields like passwords, tokens, or PII.

* Ensure logging does not capture full URLs or headers with secrets.

**Mitigation Steps (Developer Focused)-**

* Force HTTPS using **301 redirects** and set **HSTS headers** for all subdomains.

* Replace all insecure protocols (e.g., FTP, telnet) with secure counterparts (e.g., SFTP, SSH).

* Regularly scan source code and endpoints for **hardcoded HTTP links** or misconfigured transport layers.

* Implement **TLS for internal communications**—don’t assume the LAN is safe.

* Conduct **network traffic inspection** during QA to catch any data leakage before deployment.

* Set up automated **DevSecOps pipelines** to enforce TLS checks and block builds using insecure protocols.

