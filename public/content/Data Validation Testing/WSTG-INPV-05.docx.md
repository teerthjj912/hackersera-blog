**WSTG-INPV-05**

Test Name----\> Testing for SQL Injection

Objectives---\> \- Identify SQL injection points.

\- Assess the severity of the injection and the level of access that can be achieved through it.

**Overview-**

SQL Injection (SQLi) occurs when untrusted data is concatenated directly into a SQL query without proper validation or sanitization. This allows an attacker to manipulate the query and potentially access, modify, or delete database records. SQLi is one of the most critical and widespread vulnerabilities in web applications and can result in total database compromise, unauthorized data disclosure, or even remote code execution in some server configurations.

**Real World Example-**

In 2019, the Indian government's Kudankulam Nuclear Power Plant website was reportedly vulnerable to SQL injection, potentially allowing access to sensitive documents. Another classic example is the 2009 Heartland Payment Systems breach, where attackers exploited a SQL injection flaw to access over 100 million credit card records, costing the company over $140 million.

**How the Vulnerability occurs-**

This vulnerability typically arises due to:

* Dynamic construction of SQL queries using user input, e.g.:

SELECT \* FROM users WHERE username \= 'input' AND password \= 'input'*;*

* Lack of prepared statements or parameterized queries.

* Poor or missing input validation, allowing malicious payloads like:

' OR '1'\='1'; \--

* Applications exposing query errors or stack traces that help attackers fine-tune their injection payloads.

Attackers may start with basic payloads to test if an application is vulnerable, then escalate to data extraction, database schema enumeration, or command execution depending on database permissions and configuration.

**Secure Coding Recommendations-**

  **Always use parameterized queries or prepared statements.** These prevent SQL code from being manipulated by treating user inputs as data only.

  **Use Object-Relational Mapping (ORM) frameworks** that abstract SQL query construction securely.

  **Sanitize and validate all user inputs**, even those that appear benign or are client-side controlled (e.g., hidden fields, cookies).

  **Avoid dynamic SQL** where possible. If it's unavoidable, escape inputs safely using appropriate database-specific escaping methods.

  **Implement least privilege on database users.** Ensure the application only has access to the data it needs.

**Mitigation Steps (Developer Focused)-**

**Use Parameterized Queries:**  
Ensure all database interactions use parameterized queries or stored procedures to separate logic from data.

Instead of:

cursor.execute(*f*"SELECT \* FROM users WHERE username \= '{username}' AND password \= '{password}'")

Use:

cursor.execute("SELECT \* FROM users WHERE username \= %s AND password \= %s", (username, password))

  **Validate and Sanitize Input:**

* Whitelist expected formats (e.g., numeric, alphanumeric).  
* Reject suspicious characters (', \--, ;, etc.) where possible.  
* Normalize input to avoid encoding tricks.

  **Apply Principle of Least Privilege:**

* Use separate database accounts with limited permissions for different application components.  
* Avoid running the application with administrative or root-level DB access.

  **Disable Detailed Error Messages:**

* Catch and log SQL errors on the backend.  
* Never expose raw SQL error messages or stack traces to the client.

  **Conduct Regular Security Testing:**

* Perform manual code reviews for all SQL-related logic.  
* Use automated tools (like SQLMap, Burp Suite) during security audits to detect SQL injection vectors.

