**WSTG-INPV-09**

Test Name----\> Testing for XPath Injection

Objectives---\> \- Identify XPATH injection points.

**Overview-**

XPath Injection is a type of attack that targets XML-based data sources, specifically when user input is unsafely embedded in XPath queries. Much like SQL Injection, this vulnerability arises when an application dynamically builds XPath expressions using unsanitized user input to query XML documents.

When exploited, attackers can manipulate the structure of the XPath query to bypass authentication, retrieve unauthorized data, or even expose the underlying XML structure. Since many legacy and lightweight applications rely on XML for configuration or data storage (especially in embedded systems, single-tier apps, and mobile/web APIs), XPath Injection can present a serious risk — even though it often flies under the radar.

This vulnerability is particularly dangerous in authentication mechanisms where credentials are checked against an XML document. If the input is improperly validated, an attacker can craft payloads that force the query to return true regardless of the actual credentials.

**Real World Example-**

**The Incident:**  
A healthcare portal used an XML file (users.xml) to store staff login credentials. The login form accepted a username and password and used them to build an XPath query like this:

/users/user\[username/text()\='${username}' and password/text()\='${password}'\]

An attacker entered the following values:

* Username: admin' or '1'='1  
* Password: anything

The resulting XPath expression became:

/users/user\[username/text()\='admin' or '1'\='1' and password/text()\='anything'\]  
Due to the or '1'='1' clause, the condition always evaluated to true, regardless of the password. The attacker gained admin access without knowing valid credentials.

**What Went Wrong:**

* User input was directly embedded into the XPath query without sanitization or encoding.

* The logic in the query allowed injection using boolean logic (or, and, not).

* The system lacked proper authentication safeguards, logging, and rate-limiting mechanisms.

This flaw exposed all user accounts and sensitive health data — an especially critical violation under HIPAA regulations.

**How the Vulnerability occurs-**

XPath Injection typically occurs when:

* Applications use XML data sources (like .xml files or XML APIs).  
* Dynamic XPath queries are built using string concatenation with user input.  
* No input validation or escaping of special XPath characters (', ", \], and, or) is implemented.

The attacker manipulates the XPath query to alter its logic, typically by injecting:

* Always-true conditions: admin' or '1'='1  
* Structure-breaking tokens: \]' or '1'='1  
* Traversal operators or wildcard selectors to access unauthorized nodes.

This leads to:

* **Authentication Bypass**  
* **Sensitive Data Exposure**  
* **Authorization Flaws**

If error messages reveal query structure, they may further assist the attacker in crafting precise injections.

**Secure Coding Recommendations-**

  **Use Parameterized XPath Queries (if supported):**  
Just like with SQL, prefer APIs or libraries that support query binding to separate user input from query logic.

  **Sanitize User Input:**  
Apply strict validation based on expected formats (e.g., usernames should only contain alphanumerics). Reject or escape any control characters like ', ", \<, \>, \], /.

  **Escape XPath Special Characters:**  
If using XPath engines that lack parameter binding, ensure user input is escaped using safe utility functions before inclusion in queries.

  **Avoid XML-Based Authentication Systems:**  
Whenever possible, use database-backed authentication with hashed and salted passwords instead of relying on XML file parsing.

  **Least Privilege:**  
Ensure that XML files or the components processing them do not run with elevated permissions. Limit access to read-only where applicable.

**Mitigation Steps (Developer Focused)-**

  **Validate Inputs Rigorously:**

* Accept only the characters absolutely necessary for the input field (e.g., usernames, IDs).  
* Use regex to enforce format rules and reject anomalous input.

  **Escape Dangerous Characters:**

* Escape single quotes ('), double quotes ("), square brackets (\]), and XPath operators if input must be used in XPath.

  **Use Secure Libraries or Parsers:**

* Use libraries that support prepared XPath statements or DOM-safe evaluation.  
* In Java, consider libraries like javax.xml.xpath with proper input sanitation.

  **Avoid Building XPath Strings via Concatenation:**

* Never build XPath expressions by string concatenation of user input.  
* Instead, separate logic and data layers, using proper abstraction.

  **Employ Error Handling and Logging:**

* Do not display XPath error messages to the user.  
* Log suspicious input patterns for monitoring and response.

  **Apply Rate Limiting & Monitoring:**

* Prevent brute-force XPath injections through account lockout and CAPTCHA after several failed attempts.

