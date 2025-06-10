**WSTG-INPV-18**

Test Name----\> Testing for Server-side Template Injection

Objectives---\> \- Detect template injection vulnerability points.

\- Identify the templating engine.

\- Build the exploit.

**Overview-**

**Server-side Template Injection (SSTI)** occurs when an application incorporates untrusted input into server-side templates without proper sanitization or escaping. Templating engines are often used in web applications to dynamically render HTML views, emails, or even documents. When improperly handled, they can open doors to arbitrary code execution, data leakage, server-side logic abuse, and total system compromise.

Common server-side template engines include:

* **Python:** Jinja2, Mako, Tornado, Django Templates

* **PHP:** Smarty, Twig

* **Java:** FreeMarker, Velocity

* **Node.js:** Pug, EJS

* **Ruby:** ERB, Liquid

These engines provide syntax to execute expressions, access variables, and sometimes even run functions. If a developer mistakenly renders user-supplied input directly within templates like this:

render\_template("Hello {{ user\_input }}")

The attacker could pass a payload like:

{{ 7\*7 }}

And boom—**the application leaks logic execution**, evaluating it to 49\. That’s a telltale sign of SSTI. If exploitable further, it can lead to **remote code execution (RCE)**.

This vulnerability is extremely dangerous because it **runs on the server**, not in the client browser—meaning firewalls, WAFs, and client-side validations can’t help.

**Real World Example-**

* **The Incident:**  
  In 2019, a large open-source CRM platform suffered from an SSTI flaw in its email notification system. Users could configure email templates with custom fields—but due to improper sanitization, these fields were rendered using Jinja2 with no input filtering. An attacker with access to the email customization feature injected this payload:

{{ config.\_\_class\_\_.\_\_init\_\_.\_\_globals\_\_\['os'\].popen('id').read() }}

The server rendered the template with this payload, and the attacker received the output of the id command in the email content. This confirmed arbitrary command execution.

**What Went Wrong:**

* **User input was embedded directly into the Jinja2 template context.**  
* There was **no validation, sanitization, or escaping** of input variables.  
* The app **used a powerful templating engine (Jinja2)** with access to Python internals.  
* No sandboxing or runtime restrictions were in place.

This vulnerability allowed **unauthenticated remote code execution**, which was eventually weaponized to gain root shell access and database exfiltration.

**How the Vulnerability occurs-**

SSTI arises when:

* The app dynamically renders user input inside templates.

* It uses powerful template engines that allow expression evaluation, method calls, or even full object traversal.

* There is **no input sanitization or output encoding**.

* Developers **blindly trust user input** for template customization, rendering, or display logic.

**Typical indicators:**

* Rendering output such as 49 when input was {{7\*7}}

* Output showing errors from a template engine (e.g., Jinja2, Twig)

* Ability to traverse objects: {{ ''.\_\_class\_\_.\_\_mro\_\_\[1\].\_\_subclasses\_\_() }}

**Example vulnerable code:**

@app.route('/welcome')  
*def* welcome():  
    name \= request.args.get("name")  
    return render\_template\_string("Welcome, {}".format(name))  
**Exploitation stages:**

* **Detection:** Inject basic arithmetic or template syntax to confirm injection:

{{7\*7}} → Should return *\`49\`*  
*$*{7\*7} → Template engine specific

* **Fingerprinting:** Identify the engine by testing known syntax patterns.

* **Escalation:** Use payloads to access internal objects or call functions.

* **Exploitation:** If the engine exposes OS or system objects, execute commands.

**Secure Coding Recommendations-**

  **Never render untrusted input directly into templates.**  
Avoid functions like render\_template\_string() or dynamic template evaluation with user input.

  **Use Context Isolation:**  
Only pass safe variables into the template rendering context. Whitelist expected inputs and ensure only safe values are rendered.

  **Escape user input in templates:**  
Use the templating engine's autoescaping features. Most modern engines support this by default—**don’t disable it**.

  **Apply Content Security Policy (CSP):**  
Although CSP is a client-side mitigation, it helps limit the impact of reflected payloads when combined with other flaws.

  **Sanitize inputs with libraries:**  
Use strong input validation libraries and sanitize inputs before they are even passed into templates.

  **Use minimal and safe template engines when possible:**  
Some template engines are safer by design (e.g., using whitelists or limited functionality like Mustache).

  **Avoid direct string-based template rendering:**  
If you must render templates dynamically, use server-controlled templates and inject only server-sanitized content.

**Mitigation Steps (Developer Focused)-**

  **Avoid Unsafe Rendering Functions**

❌ Bad:

render\_template\_string("Welcome, {}".format(user\_input))

✅ Good:

render\_template("welcome.html", *name*\=escape(user\_input))

  **Enable Autoescaping in Template Engine**

Make sure engines like Jinja2 have autoescape=True set by default.

  **Input Validation**

* Use regular expressions or schema validation to reject suspicious inputs.

* Apply strong type checking where applicable.

  **Use Secure Defaults**

* Prefer templating engines that **don't allow arbitrary code execution**, such as Mustache or Handlebars.

* Configure templates with strict sandboxing.

  **Perform Engine Fingerprinting Safely in Tests**

Use fuzzing and known payloads ({{7\*7}}, ${7\*7}, \<%= 7\*7 %\>, etc.) to determine the underlying engine and test accordingly.

  **Log and Monitor for Suspicious Template Syntax**

Set up alerts for repeated usage of symbols like {{, ${, \<%= in URLs, forms, or headers.

