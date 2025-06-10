**WSTG-SESS-05**

Test Name----\> Testing for Cross Site Request Forgery

Objectives----\> \- Determine whether it is possible to initiate requests on a user's behalf that are not initiated by the user.

**Overview-**

**Cross-Site Request Forgery (CSRF)** is like tricking someone into signing a check without them realizing it. It occurs when a malicious website, email, or script causes a user’s browser to perform an unwanted action on a trusted site where the user is authenticated.

CSRF doesn't steal data — it hijacks trust. If the user is logged in, a forged request can manipulate account settings, make transactions, or change a password — all without the user's consent.

**Real World Example-**

**Incident:** In 2020, a major banking application lacked proper CSRF protection on its fund transfer functionality. A crafted email with a hidden image tag tricked users into initiating transfers simply by opening the email while logged in.

**Result?** Unintended transfers and mass panic. Fortunately, funds were later recovered.

**How the Vulnerability occurs-**

CSRF relies on the fact that browsers automatically include session cookies (and sometimes headers like Authorization) with every request to a domain — regardless of where that request originated from.

Typical causes include:

* **Lack of CSRF tokens** in state-changing requests.

* **Sensitive actions behind GET requests** (which can be executed by just clicking a link or loading an image).

* **Insecure or missing SameSite cookie attribute.**

* **Absence of Origin or Referer validation.**

**Secure Coding Recommendations-**

**Implement CSRF Tokens**

* Embed unique, unpredictable CSRF tokens in all state-changing forms and validate them server-side.  
* Tokens must be tied to the user's session and should **expire**.

**Use SameSite Cookie Attribute**

* Set cookies as SameSite=Strict or SameSite=Lax to prevent cross-origin requests from sending cookies.

**Validate Origin and Referer Headers**

* Server should check these headers to verify that the request came from an allowed domain.

**Avoid GET for State-Changing Actions**

* Use POST, PUT, or DELETE for actions that change state.  
* GET should be strictly for read-only operations.

**Mitigation Steps (Developer Focused)-**

**Use CSRF Middleware/Protection Libraries**

**Example in Express.js (Node):**

const csurf \= require('csurf')*;*  
app.use(csurf())*;*

**Example in Django:**

**Django has built-in CSRF protection:**

\<form method\="post"\>  
  {% csrf\_token %}  
\</form\>

**Set Secure Cookie Attributes**

Set\-Cookie: sessionId\=abc123; HttpOnly; Secure; SameSite\=Strict

**Validate Origin Server-Side**

**In Java (Spring Security):**

http.csrf().requireCsrfProtectionMatcher(new AntPathRequestMatcher("/\*\*"))*;*

**Manually (Node):**

if (req.headers.origin \!=\= "https://trusted.domain.com") {  
    res.status(403).send("Invalid origin");  
}

**Avoid Dangerous Defaults**

* Don’t rely on obscure URLs or “POST-only” requests alone.  
* Don’t assume browser headers will always be present or correct — enforce all checks strictly.

