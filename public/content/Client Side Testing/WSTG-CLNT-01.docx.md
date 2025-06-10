**WSTG-CLNT-01**

Test Name----\> Testing for DOM-Based Cross Site Scripting

Objectives---\> \- Identify DOM sinks.

\- Build payloads that pertain to every sink type.

**Overview-**

DOM-Based XSS is the sneaky cousin of classic cross-site scripting — the attack happens entirely on the client side. Instead of the server unwittingly injecting malicious scripts, it’s the JavaScript on the page that mishandles untrusted input from URLs, cookies, or other DOM sources, and inserts it unsafely into the page.

Why does this matter? Because even if your server is locked down tight, a careless client-side script can open the door wide for attackers to steal session tokens, deface content, or redirect users to shady places — all without a single server request changing.

**Real World Example-**

**The Incident:**  
A popular single-page application (SPA) reflected URL hash parameters directly into the page without sanitization. Attackers crafted URLs containing malicious JavaScript payloads, which the app’s JavaScript then executed in victim browsers, stealing authentication cookies.

**What Went Wrong:**

* JavaScript blindly injected untrusted URL fragment data into the DOM.

* No sanitization or validation on client side inputs.

* Absence of Content Security Policy (CSP) to mitigate script injection.

**How the Vulnerability occurs-**

**Untrusted Input in DOM Sinks**

Common sinks include innerHTML, document.write(), eval(), setTimeout(), and setting location properties (location.hash, location.href). When these are fed unsanitized user input, the door to DOM XSS swings open.

**Client-Side Only Flow**

The malicious script never touches the server — it’s all in how JavaScript interprets and injects input, making detection tricky.

**Unsanitized URL Parameters or Fragment Identifiers**

Attackers craft URLs with payloads embedded in query strings or fragments, relying on JavaScript to reflect these inputs in the page DOM.

**Secure Coding Recommendations-**

  **Avoid Direct Injection of Untrusted Input into the DOM:**  
Never insert user-controlled data using innerHTML or similar methods without proper sanitization.

  **Use Safe DOM Manipulation APIs:**  
Use textContent or DOM methods like createTextNode to insert untrusted data as plain text, not HTML.

  **Sanitize and Encode Input Before Use:**  
Apply rigorous client-side input validation and encoding tailored to the context (HTML, JavaScript, URL, CSS).

  **Implement Content Security Policy (CSP):**  
A strong CSP can block inline scripts or restrict sources, limiting damage if an injection happens.

  **Regularly Review and Audit JavaScript Code:**  
Specifically look for unsafe DOM sink usage and sanitize all untrusted inputs flowing into them.

**Mitigation Steps (Developer Focused)-**

  Map all client-side sinks where user input influences the DOM or JavaScript execution context.

  Replace risky functions (innerHTML, eval(), document.write()) with safer alternatives or sanitize inputs rigorously before use.

  Encode inputs based on the context — HTML encode for content, URL encode for URLs, JavaScript escape for scripts.

  Deploy a strict, well-configured Content Security Policy header.

  Use client-side libraries designed to safely handle input (e.g., DOMPurify).

  Train developers to understand DOM XSS attack vectors and mitigation strategies.

