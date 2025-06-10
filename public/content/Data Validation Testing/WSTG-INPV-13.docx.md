**WSTG-INPV-13**

Test Name----\> Testing for Format String Injection

Objectives---\> \- Assess whether injecting format string conversion specifiers into user-controlled fields causes undesired behaviour from the application.

**Overview-**

**Format String Injection** is a lesser-known but highly dangerous vulnerability that arises when an application processes user-supplied input as a format string in functions like printf(), fprintf(), sprintf(), or their equivalents in various languages—without proper sanitization.

Originally more prevalent in C/C++ environments, this vulnerability can result in serious consequences such as **information leakage**, **memory corruption**, **denial of service**, and **arbitrary code execution**. When format specifiers such as %x, %s, %n, etc., are included in user-controlled data and directly passed into formatting functions, the application may inadvertently read from or write to unintended memory locations.

In modern systems, format string vulnerabilities can still surface in backend components, legacy codebases, and embedded systems, particularly in systems handling log output, user notifications, or templating.

**Real World Example-**

**The Incident:**  
A telecommunications company once used a legacy C-based customer support dashboard. When users submitted a help ticket, their messages were written to a server log using fprintf() like so:

fprintf(logfile, user\_input)*;*

An attacker submitted a ticket with the content:

Error occurred at %x %x %x %x

Upon writing this to the log file, the system interpreted the format specifiers and printed memory content from the stack into the logs. Through multiple iterations, the attacker eventually used %n to overwrite specific memory addresses, escalating the bug into a full **remote code execution** exploit.

**What Went Wrong:**

* The application did not treat the user input as a simple string—it used it as a **format string**.  
* No sanitization or control was placed on the message being written to the log file.  
* The system interpreted format specifiers from untrusted input, leading to memory disclosure and ultimately memory manipulation.

**How the Vulnerability occurs-**

Format String Injection typically occurs when:

* Functions like printf(), sprintf(), fprintf(), syslog(), or similar logging functions are used incorrectly.  
* The developer uses user input **as the format string itself**, not as an argument to be safely printed.  
* The language runtime interprets user input containing % directives, causing it to access the stack, memory, or even modify memory.

**Example Vulnerable Code (C):**

char \*user\_input \= get\_input()*;*  
printf(user\_input);  // ❌ Vulnerable

**Safe Version:**

printf("%s", user\_input);  // ✅ Safe

Common exploitation techniques include:

* Using %x to read stack values.  
* %s to read from specific memory addresses (leading to memory leaks).  
* %n to write to memory, often exploited to alter function pointers or return addresses.

While rare in modern high-level languages like Python, PHP, or JavaScript, vulnerable usage can still occur in:

* Embedded C/C++ code.  
* System-level daemons.  
* Logging mechanisms in legacy or cross-language integrations.

**Secure Coding Recommendations-**

**Never use user input as a format string.** Always separate format specifiers and input values.

printf("%s", user\_input); // Not printf(user\_input)

  **Use compiler warnings and static analysis.** Many compilers can catch format string issues when properly configured (e.g., \-Wformat-security in GCC).

  **Avoid dangerous functions.** Favor safer alternatives like snprintf() over sprintf().

  **Sanitize input if dynamic formatting is necessary.** Filter out %, control string length, and escape values.

  **Implement logging wrappers.** Build centralized, secure wrappers for all log/formatting functions to reduce developer error.

  **Use memory-safe languages.** Where possible, use Rust, Go, or Java to reduce exposure to low-level memory vulnerabilities.

  **Review legacy code and third-party integrations.** Format string flaws often lurk in old codebases or C-based third-party libraries.

**Mitigation Steps (Developer Focused)-**

1. **Do Not Trust User Input as Format Strings:**

   Never pass raw user input as the first parameter to any function with format-string behavior.

2. **Enable Compiler Protections:**

   Use \-Wformat \-Wformat-security and treat warnings as errors (-Werror) to catch format string issues during development.

3. **Use Parameterized Logging and Output APIs:**

   Always specify static format strings and insert dynamic content through variables.

4. **Filter User Inputs:**

   For systems that must process user-submitted strings (e.g., email templates, feedback forms), escape %, {}, or any runtime-evaluated tokens.

5. **Use Safer Language Constructs:**

   For example, in Python, use logging.info("User input: %s", input) rather than "User input: %s" % input.

6. **Perform Thorough Code Reviews:**

   Pay extra attention to format functions in C/C++ and audit legacy code for improper usage patterns.

7. **Add Runtime Checks in Logs:**

   Sanitize log entries before writing them to disk. If necessary, replace format symbols before logging.