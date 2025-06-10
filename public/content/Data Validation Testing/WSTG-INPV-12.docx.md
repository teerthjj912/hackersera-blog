**WSTG-INPV-12**

Test Name----\> Testing for Command Injection

Objectives---\> \- Identify and assess the command injection points.

**Overview-**

**Command Injection** is a critical vulnerability that occurs when an application incorporates user input into system-level commands without proper sanitization. It allows attackers to inject and execute arbitrary commands on the host operating system via a vulnerable application.

Unlike Code Injection, which targets the application’s language interpreter, Command Injection abuses the underlying **OS shell**, enabling attackers to run shell commands like ls, cat, rm, or even initiate reverse shells. This is one of the most devastating vulnerabilities, often leading to **Remote Code Execution (RCE)**, **privilege escalation**, and **system takeover**.

This flaw typically arises in applications that interact with system utilities—for instance, pinging a server, zipping files, or invoking scripts—based on user input. If the input isn't properly sanitized, attackers can append additional commands using shell metacharacters (;, &&, |, etc.).

**Real World Example-**

**The Incident:**  
In 2019, a widely used open-source network monitoring tool was discovered to have a critical command injection flaw. The application had a diagnostic feature that allowed authenticated users to perform ping tests by specifying a hostname. Internally, this input was passed to a shell command like:

ping \-c 4 \[user\_input\]  
An attacker entered:

127.0.0.1; cat /etc/passwd  
The full command executed on the server became:

ping \-c 4 127.0.0.1; cat /etc/passwd  
This immediately exposed the system’s user account information.

**What Went Wrong:**

* The application constructed a shell command by directly inserting user input without validation.

* The server executed the command using shell\_exec(), which interprets shell metacharacters.

* The user’s role was not restricted from executing dangerous diagnostic actions.

Eventually, this vulnerability led to RCE, enabling the attacker to establish a backdoor, pivot to other servers, and exfiltrate sensitive monitoring data from hundreds of enterprise networks.

**How the Vulnerability occurs-**

Command injection vulnerabilities arise when user-controllable input is used to construct system commands without sufficient filtering or escaping. It typically occurs due to:

* Use of vulnerable functions such as system(), exec(), popen(), shell\_exec(), Runtime.getRuntime().exec(), etc.

* Building shell commands through string concatenation.

* Failure to sanitize or whitelist input.

* Shell metacharacters (;, &, &&, |, ||, backticks) being interpreted by the OS.

* Overly trusting any user input, even if it’s authenticated or internal.

**Common injection vectors include:**

* Web forms (e.g., DNS lookups, traceroutes, file uploads).

* Query parameters.

* Cookies or headers.

* URL paths interacting with backend scripts.

**Impacts can range from:**

* Reading sensitive files.

* Data deletion or corruption.

* Remote shell access and full system compromise.

* Lateral movement within internal networks.

**Secure Coding Recommendations-**

* ·  **Never pass unsanitized input to system calls:** Avoid string interpolation in commands. Use safe APIs that separate command logic from arguments.

* **Use parameterized command execution:** In languages like Python or Java, use built-in libraries that avoid the shell (e.g., subprocess.run(\['ping', '-c', '4', user\_input\])).

* **Enforce strong input validation:** Whitelist allowed values (e.g., valid IP addresses, filenames).

* **Escape all user input if shell use is unavoidable:** Use strict escaping routines to neutralize metacharacters.

* **Avoid shell execution altogether:** When possible, eliminate system-level calls and use internal language functions.

* **Run services with the least privileges:** Limit access to the OS or file system.

* **Log and monitor command usage:** Flag any unexpected executions or input patterns in logs.

* **Use Web Application Firewalls (WAFs):** As an additional mitigation layer, though not a substitute for secure code.

**Mitigation Steps (Developer Focused)-**

1. ·  **Replace Risky Functions:**

   * Avoid exec(), system(), shell\_exec(), or equivalents unless absolutely necessary.

   * Prefer language-specific APIs or libraries (e.g., using ping3 in Python instead of shell).

2. **Avoid Shell Invocation When Possible:**

   * Use built-in methods for tasks like file manipulation, DNS resolution, or ZIP compression.

3. **Input Whitelisting:**

   * Only accept values from a pre-approved list (e.g., IP address format for ping tool).

   * Reject any input containing shell metacharacters.

4. **Use Safe Execution APIs:**

   * In Python: subprocess.run() with shell=False.

   * In Node.js: child\_process.spawn() instead of exec().

5. **Restrict File and Command Access:**

   * Ensure the application only interacts with explicitly defined commands and files.

6. **Enforce Output Escaping and Logging:**

   * Sanitize both command outputs and error logs.

   * Store and alert on suspicious command behavior (e.g., rm, curl, wget in logs).

7. **Conduct Security Testing:**

   * Include command injection in automated and manual penetration tests.

   * Test edge cases like command chaining (;, &&), subshells ($(), backticks), and encoded payloads.

