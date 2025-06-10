**WSTG-ERRH-01**

Test Name----\> Testing for Improper Error Handling

Objectives---\> \- Identify existing error output.

\- Analyse the different output returned.

**Overview-**

**Improper Error Handling** is like accidentally leaving your developer diary open to the public—it exposes internal system details that were never meant to be seen. When an application fails to gracefully handle unexpected conditions, it may **leak technical information** such as file paths, server configuration, stack traces, database queries, or even credentials.

This information is a **treasure trove for attackers**, especially during the reconnaissance and exploitation phases. Errors should inform users that something went wrong—but **never why it went wrong** in a technical sense.

**Improper error handling** vulnerabilities generally occur because developers:

* Leave **debug mode enabled** in production.

* Forget to **sanitize or suppress exceptions**.

* Display **raw error messages** returned from the database, framework, or underlying OS.

* Include **excessive detail in logs or client-facing responses**.

Bottom line: if your app’s error messages could double as Stack Overflow answers, you’ve got a problem.

**Real World Example-**

**The Incident:**  
In 2015, a major e-commerce website exposed its backend structure through an unhandled exception. A user entered a malformed coupon code, which triggered a server-side error. Instead of returning a simple “Invalid coupon” message, the application responded with:

System.NullReferenceException: Object reference not *set* to an instance of an *object*.  
   at EcomEngine.Pricing.DiscountHandler.ApplyCoupon(String code)  
   at EcomEngine.Controllers.CartController.Checkout()  
This single error exposed:

* Internal namespaces and class structure (EcomEngine.Pricing)

* Specific method names (ApplyCoupon)

* Technology stack (ASP.NET)

* Poor exception handling (NullReferenceException)

An attacker could use this to build tailored exploits, probe further into class methods, and understand business logic—all because of one unhandled edge case.

**What Went Wrong:**

* **Raw exception returned directly to the user.**

* No generic fallback or error boundary defined.

* Debug info wasn’t stripped in production mode.

This is a classic case where an error doesn’t just tell you something broke—it hands you the blueprint of the building.

**How the Vulnerability occurs-**

Improper error handling usually arises due to:

* Lack of a global exception handler.

* Logging or displaying unfiltered stack traces, database errors, or server info.

* Returning different HTTP status codes or messages for different failure conditions (e.g., 403 vs. 401 vs. 500).

* Exposing debugging frameworks like Flask’s debugger or PHP error messages.

* Misconfigured frameworks that **show errors by default** (looking at you, Django DEBUG=True).

**Common scenarios where this happens:**

* Invalid user input (e.g., missing parameters, type mismatches).

* Backend failures (e.g., database timeout, null references).

* Unexpected data from API responses.

* Missing files or routes.

**Indicators of improper error handling:**

* Stack traces in responses.

* SQL errors like You have an error in your SQL syntax.

* Java/Python/C\# error messages.

* File paths like C:\\inetpub\\wwwroot\\index.php.

Even worse, some applications **log these errors insecurely** or **return user-controlled data in the error message**, creating further injection opportunities.

**Secure Coding Recommendations-**

1. **Use Generic Error Messages:**

   * Show user-friendly, non-technical messages like:  
     "Something went wrong. Please try again later."

   * Avoid revealing what went wrong (e.g., no mentioning of NullPointerException, table names, or SQL).

2. **Centralize Exception Handling:**

   * Use global error handlers or middleware to catch and process errors consistently.

   * This prevents raw stack traces from leaking to the user.

3. **Sanitize and Limit Logs:**

   * Log errors **securely** with limited context.

   * Avoid logging full user input unless required—and never log sensitive data (passwords, tokens).

4. **Disable Debugging in Production:**

   * Set DEBUG \= False or equivalent in all production environments.

   * Disable tools like Flask debugger, Django debug toolbar, or Node's error stack dumping.

5. **Differentiate Server Errors Internally, Not Publicly:**

   * Return a generic 500-series error to the user.

   * Internally, classify and monitor different types of errors for triaging.

6. **Use Error Boundaries in Front-End Apps:**

   * In React or similar frameworks, use ErrorBoundary components to catch crashes and display fallback UI.

7. **Avoid Revealing Server Headers:**

   * Use security headers like Server: nginx or strip server version identifiers (Apache/2.4.41).

**Mitigation Steps (Developer Focused)-**

✅ **DO THIS:**

* Wrap critical functions in try/catch blocks.

* Sanitize logs before writing them (especially if logs are viewable or shipped).

* Use centralized logging tools (like ELK, Datadog, or Sentry) with controlled access.

* Set up error alerts and dashboards to track recurring issues without exposing them to users.

* Conduct regular code reviews for debug traces and error message handling.

* Ensure user-supplied input is **never echoed back in errors** (especially in JSON/XML responses).

❌ **DON’T DO THIS:**

* Don’t show full exception messages to end users.

* Don’t leave debugging endpoints or verbose error output enabled in production.

* Don’t log credentials, personal data, or raw request bodies in plaintext logs.

