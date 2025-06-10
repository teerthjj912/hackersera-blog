**WSTG-BUSL-01**

Test Name----\> Test Business Logic Data Validation

Objectives---\> \- Identify data injection points.

\- Validate that all checks are occurring on the back end and can't be bypassed.

\- Attempt to break the format of the expected data and analyze how the application is handling it.

**Overview-**

Business logic data validation flaws arise when an application blindly trusts user input or only validates it on the client side—leaving the server-side logic wide open for manipulation. This isn’t just about SQL Injection or XSS—this is about breaking the *rules of the game* the business has defined.

When data validation is poorly implemented, attackers can:

* Modify price values in payment forms.

* Skip mandatory steps in workflows.

* Tamper with business constraints like age, quantity, or roles.

And the worst part? These bugs often *don’t show up in scanners* because they’re buried in application-specific rules and flows.

**Real World Example-**

**The Incident:**  
A popular e-commerce website allowed users to apply a promo code during checkout. While the client-side form limited the code to one use per order, a savvy attacker noticed that the promo code ID was sent via a hidden form field. By intercepting and duplicating this request with multiple codes, they were able to stack unlimited discounts on a single purchase.

**What Went Wrong:**

* Promo code logic was only enforced on the **frontend**.

* The **backend never re-validated** whether a promo was applied multiple times.

* No limit on discount application per transaction.

**How the Vulnerability occurs-**

**Trusting the Client Too Much**

* Relying on frontend validations (like JavaScript input checks or HTML5 field constraints).  
* Assuming that users won’t tamper with hidden fields or manipulate API requests.

**Lack of Server-side Validation**

* No backend enforcement of data formats, ranges, or business constraints.  
* Accepting invalid data types or skipping format checks (e.g., allowing a string where a number is expected).

**Logical Bypass Attempts**

* Skipping multi-step workflows by jumping directly to final endpoints (e.g., checkout without cart).  
* Modifying read-only fields like prices, roles, or timestamps.  
* Sending malformed or nested payloads to exploit parsing inconsistencies.

**Secure Coding Recommendations-**

  **Enforce Validation on the Server-Side:**

* Validate all inputs on the backend regardless of what the frontend is doing.

* Never rely on client-side checks for security-critical logic.

  **Define and Enforce Strong Data Models:**

* Use strict data schemas and enforce type checking.

* Validate constraints like value ranges, lengths, patterns, and data types explicitly.

  **Harden Business Rules Server-Side:**

* Ensure business logic (e.g., discount limits, age restrictions, step-wise workflows) is enforced on the server.

* Use authorization checks at every stage of the flow—not just at the UI level.

  **Avoid Blind Trust in Client Input:**

* Treat **all user input as untrusted** until proven safe—even if it's from a “trusted” app or mobile client.

* Strip, sanitize, and validate any input or serialized data received.

  **Fail Securely and Log Anomalies:**

* Log failed validations and suspicious manipulation attempts.

* Do not leak sensitive error messages that reveal internal logic.

**Mitigation Steps (Developer Focused)-**

  Establish strict **server-side validation** for all user-controlled inputs, regardless of frontend controls.

  Perform boundary and format checks using centralized validation libraries or data validators.

  For sensitive fields (e.g., price, quantity, role), **do not rely on client-passed values**—fetch and calculate them server-side.

  Create **logical flow constraints** that cannot be bypassed through direct access to endpoints.

  Use tools like JSON schema validation, ORM-level constraints, or contract testing to enforce input integrity.

  Conduct **manual testing of business flows** to catch logic flaws that scanners often miss.

