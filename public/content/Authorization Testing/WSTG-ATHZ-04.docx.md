**WSTG-ATHZ-04**

Test Name----\> Testing for Insecure Direct Object References

Objectives----\> \- Identify points where object references may occur.

\- Assess the access control measures and if they're vulnerable to IDOR.

**Overview-**

**Insecure Direct Object References (IDOR)** occur when an application exposes a reference to an internal object (like a file, database record, or user ID) **without proper access controls**. This allows attackers to manipulate these references to gain unauthorized access to data or actions.

These are typically seen in URLs, form parameters, or APIs where object identifiers are exposed and not validated properly.

**Commonly Affected Technologies:**

* RESTful APIs  
* Web applications using predictable ID schemes (e.g., incremental user IDs)  
* File download endpoints

**Real World Example-**

**Incident:** A fintech app allowed users to download their loan documents via this endpoint:

GET /documents/loan/45678\.pdf  
There was no access control check to ensure the user requesting the document actually owned it. Attackers changed the document ID in the URL and accessed sensitive files belonging to other customers.

**What went wrong:**

* Direct object reference exposed in the URL

* Missing server-side authorization validation

* No object ownership checks

**How the Vulnerability occurs-**

IDOR vulnerabilities generally stem from:

* Trusting user-supplied input to directly fetch objects (like user IDs, invoice numbers, filenames)

* Missing validation to confirm the requesting user is **authorized** to access the object

* Relying only on client-side controls or assuming obscurity will prevent abuse

**Example of insecure implementation:**

@app.route("/invoice/\<int:invoice\_id\>")  
*def* get\_invoice(*invoice\_id*):  
    return send\_file(*f*"/invoices/{invoice\_id}.pdf")  
There’s **no check** to verify if the current user owns that invoice.

**Secure Coding Recommendations-**

**Implement Object-Level Authorization**

* Always verify that the **current user has access to the object being requested**  
* Validate object ownership on the server-side

**Avoid Exposing Direct Identifiers**

* Use non-guessable, opaque references (e.g., UUIDs, hashes, tokens)  
* Don’t expose database IDs or predictable numeric values

**Apply Consistent Access Checks**

* Centralize authorization logic using middleware or security modules  
* Reuse secure access control methods across routes and API endpoints

**Log and Monitor Suspicious Access Patterns**

* Log access attempts to protected objects, especially when access is denied  
* Watch for sequential ID access attempts (e.g., 1001 → 1002 → 1003\)

**Mitigation Steps (Developer Focused)-**

**Always Perform Object Ownership Verification**

Check that the authenticated user has rights to access the requested object:

if invoice.owner\_id \!= current\_user.id:  
    abort(403)

**Use Indirect References**

Instead of using raw object IDs, generate secure, opaque tokens for access:

invoice\_token \= encrypt\_object\_id(invoice.id, user\_secret)

**Secure Your Routes**

Apply decorators or middleware to enforce authorization rules:

@requires\_ownership('invoice')  
*def* view\_invoice(*invoice\_id*):  
    ...

**Inform Users of Authorization Failures Gracefully**

Avoid leaking sensitive information about what they don’t have access to. Use generic messages like:

"You do not have permission to access this resource."

**Avoid Over-Reliance on Client-Side Logic**

Don’t assume users won’t tamper with URLs, request bodies, or query parameters. **Always validate on the backend.**

