**WSTG-ERRH-02**

Test Name----\> Testing for Stack Traces

Objectives---\> \- Detect if stack traces are exposed to the client.

\- Understand what internal information is revealed through them.

\- Assess the potential for attacker exploitation.

**Overview-**

A **stack trace** is a debug tool developers use to trace the sequence of function calls and file references leading up to an error. Great for debugging. **Terrible when exposed to attackers.**

When an application throws an unhandled exception and returns a stack trace to the client, it can inadvertently reveal:

* **Application architecture**

* **File paths and directory structures**

* **Programming language and framework versions**

* **Method names and internal logic**

* **Sensitive data in memory at crash time**

* And sometimes even **authentication tokens or query strings**

In short, exposing a stack trace is like dropping your application’s Google Maps history, home address, and work diary into an attacker’s lap.

This vulnerability doesn’t directly grant access or control, but it dramatically **amplifies the effectiveness of follow-up attacks**—especially in recon and exploitation phases.

Even worse: some frameworks automatically include user input in the stack trace, which can lead to **reflected XSS**, **information disclosure**, or even **path traversal revelations**.

**Real World Example-**

**The Incident:**  
In 2021, a fintech startup exposed Java-based stack traces to end users when unexpected inputs were submitted via its “Loan Eligibility” form. A user entered non-numeric characters in the "annual income" field, which triggered the following error:

java.lang.NumberFormatException: For input string: "twenty thousand"  
    at com.finstart.loan.calc.EligibilityEngine.parseIncome(EligibilityEngine.java:84)  
    at com.finstart.loan.controller.LoanController.submitForm(LoanController.java:127)

This output gave away:

* Internal package and class structure (com.finstart.loan.calc)  
* The backend logic file handling form input (EligibilityEngine)  
* Line numbers where the exceptions were thrown  
* The fact that **no input validation** was being done prior to casting

An attacker now had a clear understanding of:

* Where the user input was processed  
* What kind of values to supply to test further vulnerabilities (like injection or DoS)  
* That the app was likely using **Spring Boot or similar Java frameworks**

**What Went Wrong:**

* No generic error message for the client.  
* No input validation on the front-end or back-end.  
* Stack trace returned in full, including class names and file line numbers.

This isn't just an error—it's an invitation.

**How the Vulnerability occurs-**

Stack trace exposure generally happens when:

* An application encounters a **runtime or unhandled exception**.  
* The framework or server is configured to **display errors to users**.  
* No **error boundaries**, try/catch, or proper fail-safe mechanisms exist.  
* **Debug mode is enabled** in production.

Common triggers include:

* Invalid data types (e.g., entering letters into a number field).  
* Null or undefined values.  
* Division by zero errors.  
* Out-of-range access (e.g., indexing an empty array).  
* Database connection timeouts.  
* File-not-found errors in file uploads or downloads.

**Different environments expose differently:**

| Stack Type | Disclosure |
| :---: | :---: |
| **Java** | NullPointerException, class names, method chains, line numbers |
| **Python** | Tracebacks with File, Line, In, and actual code |
| **PHP** | Fatal error, file path, line number |
| **Node.js** | Internal call stack, sometimes even environment variables |

And in Single Page Apps (SPAs), JavaScript stack traces can sometimes be viewed via browser dev tools or even logged in remote telemetry platforms, which if misconfigured, leak them publicly.

**Secure Coding Recommendations-**

1. **Never expose stack traces to users:**  
   * Replace with generic messages like "An unexpected error occurred."  
   * Do not echo exception details, file paths, or class names.  
2. **Centralize and control exception handling:**  
   * Use global error handlers (e.g., Express error middleware, Flask @app.errorhandler, Django custom error views).  
   * Abstract stack traces away from the client.  
3. **Enable logging—but sanitize it:**  
   * Log full stack traces to your logging infrastructure (e.g., ELK, Sentry, Datadog), but ensure these logs:  
     * Are not accessible publicly.  
     * Do not contain sensitive user data or secrets.  
4. **Sanitize inputs and handle exceptions:**  
   * Validate and sanitize all user inputs before processing.  
   * Use strict type checking and fallback error logic.  
5. **Disable debug settings in production:**  
   * Frameworks like Django (DEBUG=False), Flask (app.debug \= False), Laravel (APP\_DEBUG=false) must be properly configured.  
6. **Obfuscate or minimize builds for front-end apps:**  
   * In React, Angular, or Vue, generate production builds with minified and obfuscated code to prevent reverse-engineering stack traces.  
7. **Mask error details in APIs:**  
   * Return standard HTTP status codes (500, 400) without verbose messages.  
   * Use error codes that map to internal messages (e.g., "error\_code": 1053).

**Mitigation Steps (Developer Focused)-**

✅ **DO THIS:**

* Wrap risky operations in try/catch blocks or equivalent.  
* Set up centralized error logging with access control.  
* Ensure front-end apps handle errors gracefully (use ErrorBoundary in React, etc.).  
* Sanitize and hash any dynamic data in stack traces before logging.  
* Conduct automated error-handling testing (simulate failures and test client exposure).

❌ **DON’T DO THIS:**

* Never return Exception.toString() or e.printStackTrace() output to the browser.  
* Don’t log user input directly without sanitization.  
* Don’t leave verbose errors enabled after deployment.  
* Don’t assume internal-only logs or telemetry cannot be exposed (third-party integrations can be leaky).

