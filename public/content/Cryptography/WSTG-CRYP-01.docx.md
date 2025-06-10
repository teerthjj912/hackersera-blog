**WSTG-CRYP-01**

Test Name----\> Testing for Weak Transport Layer Security

Objectives---\> \- Validate the service configuration.

\- Review the digital certificate's cryptographic strength and validity.

\- Ensure that the TLS security is not bypassable and is properly implemented across the application.

**Overview-**

Transport Layer Security (TLS) is the backbone of **confidentiality and integrity** for web communications. It ensures that sensitive data exchanged between the client and server—think passwords, session tokens, personal info—is encrypted and tamper-proof.

But here’s the catch: just using **TLS doesn’t mean it’s secure**. Misconfigurations, outdated protocol versions (like TLS 1.0/1.1), weak cipher suites, and poorly validated certificates open doors for **downgrade attacks, man-in-the-middle (MitM) exploits, and session hijacking**.

This test is all about **ensuring that TLS is properly implemented, up-to-date, enforced site-wide, and free from common weaknesses**.

An insecure TLS setup doesn’t just put encryption at risk—it undermines **user trust, browser warnings, and compliance standards like PCI-DSS and HIPAA.**

**Real World Example-**

**The Incident:**  
In 2020, a major e-commerce platform was found to be accepting connections over TLS 1.0 and using **RC4 cipher suites**, both long deprecated due to known vulnerabilities. Researchers exploited this weakness using the **Bar Mitzvah attack**, demonstrating the ability to decrypt session cookies.

What’s worse—**the site redirected mobile users from HTTPS to HTTP** after login to “improve performance.”

**What Went Wrong:**

* TLS 1.0 allowed → susceptible to downgrade attacks.

* Weak cipher (RC4) → allowed cryptographic key stream bias.

* No HSTS or HTTPS enforcement.

* Certificate not pinned or properly validated on mobile clients.

* Result: attacker could intercept and decrypt credentials in transit.

The platform later confirmed that the vulnerability had been used in a credential stuffing attack affecting over **150,000 accounts**.

**How the Vulnerability occurs-**

Weak TLS implementation vulnerabilities stem from a few core issues:

**Outdated Protocol Versions**

* TLS 1.0 and 1.1 are deprecated due to design flaws.  
* SSLv3 and below? Practically an open door.

**Weak or Insecure Cipher Suites**

* RC4, DES, 3DES are cryptographically broken.  
* NULL and EXPORT-grade ciphers still lurking in some configs.  
* Weak ephemeral key lengths (\< 2048-bit RSA or \< 128-bit AES) are not future-proof.

**Improper Certificate Management**

* Self-signed or expired certificates.  
* Mismatched common names or subject alternative names (SAN).  
* No certificate pinning on clients.

**Downgrade & Fallback Exploits**

* No prevention against downgrade to HTTP.  
* No HSTS, no secure cookie flags.

**Improper Coverage**

* TLS not enforced on **all routes** (especially login, payment, admin panels).  
* Mixed content (HTTPS page loading HTTP resources).

**Secure Coding Recommendations-**

  **Use the latest TLS version (TLS 1.3 or 1.2):**

* Disable TLS 1.0 and 1.1 server-side.

* Enforce minimum TLS version through web server config (Apache, NGINX, etc.).

  **Restrict to strong cipher suites only:**

* Prefer modern ciphers: TLS\_AES\_256\_GCM\_SHA384, TLS\_CHACHA20\_POLY1305\_SHA256.

* Disable weak ciphers: RC4, DES, NULL, EXPORT.

  **Configure HSTS (HTTP Strict Transport Security):**

* Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

* Prevents protocol downgrades and MITM attacks.

  **Deploy a strong, valid certificate:**

* Use trusted Certificate Authorities.

* Rotate and renew certificates before expiration.

* Use wildcard certificates only when necessary.

* Match CN/SAN properly to avoid domain mismatches.

  **Implement certificate pinning (carefully):**

* Particularly for mobile apps and critical services.

* Helps mitigate rogue CA or MitM attacks.

* Be cautious: pinning mismanagement can break apps.

  **Test your configuration regularly:**

* Use tools like:

  * SSL Labs Test

  * testssl.sh

  * openssl s\_client \-connect

* Automate certificate checks via monitoring/CI tools.

  **Enable Secure Cookies and SameSite attributes:**

* Set-Cookie: Secure; HttpOnly; SameSite=Strict

* Prevents theft of tokens over non-secure connections.

  **Disable mixed content:**

* Ensure all resources (scripts, images, stylesheets) load over HTTPS.

**Mitigation Steps (Developer Focused)-**

✅ **Do this:**

* **Force HTTPS** everywhere—redirect HTTP to HTTPS by default.

* **Deploy HSTS headers** with subdomain and preload directives.

* Use a **reverse proxy or WAF** to enforce TLS standards.

* Regularly scan for **protocol/cipher issues** using nmap, sslyze, or online scanners.

* Educate your team on **TLS certificate management and rotation policies**.

❌ **Don’t do this:**

* Never leave SSLv2, SSLv3, or TLS 1.0/1.1 enabled “just for compatibility.”

* Don’t accept self-signed certs in production.

* Don’t skip HTTPS on subdomains, mobile APIs, or admin portals.

* Don’t assume “Let’s Encrypt” means set-it-and-forget-it—**monitor expiration**.

