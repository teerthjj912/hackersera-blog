**WSTG-SESS-07**

Test Name----\> Testing Session Timeout

Objectives----\> \- Validate that a hard session timeout exists.

**Overview-**

Sessions aren't forever — and they shouldn’t be. A session that never times out is like leaving your house unlocked forever, hoping no one notices. This test ensures that web applications implement **session timeouts** to limit the window of opportunity for attackers in case a session token gets compromised.

Timeouts come in two flavors:

* **Idle Timeout**: Ends the session after a period of inactivity.

* **Absolute (Hard) Timeout**: Kills the session after a fixed duration, no matter what.

The focus here? Making sure the **hard timeout** is enforced and not just a suggestion the app ignores.

**Real World Example-**

**Incident:** A financial app allowed users to stay logged in indefinitely as long as they were active. Attackers who gained access to active sessions (via stolen devices or XSS attacks) stayed logged in *forever*, bypassing 2FA and gaining access to sensitive financial data.

The lack of a hard timeout meant there was no auto-kick — even after 12 hours of abuse.

**How the Vulnerability occurs-**

* The application fails to implement **absolute session expiration**, even when the user remains active.

* Session lifetimes are refreshed indefinitely through **sliding expiration**, creating an eternal session.

* **JWTs or tokens** without expiration (exp) claims.

* No **server-side enforcement** of session expiry, relying solely on client-side logic.

**Secure Coding Recommendations-**

**Enforce a Hard Timeout Server-Side**

* Set an absolute expiry time when the session starts.  
* Store session creation timestamp and invalidate after a fixed duration (e.g., 15-30 minutes).

**Avoid Sliding Sessions by Default**

* Refresh session expiry cautiously. Don’t automatically renew sessions forever on every user interaction.

**Include Expiry in Tokens**

* For JWTs, always set the exp (expiration) claim.  
* Example:

{  
  "exp": 1715881200  
}

**Server Should Rule the Clock**

* Client-side scripts shouldn’t determine timeout — they can be bypassed.  
* Enforce logic on the server to check timestamps before processing requests.

**Mitigation Steps (Developer Focused)-**

**1\. Enforce Hard Expiry in Backend**

**In Node.js/Express:**

const MAX\_SESSION\_DURATION \= 30 \* 60 \* 1000; // 30 minutes  
if (Date.now() \- req.session.createdAt \> MAX\_SESSION\_DURATION) {  
  req.session.destroy();  
}

**In Python/Flask:**

session.permanent \= True  
app.permanent\_session\_lifetime \= timedelta(*minutes*\=30)

**2\. Configure Token Expiry Properly**

**JWT Example:**

jwt.sign(payload, secret, { expiresIn: '30m' })*;*

**3\. Invalidate Old Sessions**

* Track session creation time and compare on each request.  
* If exceeded, destroy the session and force re-authentication.

**4\. User Notification (Optional but Helpful)**

* Warn users before automatic logout.  
* Allow data save or a grace period, then redirect to login.

