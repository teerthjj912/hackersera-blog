**WSTG-BUSL-05**

Test Name----\> Test Number of Times a Function Can be Used Limits

Objectives---\> \- Identify functions that must set limits to the times they can be called.

\- Assess if there is a logical limit set on the functions and if it is properly validated.

**Overview-**

Some functions in a web application are **meant to be used sparingly**—whether it’s resetting a password, applying a coupon code, downloading a resource, or sending money. If an application fails to enforce strict, server-side limits on how often these functions can be used, **it invites abuse**. This category of testing focuses on identifying those critical functions and determining whether they can be **invoked repeatedly without restriction**, leading to financial loss, resource exhaustion, or workflow bypasses.

**Real World Example-**

**The Incident:**  
A digital wallet service allowed users to refer friends and receive ₹100 per referral. The client-side controlled how many times the referral code could be used. A user manipulated the API directly—bypassing the front-end checks—and spammed the referral endpoint using automation, generating ₹50,000 in fake credits across burner accounts.

**What Went Wrong:**

* The backend failed to validate the number of times a referral code could be used.

* Rate limiting and threshold checks were absent.

* The logic for "one-time use per user" wasn’t enforced server-side.

**How the Vulnerability occurs-**

**Absence of Usage Counters**

* The application doesn’t keep track of how many times a particular function (e.g., OTP generation, downloads, votes) has been invoked.

**No Server-Side Enforcement**

* All limitations are handled in the front-end, which can easily be bypassed using tools like Burp Suite, Postman, or custom scripts.

**Business Logic Blind Spots**

* Discounts, redemptions, or access-control workflows aren't protected by backend logic that restricts repetitive or recursive usage.

**Automation-Friendly Endpoints**

* APIs for sensitive actions are exposed without any request throttling, CAPTCHA, or authentication validation.

**Secure Coding Recommendations-**

1. **Implement Server-Side Quotas and Counters:**

   * Ensure functions like password resets, referrals, and redemptions are tied to **server-enforced usage counters**.

2. **Track Usage by Account, IP, and Device:**

   * Limit functionality based on **multiple dimensions** to prevent abuse from single users or IP ranges.

3. **Enforce Rate Limiting:**

   * Use frameworks or tools like **Redis \+ RateLimiter**, **API gateways**, or **WAFs** to throttle repeated requests.

4. **Introduce Cooldowns and Expiry Windows:**

   * Add **time-based restrictions** (e.g., "reset password once per hour") to prevent abuse through rapid, repeated attempts.

5. **Ensure Business Rule Coverage in the Backend:**

   * Even if validation is present on the frontend, the **server must always be the final authority**.

**Mitigation Steps (Developer Focused)-**

  Define a list of **sensitive or abuse-prone functions** and attach usage limits in your logic layer or business rules engine.

  **Log and audit all function calls** to detect patterns of abuse or repeated invocation.

  Apply **request throttling mechanisms** at API-level to prevent brute-forcing through automation.

  Use **CAPTCHA or MFA** for actions that are limited to one or a few attempts (e.g., vote, sign-up bonuses).

  Involve **QA and red teams** to test scenarios where limits could be bypassed by calling the API directly or replaying requests.

