**WSTG-INPV-04**

Test Name----\> Testing for HTTP Parameter Pollution

Objectives---\> \- Identify the backend and the parsing method used.

\- Assess injection points and try bypassing input filters using HPP.

**Overview-**

**HTTP Parameter Pollution (HPP)** is when attackers inject multiple HTTP parameters with the **same name** in a single request — exploiting how servers or frameworks parse and prioritize these parameters.

Some systems take the **first value**, others take the **last**, and some create **arrays** — if your backend isn't ready to deal with duplicates, attackers can sneak malicious data right through your filters.

Think of it as sending name=admin\&name=attacker — and watching the confusion unfold.

**Real World Example-**

Imagine an endpoint like:

https://example.com/profile*?*role\=user  
Now the attacker sends:

https://example.com/profile*?*role\=admin&role\=user  
If the backend takes the **first instance**, the user might suddenly gain admin privileges. If it takes the last, filters might get bypassed. And if multiple modules interpret the parameters **differently**, inconsistencies arise — creating a security nightmare.

In login or password reset forms, injecting:

username\=admin&username\=guest  
...can cause logic bugs, bypass validation, or trigger unintended backend behavior — especially in multi-layered applications with disparate validation and authorization mechanisms.

**How the Vulnerability occurs-**

* Lack of consistent parameter parsing across app components (frontend, backend, proxies, WAFs).

* Misconfigured web frameworks that accept and merge repeated parameters.

* Input validation applied **before** interpretation of all parameters.

* Use of query string manipulation in logic-critical routes (authentication, authorization, redirection, etc.).

**Secure Coding Recommendations-**

**1\. Enforce Unique Parameter Keys**

Accept each expected parameter only once. Reject requests that contain duplicate keys.

*\# Python Flask example*  
if len(request.args.getlist("role")) \> 1:  
    abort(400)

**2\. Normalize Inputs Before Processing**

Always **sanitize, validate, and canonicalize** parameters **after resolving** duplicates — not before.

**3\. Use a Trusted Parsing Library**

Avoid custom parameter parsing logic. Let secure, mature libraries handle it — they know the rules of the HTTP jungle better than homebrew code.

**4\. Configure Web Server and WAF Filters**

Ensure your reverse proxies, web servers, and WAFs don’t merge multiple parameter values blindly.

**Mitigation Steps (Developer Focused)-**

| Step | Action |
| :---: | ----- |
| 1️ | Identify critical input points (auth, data access, redirects) |
| 2️ | Check how different components (frontend, backend, API, proxy) parse parameters |
| 3️ | Log and reject duplicate parameters |
| 4️ | Normalize parameter input before applying validation |
| 5️ | Conduct manual HPP testing using tools like Burp Suite and OWASP ZAP |
| 6️ | Run fuzzers to simulate multiple parameter inputs in various combinations |

