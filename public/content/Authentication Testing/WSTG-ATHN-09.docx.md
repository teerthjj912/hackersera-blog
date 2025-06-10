**WSTG-ATHN-09**

Test Name----\> Testing for Weak Password Change or Reset Functionalities

Objectives----\> \- Determine the resistance of the application to subversion of the account change process allowing someone to change the password of an account.

\- Determine the resistance of the passwords reset functionality against guessing or bypassing.

**Overview-**

The password change and reset functionalities are **prime targets** for attackers. Why hack the login form when you can just reset the password and walk right in?

Poor implementations—like skipping identity verification, accepting weak tokens, or allowing guessable reset links—turn these features into **account-takeover goldmines**.

This test assesses whether **an unauthorized party can hijack the reset process**, guess tokens, bypass validation, or manipulate requests to change someone else's password.

**Technologies commonly affected:**

* Web apps with custom password reset flows

* APIs and mobile apps with insecure token validation

* Legacy systems lacking modern verification checks

**Real World Example-**

**Incident:** In 2012, **Dropbox** suffered a breach when a stolen password was reused to access an employee account with weak password reset implementation. Attackers accessed internal documents containing user emails—leading to spam and phishing campaigns.

**What went wrong:**

* No strong validation of password reset request origin

* No notification to users post-reset

* Weak session handling post-password change

**How the Vulnerability occurs-**

This vulnerability typically happens due to:

* **Weak or predictable reset tokens** (e.g., short strings, sequential UUIDs)

* Tokens stored or exposed insecurely (e.g., in logs, URLs)

* Password change allowed **without verifying the old password**

* Missing **CSRF protection** in the change/reset forms

* Reset flows that **don’t expire quickly** or allow **multiple active tokens**

* No identity validation before password change

**Example:**

https://example.com/reset*?*token\=12345  
If an attacker guesses the token or intercepts it, they reset the victim's password and gain control—without ever touching the login screen.

**Secure Coding Recommendations-**

**Token Security**

* Use **cryptographically secure**, random tokens (e.g., 128-bit base64)

* Associate tokens with **IP, device fingerprint, or user ID**

* Store tokens **hashed in the database**, not plaintext

* Expire reset tokens after **15 minutes or single use**, whichever comes first

**Verification Steps**

* For password **changes** (while logged in): require **current password**

* For password **resets** (forgot password): enforce **multi-step verification**:

  * Email or SMS OTP

  * MFA prompt if enabled

  * CAPTCHA to prevent automation

**Security Features**

* Implement **rate limiting** on reset and change requests

* Include **CSRF protection** on password change forms

* Force logout from all sessions after a successful password reset

* Notify users via email after password change/reset with timestamp and IP info

**Mitigation Steps (Developer Focused)-**

**Secure Token Generation**

import secrets  
token \= secrets.token\_urlsafe(32)  
*\# Store hashed version of token in DB*

**Reset Endpoint Best Practices**

* Use POST, not GET, for token submission  
* Invalidate token **immediately after use**  
* Include **timestamp and expiry logic**

if time\_now \- token\_generated\_time \> timedelta(*minutes*\=15):  
    reject\_reset()

**Identity Reverification**

* Always prompt for **current password** before changing password  
* Enforce strong password rules on reset (length, complexity, no reuse)

**Defense-in-Depth**

* Log and alert for unusual reset behavior (e.g., many requests for one user)  
* Use **device recognition** to flag unknown devices  
* After reset, require reauthentication for sensitive actions (like money transfer, email change)

