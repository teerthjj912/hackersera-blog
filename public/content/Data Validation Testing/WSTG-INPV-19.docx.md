**WSTG-INPV-19**

Test Name----\> Testing for Server-Side Request Forgery

Objectives---\> \- Identify SSRF injection points.

\- Test if the injection points are exploitable.

\- Assess the severity of the vulnerability.

**Overview-**

**Server-Side Request Forgery (SSRF)** is a serious web application vulnerability that occurs when an attacker can manipulate server-side functionality to make unauthorized HTTP requests on their behalf. In SSRF, the target is **not the user**—but the **server itself**. The attacker tricks the application into sending crafted requests to internal or external systems that the attacker shouldn’t have access to.

In most cases, SSRF arises when the application fetches remote resources—such as URLs, images, metadata, or documents—based on user input. If this input isn't properly validated or sanitized, attackers can substitute the resource with a malicious destination (e.g., http://localhost:8000/admin, http://169.254.169.254/latest/meta-data/).

**Why it’s dangerous:**

* **Can bypass firewalls** and access internal systems not exposed publicly.  
* **Exfiltrate sensitive data**, including cloud instance metadata (e.g., AWS credentials).  
* **Port scan internal networks**, opening the door to lateral movement.  
* Can potentially lead to **Remote Code Execution (RCE)** in chained exploits.  
* Can be abused to **bypass IP allowlists** and **exploit internal APIs**.

Modern SSRF attacks aren't limited to HTTP either—if the backend supports schemes like file://, ftp://, or even gopher://, the damage expands dramatically.

**Real World Example-**

**The Incident:**  
In 2019, **Capital One** experienced one of the most notorious SSRF attacks in history. A misconfigured AWS WAF (Web Application Firewall) running on EC2 allowed an attacker to perform SSRF. The attacker was able to:

* Send a crafted request that tricked the web server into querying the AWS metadata endpoint:  
  http://169.254.169.254/latest/meta-data/iam/security-credentials/  
* Steal temporary AWS credentials with elevated permissions.

Using these credentials, the attacker accessed Capital One's S3 buckets and **exfiltrated over 100 million customer records**, including sensitive financial and personal data.

**What Went Wrong:**

* The web application **dynamically handled URLs based on user input**, without validating destination origins.  
* **Metadata service was unprotected and reachable** from within the instance.  
* **IAM roles were overly permissive**, enabling the stolen credentials to access a wide range of services.  
* **No SSRF protections** (like network segmentation, allowlists, or metadata service hardening) were in place.

This incident exposed not only SSRF weaknesses but also how poor **cloud security hygiene** can amplify a relatively basic vulnerability into a catastrophic breach.

**How the Vulnerability occurs-**

SSRF vulnerabilities generally appear in functionalities such as:

* Image or document fetchers (e.g., "Provide a URL for your profile picture")

* Webhooks or callback URLs

* URL fetchers in serverless functions

* Internal API calls that can be redirected

* Proxy functionality exposed to users

* XML parsers with external entity fetching (XXE → SSRF)

Here’s how it unfolds:

1. **User supplies a URL or address** that the server will fetch on their behalf.

2. The server **fails to validate or sanitize the destination**, blindly making the request.

3. The attacker **crafts the destination to target internal systems** (e.g., localhost, cloud metadata services).

4. The attacker **receives data or observes behavior** (like response times, status codes) to infer internal structure or extract information.

**Example vulnerable code (Python):**

@app.route('/fetch')  
*def* fetch():  
    url \= request.args.get("url")  
    response \= requests.get(url)  
    return response.text  
An attacker can call:

/fetch*?*url\=http://localhost:8000/admin  
Or worse:

/fetch*?*url\=http://169.254.169.254/latest/meta\-data/

**Secure Coding Recommendations-**

  **Strictly validate input URLs:**

* Whitelist trusted domains (e.g., only allow URLs from your own CDN).  
* Use strict regex or URL parsing to verify domain, protocol, and path.  
* Explicitly **disallow localhost, 127.0.0.1, 169.254.\*, 0.0.0.0, and internal IPs.**

  **Use network segmentation and egress restrictions:**

* Block application servers from making requests to internal infrastructure unless explicitly needed.  
* Use a proxy or firewall to monitor and block suspicious outbound requests.

  **Protect cloud metadata endpoints:**

* On AWS, use **IMDSv2** (Instance Metadata Service v2) which requires session-based tokens.  
* Disable metadata service entirely if not in use.

  **Use SSRF-aware libraries:**

* Instead of requests.get(url) or similar direct calls, use secure fetchers that can enforce DNS resolution rules and scheme restrictions.

  **Sanitize redirect behavior:**

* Prevent untrusted redirects to internal services.  
* Implement a DNS resolution check that fails if the IP belongs to a private range.

  **Disable unused URL schemes:**

* Forbid schemes like file://, gopher://, ftp:// in all user-supplied inputs.

  **Log all outbound requests:**

* Monitor for suspicious access patterns (e.g., repeated 169.254.x.x hits).  
* Enable anomaly detection and alerting for unusual outbound traffic.

**Mitigation Steps (Developer Focused)-**

  **Input Validation & Whitelisting**

✅ Accept only URLs from trusted, vetted sources.  
❌ Don’t blindly accept any http(s):// input from users.

  **DNS Resolution & IP Filtering**

* Use libraries or middleware that validate **resolved IP addresses**, not just the domain names.  
* Reject inputs resolving to internal IPs.

  **Proxy and Egress Controls**

* Route all outbound requests through a secure proxy.  
* Configure proxies to **block internal destination IP ranges**.

  **Use Cloud Provider Best Practices**

* On AWS: enforce [IMDSv2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html).  
* Use strict IAM roles with the **principle of least privilege**.

  **Monitor and Alert**

* Flag and investigate unexpected outbound HTTP requests.  
* Maintain logs with URL, timestamp, destination IP, and user session.

  **Perform SSRF-Specific Tests**

* During development and pentesting, use tools like **Burp Collaborator**, **SSRFmap**, or DNS logging endpoints to detect blind SSRF.  
* Test both **active** and **passive** endpoints.

