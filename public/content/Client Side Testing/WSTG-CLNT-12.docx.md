**WSTG-CLNT-12**

Test Name----\> Testing Browser Storage

Objectives---\> \- Determine whether the website is storing sensitive data in client-side storage.

\- The code handling of the storage objects should be examined for possibilities of injection attacks, such as utilizing unvalidated input or vulnerable libraries.

**Overview-**

Modern web applications love speed — and **browser storage APIs** like localStorage, sessionStorage, IndexedDB, and even WebSQL (RIP) offer developers fast, persistent, and convenient ways to stash data right in the browser. It’s client-side caching on steroids. But as with all powerful features, browser storage comes with a truckload of responsibility.

The core problem? **No built-in security**.  
Anything you put in localStorage is:

* **Visible to JavaScript running on the page**.  
* **Accessible to XSS attacks**.  
* **Persisted across sessions (for localStorage)**.

That means if sensitive data — like JWT tokens, user IDs, or internal configuration — is stored here without encryption or proper expiration logic, attackers who gain even minimal script execution on your page can grab the keys to the kingdom. Combine that with poor validation or unsafe library usage, and you’ve got a party no one asked for.

**Real-World Example-**

**The Incident:**  
In 2019, a popular productivity tool was found storing **OAuth tokens** and **user role data** in localStorage. One of their embedded third-party analytics scripts was later found vulnerable to XSS via a subdomain takeover. Result? An attacker could:

* Inject a script,  
* Access the localStorage token,  
* Reuse it to hijack admin accounts.

**What Went Wrong:**

* Sensitive data (access tokens) were stored in client-side storage.  
* XSS made it game over.  
* No token revocation or integrity validation.  
* No HTTP-only cookie fallback — all in JS memory.

**How the Vulnerability occurs-**

Here’s how poor browser storage practices become security landmines:

**Storing Sensitive Information Client-Side**

Developers often stash sensitive data like:

* Authentication tokens  
* Passwords (yes, this still happens)  
* Internal config values  
* User roles/privileges

...in localStorage or sessionStorage — which is **not protected** against XSS. If an attacker gets script execution, they get all your stored goods.

**Unvalidated Input in Storage APIs**

If the application writes to storage directly from URL params or user-controlled input **without validation or encoding**, attackers can inject malformed data that may trigger DOM-based XSS, logic flaws, or worse when later read from storage.

**Using Vulnerable or Outdated Libraries**

Storage wrappers (like custom SDKs, frameworks) may introduce vulnerabilities in how data is written/read, especially if they:

* Don’t sanitize keys/values  
* Serialize/deserialize unsafely (e.g., using eval())  
* Automatically sync with DOM without escaping

**No Expiry or Cleanup**

localStorage is permanent until explicitly cleared. Developers forget this, meaning:

* Old tokens or stale session data persist forever  
* Security context is retained even after logout  
* Users on shared machines remain vulnerable

**Secure Coding Recommendations-**

**Never Store Sensitive Data in localStorage or sessionStorage**  
Use **HTTP-only cookies** for session data — these are inaccessible to JavaScript and immune to XSS-based theft.

**Validate and Sanitize All Inputs Before Storing**  
Don't trust data coming from user input, URL parameters, or third-party APIs. Always sanitize before writing to any client-side storage.

**Use Namespacing and Key Standards**  
Avoid key collisions or accidental overwrites. For example:

localStorage.setItem('app.auth.token', '...')*;*

**Avoid eval() or Dangerous Parsers**  
If you're serializing structured data (e.g., JSON), stick with JSON.stringify() and JSON.parse() — never use eval() or dynamic function constructors.

**Implement Storage Expiry Logic**  
Add timestamps to stored data and implement logic to clear or expire entries after a reasonable time. Example:

const expiry \= Date.now() \+ 3600000; // 1 hour  
localStorage.setItem('token', JSON.stringify({ value: token, expiry }))*;*  
**Audit and Minimize Storage Usage**  
Review what’s being stored — manually and via browser DevTools — and remove unnecessary or dangerous entries.

**Set Content Security Policy (CSP)**  
Use strong CSP headers to mitigate XSS attacks, reducing the chance of storage theft even if a vulnerability exists.

**Mitigation Steps (Developer Focused)-**

* **Step 1: Inventory Client-Side Storage Usage**  
  Review all application components (JS, frameworks, third-party libs) that write to localStorage, sessionStorage, or IndexedDB. Identify sensitive values.  
* **Step 2: Migrate Sensitive Data to Server or Cookies**  
  Move access tokens, PII, or any sensitive artifacts out of browser storage and into **secure, HTTP-only cookies** or encrypted server storage.  
* **Step 3: Sanitize All Data Before Storing**  
  Never blindly store data from external sources. Sanitize using libraries like DOMPurify (for HTML) or use input validation frameworks.  
* **Step 4: Validate Data Before Reading**  
  Don’t assume data in storage is what you expect. Always validate and sanitize before use — even your own app can get fed corrupted storage.  
* **Step 5: Securely Clear Storage on Logout**  
  Implement a robust logout flow that clears all storage keys, revokes sessions server-side, and redirects to a clean state.  
* **Step 6: Monitor for XSS and Storage Misuse in CI/CD**  
  Include static and dynamic analysis tools in your CI pipeline to flag storage misuse and potential XSS sinks.

