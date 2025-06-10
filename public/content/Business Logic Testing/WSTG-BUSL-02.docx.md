**WSTG-BUSL-02**

Test Name----\> Test Ability to Forge Requests

Objectives---\> \- Review the project documentation looking for guessable, predictable, or hidden functionality of fields.

\- Insert logically valid data in order to bypass normal business logic workflow.

**Overview-**

Forging requests is the art of telling a web application, *“I know you told me to click here first, but what if I just sneak around the back?”*

This vulnerability occurs when a user can manipulate requests or parameters—often manually or via tools like Burp Suite—to bypass intended workflows, trigger hidden features, or mess with data they shouldn’t control. These attacks don’t depend on injection or broken crypto; they exploit the app's trust in the **sequence, structure, and logic** of requests.

Imagine skipping the shopping cart and jumping directly to the "Apply Discount and Checkout" endpoint—with your own prices. That’s forging requests in action.

**Real World Example-**

**The Incident:**  
An online movie ticketing platform required users to select seats before making payment. However, an attacker intercepted the network traffic and noticed a POST request to /reserve. By replaying and tweaking this request with different seat\_ids, they could reserve seats *without going through the selection UI*, effectively locking hundreds of premium seats without paying.

**What Went Wrong:**

* The server **blindly trusted** the client to follow the correct flow.

* No server-side enforcement of session state or logical progression.

* Critical fields like user\_id and seat\_id were **manipulatable and predictable**.

**How the Vulnerability occurs-**

**Poorly Controlled Workflow Navigation**

* No checks to ensure a request is made *in the correct order* (e.g., cart → checkout → payment).  
* Lack of validation for prerequisite steps (e.g., user profile creation before placing orders).

**Guessable or Predictable Parameters**

* URLs or endpoints follow a predictable naming scheme (e.g., /edit/1, /edit/2).  
* User roles or permissions can be altered via query strings or form fields.

**Hidden or Undocumented Parameters**

* Fields used internally by developers (like is\_admin=true) are exposed in requests and accepted by the server.  
* Business logic parameters that shouldn’t be user-controllable are still processed.

**Modifying Application State Without Proper Checks**

* Sending crafted API requests directly to change prices, status, or user info.  
* Bypassing UI restrictions (e.g., disabled buttons, read-only inputs) by manually crafting requests.

**Secure Coding Recommendations-**

1. **Implement Strict Server-Side Workflow Enforcement:**

   * Validate session state or workflow progress on the server.

   * Enforce that requests follow a logical sequence.

2. **Avoid Trusting Hidden Fields or Client-Side Logic:**

   * Do not trust parameters sent by the client for anything security-critical.

   * Treat all request parameters as untrusted, even if hidden in forms or JavaScript.

3. **Apply Access Controls Per Request:**

   * Validate user roles, permissions, and ownership on every API or endpoint call.

   * Ensure users can't act “on behalf of” others by modifying IDs or parameters.

4. **Randomize or Secure All Identifiers:**

   * Use UUIDs or opaque tokens instead of auto-incremented IDs.

   * Avoid predictable field values or parameter names.

5. **Use Strong Input Validation:**

   * Validate all input values, including logical consistency (e.g., don’t allow a user to ship before billing).

   * Reject any malformed or out-of-sequence request server-side.

**Mitigation Steps (Developer Focused)-**

* **Design APIs with explicit state transitions**—ensure a payment endpoint won’t work unless the cart step has been successfully completed and verified.

* **Use server-side session tracking** to enforce that users are only interacting with the app in valid sequences.

* **Randomize sensitive fields** like object IDs or tokens to prevent brute-forcing or guesswork.

* **Audit and log every request manipulation attempt**, especially when it contains abnormal or out-of-order behavior.

* **Implement deny-by-default logic**—if a parameter isn't explicitly expected and validated, it should be ignored or rejected.

* **Use parameter binding frameworks** that enforce strong typing and validation of request inputs.

