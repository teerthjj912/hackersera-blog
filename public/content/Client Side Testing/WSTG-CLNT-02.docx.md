**WSTG-CLNT-02**

Test Name----\> Testing for JavaScript Execution

Objectives---\> \- Identify sinks and possible JavaScript injection points.

**Overview-**

JavaScript execution vulnerabilities are basically the web equivalent of leaving your front door wide open with a neon sign saying “Come on in\!” This happens when an attacker manages to inject and execute arbitrary JavaScript in the victim’s browser by exploiting poorly validated inputs or unsafe client-side code.

Unlike server-side injection, here the attacker manipulates the client-side environment, injecting scripts that run in the context of the web app, leading to session hijacking, data theft, defacement, or even complete account takeover.

**Real World Example-**

**The Incident:**  
An e-commerce site allowed users to customize their profile bio, which was then displayed without proper sanitization using innerHTML. Attackers slipped in a \<script\> tag that executed a script to steal user session cookies and silently send them to an external server.

**What Went Wrong:**

* User input was directly injected into the DOM without encoding or sanitization.  
* No Content Security Policy to block inline script execution.  
* Overreliance on client-side validation without server-side checks.

**How the Vulnerability occurs-**

**Unsafe Injection Points**

Common sinks include innerHTML, eval(), setTimeout(), setInterval(), Function(), and event handler attributes like onclick. When these functions consume untrusted input without validation, it opens the door for script injection.

**Direct Script Injection**

Attackers craft malicious payloads, often embedded in input fields, URL parameters, or cookies, which get executed when the JavaScript engine processes them.

**Bypass of Input Filters**

Sometimes input sanitization is weak or inconsistent, allowing cleverly crafted payloads to slip through, especially if filters are based on blacklists.

**Secure Coding Recommendations-**

  **Never Trust Untrusted Input:**  
Always treat any input as hostile and sanitize or encode appropriately before use in JavaScript execution contexts.

  **Avoid Dangerous Functions:**  
Avoid using eval(), new Function(), setTimeout() with string arguments, or any function that executes strings as code.

  **Sanitize Inputs Based on Context:**  
Apply context-aware encoding—HTML encode when inserting into the DOM, JavaScript escape when injecting into scripts.

  **Use Safe DOM APIs:**  
Prefer safe APIs like textContent or createTextNode instead of innerHTML.

  **Implement Content Security Policy (CSP):**  
Restrict script sources and block inline scripts to reduce the impact of injected scripts.

**Mitigation Steps (Developer Focused)-**

* Identify all JavaScript sinks where user input flows into execution contexts.  
* Replace dangerous functions with safer alternatives or sanitize inputs before use.  
* Employ strict input validation and context-specific output encoding.  
* Deploy and maintain a robust CSP.  
* Regularly audit code for risky patterns like use of eval() or dynamic script insertion.  
* Educate developers on safe JavaScript coding practices and common injection vectors.

