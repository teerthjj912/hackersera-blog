**WSTG-CLNT-04**

Test Name----\> Testing for Client Side URL Redirect

Objectives---\> \- Identify injection points that handle URLs or paths.

\- Assess the locations that the system could redirect to.

**Overview-**

Client-side URL redirect vulnerabilities are the sneaky gateways that let attackers send users off to shady, malicious, or unintended destinations. Think of it like someone hijacking your GPS and sending you to a sketchy alley instead of your destination.

This issue arises when URLs or paths accepted by the client-side code (JavaScript, HTML attributes, etc.) can be manipulated to redirect users without proper validation. It’s a classic setup for phishing, malware delivery, or stealing session tokens.

**Real World Example-**

**The Incident:**  
An e-commerce site allowed the return URL after login to be passed via a client-side JavaScript parameter. Attackers tricked users into clicking a login link that redirected them to a phishing page post-login.

**What Went Wrong:**

* No validation or whitelist of acceptable redirect URLs on the client side.

* Blind trust in URL parameters passed to JavaScript or HTML anchors.

* No server-side check to validate or restrict redirect targets.

**How the Vulnerability occurs-**

**Injection Points**

* URL parameters controlling redirection (e.g., ?redirect=...) handled by client-side JavaScript.  
* JavaScript functions reading user-controllable inputs to set window.location or update href attributes.  
* HTML meta refresh tags or anchor elements dynamically set based on user input.

**Impact Scope**

* **Phishing Attacks:** Users redirected to fake login pages or malicious websites.  
* **Malware Delivery:** Redirects leading to sites hosting exploit kits or trojans.  
* **Session Theft:** Redirected pages steal cookies or tokens via cleverly crafted URLs.

**Secure Coding Recommendations-**

* **Validate Redirect Targets:**  
  Use a strict whitelist of allowed URLs or paths for redirects. Reject or sanitize anything else.

* **Avoid User-Controlled Redirects:**  
  Where possible, avoid allowing user input to dictate redirect locations entirely.

* **Use Server-Side Controls:**  
  Ensure redirection logic is validated and enforced on the server, not just the client.

* **Encode URLs Properly:**  
  Prevent injection by encoding URL parameters before usage.

**Mitigation Steps (Developer Focused)-**

  Map out every location where client-side code uses URL or path parameters for redirection.

  Implement and enforce strict whitelisting on redirect URLs.

  Remove or neutralize any redirect parameters that do not comply with business logic.

  Use safe JavaScript methods to update locations and links, avoiding direct assignment from untrusted sources.

  Test with crafted redirect payloads to ensure bypasses don’t exist.

  Train developers and testers to spot unsafe redirect patterns early.

