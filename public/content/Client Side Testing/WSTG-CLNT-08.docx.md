**WSTG-CLNT-08**

Test Name----\> Testing for Cross Site Flashing

Objectives---\> \- Decompile and analyze the application's code.

\- Assess sinks inputs and unsafe method usages.

**Overview-**

**Cross-Site Flashing (XSF)** is an old-school but still dangerous vulnerability in which a Flash (SWF) file hosted on a trusted domain can be abused by a malicious site to make requests or perform actions as if they originated from the trusted domain. This is similar to Cross-Site Request Forgery (CSRF), but it leverages Flash content instead of web forms or JavaScript.

XSF becomes possible when the Flash object contains insecure methods (like getURL()) or loads external data without enforcing strict origin policies. If attackers can get the SWF file to make requests to sensitive endpoints — and that request carries session cookies or credentials — it can lead to session hijacking, unauthorized actions, or data exfiltration.

Yes, Flash is deprecated. But here's the kicker: **legacy corporate systems, internal dashboards, and older platforms may still use Flash**, making XSF still relevant in the dusty corners of enterprise tech.

**Real-World Example-**

**The Incident:**  
In a widely circulated vulnerability reported in the past, a financial institution hosted a Flash widget on their public domain. The SWF file used getURL() to fetch configuration data and was configured to allow Access-Control-Allow-Origin: \*. A researcher crafted a malicious webpage that embedded the bank’s SWF and used it to send authenticated requests to transfer funds — all while using the victim’s active session.

**What Went Wrong:**

* The SWF didn’t validate the Domain.allowDomain() settings properly.  
* It used getURL() with dynamic, attacker-controllable input.  
* Flash sent session cookies automatically with the request.  
* There was no origin check or CSRF protection on the backend.  
  Boom — funds transferred. Thanks, Flash.

**How the Vulnerability occurs-**

**Unsafe Flash Behaviors:**

* Using getURL() with attacker-controlled URLs.  
* Failing to restrict allowDomain() or allowInsecureDomain() calls.  
* Accepting user input directly into sensitive request logic.  
* Using loadVariables(), loadMovie(), or XML.sendAndLoad() with unsanitized parameters.

**Attacker Technique:**

1. Host a malicious page that embeds the vulnerable Flash file using \<object\> or \<embed\>.  
2. Feed it crafted input (e.g., query parameters or POST data) to trigger insecure Flash behavior.  
3. Flash makes the request cross-origin using the victim's credentials.  
4. Sensitive actions are performed on the backend — without user consent.

Even worse? Flash has broad access to the browser and can access local resources unless explicitly restricted — a juicy bonus for attackers.

**Secure Coding Recommendations-**

* **Decommission Flash Entirely:** This is the nuclear — and ideal — option. Flash is deprecated by Adobe, blocked by modern browsers, and no longer maintained. If you're still using Flash, start replacing it ASAP with modern JavaScript or HTML5 alternatives.  
* **Use Strong Sandbox Restrictions:** If you must use Flash temporarily, configure crossdomain.xml to tightly restrict domain access. Don’t use wildcards (\*).  
* **Avoid Dangerous Methods:** Refrain from using getURL(), loadMovie(), or similar unless absolutely necessary. If used, they must be restricted to known, whitelisted domains.  
* **Disable Cookies and Credentials:** Ensure that requests made by Flash don’t include session credentials or sensitive headers.  
* **Apply CSRF Protections:** Even though XSF mimics CSRF, the backend should be fortified using CSRF tokens or double-submit cookies.  
* **Conduct Thorough Code Review:** Decompile the SWF (using tools like JPEXS Free Flash Decompiler) and search for risky logic or unvalidated input being used in requests.

**Mitigation Steps (Developer Focused)-**

  **Audit All SWF Files:** Use decompilers to inspect for risky functions and origin policies.

  **Harden crossdomain.xml:** Restrict access to only your trusted domains. This is your CORS equivalent in Flash-land.

  **Strip User Input from SWF Logic:** Never allow dynamic URLs or external requests in response to unsanitized user input.

  **Deprecate and Replace Flash Components:** Build modern replacements using HTML5, React, or Vue — even if it’s just a placeholder.

  **Use Content Security Policy (CSP):** Limit the execution of Flash or plugin content on your site with strict CSP headers.

  **Educate Dev and QA Teams:** Many teams don't even realize legacy Flash content still exists in their app. Bring it into the light and zap it.

