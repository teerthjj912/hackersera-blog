**WSTG-SESS-08**

Test Name----\> Testing for Session Puzzling

Objectives----\> \- Identify all session variables.

\- Break the logical flow of session generation.

**Overview-**

Session Puzzling is what happens when a web app’s session logic turns into a jigsaw puzzle — where pieces from one state or user can be reused in another, leading to serious security chaos. If session variables are reused, poorly scoped, or not tied properly to a user's session flow, an attacker can manipulate the sequence of events and hijack or spoof part of a user session.

In short: if your app lets users **skip steps**, **reuse tokens**, or **jump workflows** using outdated or mismatched session data, you’ve got a session puzzling problem.

**Real World Example-**

**Scenario:** A shopping site uses session\_id, cart\_id, and user\_id separately. A user logs in, fills a cart, and logs out — but the cart\_id persists. An attacker logs in, modifies the cart ID in the session cookie (from a captured or guessable value), and hijacks the previous user’s cart, viewing and modifying orders.

Because the session logic didn't validate the correlation between session components, it created a mismatch — the perfect puzzle exploit.

**How the Vulnerability occurs-**

* Session variables (user\_id, cart\_id, token, etc.) are handled inconsistently across requests.

* Session data is reused across different workflows or endpoints without validation.

* Poor scoping: session data is accessible when it shouldn't be (e.g., cart data accessible after logout).

* Components like OTPs, order IDs, or auth tokens are processed without checking session context.

Session Puzzling is about **logical disconnection**, not raw brute force.

**Secure Coding Recommendations-**

**Always Link Session Variables to Auth Context**

* Tie sensitive session values (e.g., tokens, IDs) directly to the user session.  
* Don’t allow standalone access to variables unless validated.

**Avoid Stateful Confusion**

* Use clear, non-overlapping session states.  
* Ensure that moving forward in a workflow invalidates previous session data (e.g., token reuse, form resubmissions).

**Clear Expired or Irrelevant Data**

* Clean up unused or sensitive session variables once they're no longer required.  
* Example: Delete OTP or password reset tokens once used or expired.

**Validate Requests Based on Flow**

* Enforce that requests occur in a valid sequence (e.g., login → confirm → success).  
* Use server-side validation to reject requests out of sequence.

**Mitigation Steps (Developer Focused)-**

**1\. Scope and Bind Session Variables**

**Example:**

*\# Don't just store a cart\_id in session*  
session\['cart\_id'\] \= get\_cart\_id(*user\_id*\=session\['user\_id'\])

Always validate ownership:

if cart.owner\_id \!= session\['user\_id'\]:  
    abort(403)

**2\. Invalidate Tokens After Use**

* Password reset tokens, email verification tokens, OTPs, etc., should be **single-use only**.

if token.used or token.expired:  
    return "Invalid or expired token"

**3\. Enforce Logical Session Flow**

Implement workflow checks:

if not session.get('step1\_complete'):  
    redirect('/step1')

**4\. Avoid Carrying Over Session Variables**

Don’t carry session data across unrelated processes:

*\# Before starting new session-based workflows*  
session.pop('old\_process\_id', None)

**5\. Perform Server-Side Auditing**

Log access to sensitive session data and detect anomalies — such as a cart being accessed by a different user, or session data reused after logout.

