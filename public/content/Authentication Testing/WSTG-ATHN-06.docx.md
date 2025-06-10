**WSTG-ATHN-06**

Test Name----\> Testing for Browser Cache Weaknesses

Objectives----\> \- Review if the application stores sensitive information on the client side.

\- Review if access can occur without authorization.

**Overview-**

Browser caching is like your browser’s short-term memory — useful, but dangerously forgetful when it comes to security. If a web application caches **sensitive information** like usernames, passwords, session tokens, or personal data, attackers may retrieve it from the browser's **history, cache, or autocomplete**, especially on shared or public systems.

This vulnerability allows unauthorized access to **protected pages, personal data, or even application functionality** — without proper re-authentication.

**Technologies commonly affected:**

* Web applications without cache-control headers

* Applications relying on single-page frameworks (e.g., React, Angular) but failing to manage client-side storage

* Apps using autocomplete/autofill for sensitive forms

**Real World Example-**

**Incident:** In 2019, several healthcare portals were flagged because they allowed caching of patient medical records. If a user logged out without clearing the browser cache, hitting the browser **Back** button or checking browser storage **re-exposed sensitive health information** without requiring login.

**What went wrong:** The applications didn’t implement appropriate cache-control headers to instruct the browser not to store pages containing sensitive information.

**How the Vulnerability occurs-**

Here's how this goes south:

* Browser caches **authenticated pages** or **form responses** by default.

* Cache is not explicitly disabled via HTTP headers.

* Application allows page access via **Back/Forward** navigation or **browser history** after logout.

* Sensitive data gets stored in **localStorage**, **sessionStorage**, or **indexedDB** without proper encryption or expiration.

* Forms with autocomplete="on" expose usernames, email addresses, or even passwords in the dropdown.

**Example insecure HTTP headers:**

HTTP/1.1 200 OK  
Cache\-Control: public  
Example insecure HTML form:

\<input *type*\="text" name\="credit\_card" autocomplete\="on"\>

**Secure Coding Recommendations-**

**Cache Control Headers**

For all authenticated or sensitive content:

* Use the following headers to disable caching:

Cache\-Control: no\-store, no\-cache, must\-revalidate  
Pragma: no\-cache  
Expires: 0

* Apply them to:

  * Account pages

  * Financial/health data

  * Admin dashboards

  * Any authenticated session-dependent content

**Form Hygiene**

* Set autocomplete="off" for forms handling:

  * Passwords

  * Credit card info

  * Personally Identifiable Information (PII)

\<input *type*\="password" name\="password" autocomplete\="off"\>

* Use HTTPS to prevent MITM sniffing of cached data.

**JavaScript Storage Best Practices**

* Avoid storing sensitive data in localStorage, sessionStorage, or indexedDB.

* If absolutely necessary:

  * Encrypt data client-side

  * Expire the data after session ends

  * Clear storage on logout or tab close

**Testing and Validation**

* After logout, test **Back button behavior** and ensure it doesn't show private pages.

* Use developer tools → **Application tab** to inspect local storage and cache behavior.

* Confirm no sensitive data persists after logout or session expiry.

**Mitigation Steps (Developer Focused)-**

**Implement Secure Cache-Control**

On all sensitive HTTP responses (headers):

Cache\-Control: no\-store, no\-cache, must\-revalidate  
Pragma: no\-cache  
Expires: 0

Set this at:

* The **application framework level** (Express.js, Spring, Django)  
* Reverse proxies/load balancers (Nginx, Apache)  
* CDN configurations if used

**Prevent Post-Logout Access**

* Invalidate sessions on logout and ensure browser can't reuse session token.  
* Implement logic to redirect users to the login page if Back button is pressed after logout.

**Disable Sensitive Autocomplete**

* For login and sensitive forms:

\<form autocomplete\="off"\>  
  \<input *type*\="text" name\="email" autocomplete\="off"\>  
\</form\>

* Also disable autofill in browser dev tools if applicable (especially for internal apps).

**Client-Side Cleanup**

On logout:

localStorage.clear()*;*  
sessionStorage.clear()*;*

**Monitor and Audit**

* Regularly test browser behaviors using tools like:  
  * Burp Suite → Proxy → Response Analysis  
  * Manual cache tests  
  * DevTools network inspection

