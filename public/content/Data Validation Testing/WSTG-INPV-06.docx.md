**WSTG-INPV-06**

Test Name----\> Testing for LDAP Injection

Objectives---\> \- Identify LDAP injection points.

\- Assess the severity of the injection.

**Overview-**

LDAP (Lightweight Directory Access Protocol) is commonly used by applications to authenticate users and retrieve information from directory services like Microsoft Active Directory. In web applications, user input is often used to construct LDAP queries. If the input is not properly sanitized or validated, attackers may manipulate these queries through specially crafted input, leading to unauthorized access, data disclosure, or privilege escalation.

An LDAP Injection attack can allow an attacker to alter LDAP statements and bypass authentication, retrieve unauthorized information, or even modify directory data. This is especially dangerous in enterprise environments where LDAP controls sensitive user permissions and access policies.

**Real World Example-**

**The Incident:**  
In 2017, a major university’s student portal suffered a breach where attackers were able to enumerate student records and access restricted areas by manipulating LDAP queries used in the login mechanism. The application passed user-controlled input directly into an LDAP search filter without sanitization.

**What Went Wrong:**  
The login form took the username and inserted it into an LDAP query like:  
(&(uid=USER\_INPUT)(userPassword=\*))  
Attackers entered an input like \*)(uid=\*) which turned the query into:  
(&(uid=\*)(uid=\*)(userPassword=\*)), effectively bypassing authentication and retrieving all user entries that matched any UID. The failure to sanitize special LDAP characters (\*, ), (, &, |, etc.) resulted in a complete compromise of the authentication mechanism.

**How the Vulnerability occurs-**

LDAP Injection happens when:

* User input is concatenated directly into LDAP queries.

* Input is not sanitized or encoded before being inserted into LDAP filters.

* Special LDAP meta-characters like \*, ), (, |, and & are not properly escaped.

* There is no context-aware validation of input fields meant for identifiers or attributes.

An attacker can exploit this by injecting LDAP filter characters that manipulate the query logic. This can:

* Bypass login mechanisms.

* Retrieve all or specific directory entries.

* Modify or delete directory objects if write permissions are present.

For example, injecting a payload like admin\*)(|(password=\*)) could allow an attacker to authenticate as admin without knowing the actual password, depending on the backend query structure.

**Secure Coding Recommendations-**

* **Use Parameterized LDAP Queries:**  
  Where supported, always use safe APIs that allow parameterized query construction instead of string concatenation.

* **Escape User Input:**  
  Use proper escaping mechanisms to neutralize LDAP special characters. For instance, escape \*, (, ), \\, /, \\x00 and null bytes in user input.

* **Whitelist Input Validation:**  
  Validate inputs using strict allow-lists. For example, restrict usernames to alphanumeric characters only where applicable.

* **Avoid Privileged LDAP Bindings:**  
  Use least privilege when binding to the LDAP server. If possible, restrict access to read-only for public-facing components.

* **Log and Monitor LDAP Queries:**  
  Implement logging to detect anomalies in LDAP queries that might suggest injection attempts.

* **Use Directory Proxy Services:**  
  These can add an additional layer of control and filter malicious queries before they reach the LDAP server.

**Mitigation Steps (Developer Focused)-**

  **Input Handling:**  
Always sanitize and encode user input before using it in LDAP queries. Avoid directly injecting user input into search filters.

  **Query Construction:**  
Use frameworks or libraries that abstract and safely construct LDAP queries.

  **Character Escaping:**  
Implement escaping routines or use LDAP APIs that automatically handle encoding. For example, in Java, use SearchControls and DirContext to safely bind parameters.

  **Error Handling:**  
Disable verbose error messages that reveal the structure of the LDAP query or directory tree to attackers.

  **Test for Injection:**  
Perform security testing (including fuzzing) to check for injection risks in login forms, search filters, and any feature using LDAP input.

  **Training and Awareness:**  
Ensure development teams are trained to understand the risks of LDAP injection and the best practices to avoid them.

