**WSTG-CLNT-03**

Test Name----\> Testing for HTML Injection

Objectives---\> \- Identify HTML injection points and assess the severity of the injected content.

**Overview-**

HTML Injection is the sneaky cousin of cross-site scripting (XSS). Instead of injecting raw scripts, attackers inject malicious or malformed HTML code into the page. This can mess with page layout, steal data, trick users with phishing content, or even sneak in scripts indirectly.

Think of it as someone vandalizing your website’s interface—sometimes just annoying, sometimes downright dangerous, depending on what they inject.

**Real World Example-**

**The Incident:**  
A popular forum allowed users to post comments that were reflected on the page without proper escaping. An attacker injected a hidden iframe pointing to a malicious site. When other users visited, their browsers silently loaded the iframe, exposing them to drive-by downloads.

**What Went Wrong:**

* No HTML sanitization on user-submitted content.

* The site rendered user input as raw HTML instead of text.

* Lack of Content Security Policy and user awareness.

**How the Vulnerability occurs-**

**Injection Points**

HTML injection typically happens where user input is reflected in the webpage’s HTML without proper sanitization or escaping. This includes comment fields, user profiles, search inputs, or any form fields that display output.

**Impact Scope**

* **UI Manipulation:** Injected HTML can distort layout or inject fake buttons/forms.  
* **Phishing:** Attackers create deceptive login forms or messages to steal credentials.  
* **Indirect Script Execution:** Embedded tags like \<img\> with onerror handlers can execute JavaScript.  
* **Data Leakage:** Hidden elements can capture keystrokes or mouse activity.

**Secure Coding Recommendations-**

* **Escape User Input:**  
  Always encode special HTML characters (\<, \>, &, ", ') before injecting user data into the page.

* **Use HTML Sanitizers:**  
  When allowing some HTML, use trusted libraries (like DOMPurify) that clean inputs and strip dangerous tags/attributes.

* **Implement Content Security Policy (CSP):**  
  Limit what types of content can be loaded or executed on the page to minimize damage.

* **Avoid Dangerous Rendering Methods:**  
  Avoid inserting raw user input using innerHTML or similar methods without sanitization.

**Mitigation Steps (Developer Focused)-**

  Catalog all points where user input is inserted into HTML.

  Use context-aware encoding for all dynamic content.

  Sanitize any allowed HTML using well-maintained libraries.

  Regularly update CSP headers to restrict inline scripts and resource loading.

  Educate developers and testers about the subtle risks of HTML injection.

  Test thoroughly with crafted payloads to catch bypasses or unexpected rendering.

