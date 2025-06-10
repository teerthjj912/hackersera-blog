**WSTG-INPV-01**

Test Name----\> Testing for Reflected Cross Site Scripting

Objectives----\> \- Identify variables that are reflected in responses. \- Assess the input they accept and the encoding that gets applied on return (if any).

**Overview-**

**Reflected XSS** is like tossing a boomerang with a payload — and having it come straight back at the user… but with consequences.

In Reflected XSS, malicious input is sent via a URL, form, or API call, and is immediately reflected in the server’s response **without proper encoding or sanitization**. This opens the door for attackers to run arbitrary JavaScript in the victim’s browser — hijacking sessions, defacing content, or launching phishing attacks.

It’s not a stored attack — it’s fast, sharp, and usually delivered via **malicious links or phishing emails**.

**Real World Example-**

An attacker crafts the following malicious URL:

https://example.com/search*?*q\=\<script\>alert('XSS')\</script\>  
The search endpoint reflects the input directly back into the HTML response like this:

You searched for: \<script\>alert('XSS')\</script\>  
If the victim clicks that link, their browser executes the JavaScript. Game over — session stolen, cookies leaked, CSRF tokens captured.

**How the Vulnerability occurs-**

* User input (e.g., query params, form fields) is embedded in the response without escaping.

* The server doesn't encode HTML/JavaScript context properly.

* Lack of input validation and output encoding — the golden combo for XSS disaster.

* JavaScript contexts (e.g., innerHTML, document.write, inline event handlers) are vulnerable without proper defenses.

**Secure Coding Recommendations-**

**Input Validation**

Validate input types, lengths, and formats **strictly** — but remember, input validation **alone** is not enough to stop XSS.

**Output Encoding**

**Always encode before output**, based on the context:

* **HTML context:** &, \<, \>, ", '  
* **JavaScript context:** escape quotes, backslashes  
* **URL context:** percent-encoding (encodeURIComponent())

In Python (Flask/Jinja2), templates auto-escape by default:

{{ user\_input }} \<\!*\--* This is safe *\--*\>

In React/Angular — use the framework's built-in sanitization:

\<div\>{userInput}\</div\> // React automatically escapes

Avoid using:

\<div dangerouslySetInnerHTML\={{ \_\_html: userInput }} /\>

Unless you’ve 100% sanitized it.

**Mitigation Steps (Developer Focused)-**

**1\. Use a Trusted Templating Engine**

* Use modern frameworks with **auto-escaping** (e.g., React, Vue, Django, Jinja2).  
* Avoid mixing HTML generation with string concatenation.

**2\. Contextual Output Encoding**

* HTML Encode: Before inserting user input into HTML.  
* Attribute Encode: For inputs inside tag attributes.  
* JavaScript Encode: If embedding data in JS.  
* CSS Encode: When putting values into styles.

**3\. Implement a Content Security Policy (CSP)**

Use CSP headers to restrict where scripts can run from:

Content\-Security\-Policy: script\-src 'self'; *object*\-src 'none'*;*

**4\. Avoid Inline JavaScript**

Keep JavaScript in separate .js files — this works hand-in-hand with CSP.

**5\. Sanitize Inputs Where Necessary**

For rich input (e.g., comments), use a sanitizer like DOMPurify or OWASP Java HTML Sanitizer to clean HTML without breaking functionality.

