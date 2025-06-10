**WSTG-INPV-08**

Test Name----\> Testing for SSI Injection

Objectives---\> \- Identify SSI injection points.

\- Assess the severity of the injection.

**Overview-**

Server-Side Includes (SSI) Injection is a vulnerability that occurs when an application dynamically generates HTML pages using input that is not properly sanitized, allowing an attacker to inject SSI directives into the server-side code. These directives are then parsed and executed by the server — leading to potentially serious consequences such as remote code execution, file manipulation, or data leakage.

SSI directives like \<\!--\#exec--\>, \<\!--\#include--\>, and \<\!--\#echo--\> can instruct the web server to run system-level commands or include sensitive files. This vulnerability generally appears in applications running on older or misconfigured web servers (like Apache with SSI enabled) where user input is improperly handled and reflected in .shtml, .stm, or .shtm files.

SSI Injection is especially dangerous because it's executed server-side — meaning the malicious payload doesn’t have to be visible in the frontend to have a destructive impact on backend systems.

**Real World Example-**

**The Incident:**  
A university's web portal allowed faculty members to create personal pages via a WYSIWYG editor that saved pages with .shtml extensions. One user discovered that he could embed SSI tags directly into the HTML content.

He inserted the following into the HTML source:

\<\!*\--\#exec cmd="cat /etc/passwd" \--\>*  
**What Went Wrong:**  
The server was misconfigured to allow SSI parsing on .shtml pages. Since no sanitization or content filtering was applied to user input, the directive was executed when the page was viewed — displaying the contents of /etc/passwd. This not only leaked sensitive system data but also opened the door for other exec commands to be run on the server, including those that could establish remote connections or alter server configurations.

The lack of input validation, no output encoding, and an insecure web server configuration collectively led to full server compromise risk.

**How the Vulnerability occurs-**

SSI Injection occurs when:

* User input is directly included in server-parsed HTML or SHTML files.

* SSI processing is enabled on the web server.

* The application does not properly filter or sanitize input that may contain SSI directives.

* The backend reflects user input into templates or includes without escaping special characters like \<\!--\#.

Common SSI directives exploited:

* \<\!--\#exec cmd="ls" \--\>: Executes system-level commands.

* \<\!--\#include file="/etc/passwd" \--\>: Includes sensitive files in the output.

* \<\!--\#echo var="DOCUMENT\_NAME" \--\>: Reveals internal server variables.

These can be chained or obfuscated to bypass weak filters.

The severity can range from:

* **Information Disclosure** – exposing internal paths, environment variables, etc.

* **File Access** – reading configuration or credential files.

* **Command Execution** – full compromise of the operating system in some cases.

**Secure Coding Recommendations-**

  **Disable SSI Parsing:**  
If your application doesn't absolutely need SSI, disable it at the web server level. For Apache, remove Includes or IncludesNOEXEC from the Options directive.

  **Sanitize and Validate Input:**  
Apply strict input validation and use allowlists for expected input. Escape or strip special characters like \<, \>, \#, and " where appropriate.

  **Use Templating Engines:**  
Leverage secure templating engines that abstract away raw file inclusion or command execution, instead of relying on direct HTML manipulation.

  **Store User Content Separately:**  
Save user-submitted content in databases rather than injecting it directly into SHTML pages. This decouples user input from server-side processing logic.

  **Avoid Reflecting Raw Input:**  
Never reflect user input into server-processed files without sanitizing or encoding it, especially in .shtml, .shtm, or .stm files.

**Mitigation Steps (Developer Focused)-**

1. **Web Server Configuration:**

   * Disable Options Includes in your Apache or NGINX configuration.

   * Use .htaccess to explicitly deny SSI parsing if the server allows it by default.

2. **Input Filtering:**

   * Strip all instances of \<\!--\# and any potential SSI directive tokens from user input.

   * Use encoding libraries to HTML-encode inputs before displaying them.

3. **Use Modern Web Frameworks:**

   * Frameworks like Django, Flask, Spring, etc., do not rely on SSI and come with secure rendering engines by default.

4. **Content Security Policies (CSP):**

   * Implement a strict CSP to prevent execution of injected scripts, even if SSI leads to script inclusion.

5. **Security Testing:**

   * Regularly scan for SSI vulnerabilities using DAST tools or manual testing.

   * Try payloads like \<\!--\#exec cmd="id" \--\> or \<\!--\#include file="/etc/hostname" \--\> in input fields and headers.

6. **Educate Developers:**

   * Train developers on the risks of server-side code injection and how to use secure alternatives.

