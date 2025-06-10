**WSTG-CLNT-05**

Test Name----\> Testing for CSS Injection

Objectives---\> \- Identify CSS injection points.

\- Assess the impact of the injection.

**Overview-**

CSS Injection is a sneaky form of client-side attack where an attacker manages to inject malicious or unauthorized CSS code into a web application. Unlike traditional script injection (like XSS), this one manipulates the appearance and behavior of web pages by exploiting weaknesses in how CSS content is handled.

At first glance, it might seem harmless—after all, CSS just controls the look and feel, right? But don’t be fooled. Malicious CSS injections can be leveraged to steal information, hijack user interactions, or even act as a stepping stone to other more damaging exploits.

How does it happen? When user input or third-party data is incorporated into style attributes, \<style\> tags, or CSS files without proper sanitization, attackers slip in crafted CSS rules or expressions. This injection can cause unexpected page behavior, information leaks, or overlay attacks.

**Real-World Example-**

**The Incident:**  
A popular social platform allowed users to customize their profile pages by submitting CSS snippets to personalize backgrounds and fonts. Unfortunately, the input wasn’t sanitized. Attackers inserted CSS that positioned invisible elements over buttons, creating fake overlays or redirecting clicks to phishing sites.

**What Went Wrong:**

* No filtering or escaping of CSS content submitted by users.

* The system allowed direct injection of user-provided CSS into pages without validation.

* The impact wasn’t just visual — it affected usability and enabled phishing-like behaviors through UI manipulation.

**How the Vulnerability occurs-**

**Injection Points**

* **User-Provided Style Attributes:** User input inserted into inline styles without sanitization.  
* **Dynamic \<style\> Tag Injection:** Inputs that end up directly inside \<style\> tags or CSS files served dynamically.  
* **CSS in URL Parameters:** Some applications take styles or class names from URL parameters that are reflected on the page.  
* **CSS in HTML Templates:** User data embedded into HTML templates influencing CSS selectors or rules.

**Impact and Exploit Potential**

* **UI Redressing & Clickjacking:** Attackers can overlay invisible elements to hijack clicks or obscure legitimate UI elements.  
* **Content Manipulation:** Changing visibility, colors, or layout to confuse users or hide critical information (e.g., hiding error messages).  
* **Data Theft:** With advanced CSS features (like :visited selector exploits), attackers might probe user browsing history or session state in indirect ways.  
* **Denial of Service:** Forcing layout thrashing or excessive rendering can degrade performance or crash the browser.

**Secure Coding Recommendations-**

  **Sanitize All User Input:** Use strict whitelisting of allowed CSS properties and values before injection. Never trust raw user input in styles.

  **Separate Content from Presentation:** Avoid injecting user data directly into CSS or style attributes; prefer safer mechanisms like CSS classes mapped to controlled styles.

  **Use Content Security Policy (CSP):** Enforce CSP rules that restrict inline styles or styles from untrusted sources to limit attack surface.

  **Escape CSS Properly:** If dynamic CSS is unavoidable, ensure user input is correctly escaped according to CSS syntax rules to prevent breaking out of intended contexts.

  **Limit Dynamic CSS:** Minimize or avoid features that allow users to submit arbitrary styles; provide limited customization through predefined themes or options.

**Mitigation Steps (Developer Focused)-**

  Audit all points where user data influences styles or CSS, including inline styles and dynamically generated CSS files.

  Implement validation layers that only allow safe CSS properties and values—prefer regex whitelisting or libraries specifically built for CSS sanitization.

  Avoid placing user input directly in CSS selectors or property names.

  Use CSP headers with style-src directives that restrict style injection, preferably disallowing unsafe-inline styles.

  Test with crafted CSS payloads, including attempts to close style blocks prematurely or inject special characters to escape contexts.

  Educate developers about subtle CSS injection risks—this isn’t just a cosmetic problem; it can be a powerful attack vector.

