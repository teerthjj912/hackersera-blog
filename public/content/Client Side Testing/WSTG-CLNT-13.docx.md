**WSTG-CLNT-13**

Test Name----\> Testing for Cross Site Script Inclusion

Objectives---\> \- Locate sensitive data across the system.

\- Assess the leakage of sensitive data through various techniques.

**Overview-**

Cross Site Script Inclusion (XSSI) isn’t as flashy as XSS — but it’s the **quiet thief** in the corner. Instead of injecting malicious scripts, XSSI abuses the way browsers handle script loading to **exfiltrate sensitive data** from a different origin, often by **tricking the victim's browser into executing remote scripts that contain data**.

The heart of this attack is JavaScript's \<script src=""\> tag. It bypasses the Same-Origin Policy (SOP) when it comes to loading scripts. If a backend API responds with JSON **without proper content-type headers or anti-CSRF controls**, an attacker can point a \<script\> tag to that endpoint and **harvest its content** — all from their own malicious site.

The result? Data leakage without any direct XSS. It's not about breaking in through the window — it’s about coaxing the app to spill its secrets out the front door.

**Real-World Example-**

**The Incident:**  
A popular budgeting app exposed user spending reports via a GET /api/user-report.json endpoint. This returned a big chunk of sensitive JSON: transaction history, spending categories, even partial credit card numbers. The kicker? The endpoint didn’t check for authenticated sessions using tokens — it relied purely on cookies and returned raw JSON with a 200 OK.

An attacker simply hosted the following:

\<script src\="https://budgetapp.com/api/user-report.json"\>\</script\>  
Then used onerror fallbacks and behavior-based fingerprinting (or even script-wrapping patterns) to leak content.

**What Went Wrong:**

* No CSRF/token protection on the endpoint.

* JSON returned with Content-Type: application/javascript.

* Browser happily included and executed the script.

* Boom: silent data theft.

**How the Vulnerability occurs-**

XSSI happens when:

**Browser Loads Remote Data as a Script**

Web browsers will fetch and execute JavaScript from *any* domain using a \<script\> tag. The Same-Origin Policy **doesn't prevent** the script from running — only from reading its output. But if the script leaks data in predictable ways (e.g., global variables), it can be abused.

**Endpoints Serve JSON or JS Without CORS or CSRF Controls**

If your JSON APIs:

* Return raw, unwrapped data  
* Lack anti-CSRF tokens  
* Use incorrect or loose Content-Type headers (e.g., application/javascript instead of application/json)

...then they’re prime XSSI targets.

**Attacker Loads Target Endpoint via \<script src=""\>**

The attacker sets up a malicious site that includes the victim’s JSON endpoint as a \<script\> tag. If the endpoint responds with data formatted in a way that JavaScript can parse (like an array or object), the attacker can use:

* Variable sniffing  
* Global state leaks  
* Timing or behavioral inferences  
  ...to extract the data indirectly.

**Lack of Response Wrapping or Defensive Headers**

Without defenses like X-Content-Type-Options: nosniff, the browser may treat non-JS content as executable JavaScript — opening the door to inclusion-based attacks.

**Secure Coding Recommendations-**

**Use X-Content-Type-Options: nosniff Header**  
Tell browsers: "Hey, don’t guess — respect the declared MIME type." Prevents browsers from treating JSON as JS.

**Set Proper Content-Type Headers (application/json)**  
Never serve API responses as text/javascript or similar unless intentionally providing JSONP (which you probably shouldn't be doing in 2025).

**Wrap JSON Responses in Comment Guards (XSSI Defenses)**  
Add a prefix like )\]}',\\n before JSON payloads to break execution if interpreted as JS:

)\]}',  
{ "user": "Alice", "balance": 500 }  
**Implement Token-Based Access Controls**  
APIs should verify identity and permissions using strong bearer tokens or signed cookies, not rely solely on the browser's session.

**Use CORS with Strict Origin Checking**  
Explicitly allow only your domain(s) to access APIs via CORS. Never set Access-Control-Allow-Origin: \* unless the endpoint is truly public and stateless.

**Avoid JSONP**  
It’s 2025\. If your API is still using JSONP, it’s time to send it to the old developer’s home and let REST/GraphQL take over.

**Log and Monitor API Access**  
Track unusual requests to API endpoints, especially those that are invoked via \<script\> tags or from unexpected referrers.

**Mitigation Steps (Developer Focused)-**

  **Step 1: Inventory All Public-Facing JSON Endpoints**  
List all endpoints returning structured data (JSON/JS) and confirm whether they’re being consumed by browser-side code or third parties.

  **Step 2: Enforce Proper MIME Types and Headers**  
Ensure responses have Content-Type: application/json and include X-Content-Type-Options: nosniff.

  **Step 3: Wrap JSON Responses**  
Add harmless anti-execution wrappers ()\]}',) at the start of every JSON response. Your frontend should strip it before parsing.

  **Step 4: Restrict Script Inclusions**  
Implement Content Security Policy (CSP) that limits allowed scripts and avoids inline execution where possible.

  **Step 5: Implement Strong Authentication**  
All data-returning endpoints should verify identity using access tokens (e.g., OAuth) or signed cookies — not assume session context blindly.

  **Step 6: Block Cross-Origin Inclusion**  
Add a defensive pattern in your API gateway or CDN to block suspicious script inclusions from third-party origins.

  **Step 7: Test Using a Controlled XSSI Lab**  
Set up test harnesses where you deliberately include your endpoints via \<script src=""\> from another origin. Validate whether data is leaked, parsed, or mishandled.