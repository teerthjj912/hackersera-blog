**WSTG-ATHN-03**

Test Name----\> Testing for Weak Lock Out Mechanism

Objectives----\> \- Evaluate the account lockout mechanism's ability to mitigate brute force password guessing.- Evaluate the unlock mechanism's resistance to unauthorized account unlocking.

**Overview-**

A **lockout mechanism** is a security control designed to prevent brute-force attacks by locking an account after a set number of failed login attempts. However, if this mechanism is **weak, misconfigured, or absent**, attackers can continuously guess passwords — either slowly to avoid detection or rapidly in a credential-stuffing attack.

Additionally, **poorly designed unlock mechanisms** can introduce new risks — like allowing unauthorized parties to reset account status through weak validation, or making it easy for attackers to **deliberately lock out users** (causing a denial of service).

**Commonly affected technologies:**

* Web apps with login portals

* APIs exposing authentication endpoints

* Mobile & desktop apps with online auth

* Admin dashboards and control panels

**Real World Example-**

**Incident:** In 2022, an online education platform was targeted with a **credential stuffing attack**. Due to the absence of a proper lockout or rate-limiting mechanism, attackers attempted thousands of login attempts with leaked email-password combos, resulting in hundreds of compromised accounts.

**What went wrong:** The application did not lock accounts after failed attempts, nor did it throttle repeated logins from the same IP. There were also no alerts or CAPTCHA to slow down the attacker.

**How the Vulnerability occurs-**

This vulnerability arises when:

* No lockout mechanism is present.

* Lockout is set with too many attempts (e.g., 20+), allowing brute force.

* Lockout is **time-based but short** (e.g., 1-minute lockout).

* Lockout applies globally rather than per-user (e.g., first user locked blocks everyone).

* Unlock mechanism allows resetting via weak or guessable information (e.g., email alone).

* Lockout is **too easy to trigger**, allowing attackers to perform denial of service by intentionally locking others out.

**Example of poor configuration:**

{  
  "maxFailedAttempts": 10,  
  "lockoutDuration": "60 seconds",  
  "unlockMethod": "Email-based reset without OTP"  
}

**Secure Coding Recommendations-**

To implement a strong lockout mechanism:

* **Set a reasonable threshold** (e.g., 5 failed attempts) before locking an account.

* **Use exponential backoff** or progressive delays after each failed login.

* Add **CAPTCHA** after a few failed attempts to deter automation.

* **Log and alert** on abnormal authentication activity (e.g., brute-force patterns).

* Ensure unlock processes use **multi-factor validation** (e.g., OTP \+ email).

* Allow users to unlock their own accounts through **secure, verifiable means** — not just a generic reset link.

**Recommended tools/practices:**

* Use rate-limiting middleware like express-rate-limit or API Gateway throttling.

* Integrate CAPTCHA with libraries like Google reCAPTCHA or hCaptcha.

* Implement MFA through TOTP apps or SMS-based OTPs.

* Monitor login patterns using SIEM tools (e.g., Splunk, ELK, or Wazuh).

**Mitigation Steps (Developer Focused)-**

Here's what to implement from the dev perspective:

**Proper Lockout Logic**

* Lock an account after 3–5 consecutive failed login attempts within a short time window.

* Use **per-user** lockout tracking, not global counters.

* Record failed attempts **per IP** and implement temporary IP blocking or CAPTCHA if abuse is detected.

**Intelligent Unlock Mechanisms**

* Allow self-service unlocks only via **secure, verified channels** (OTP, email+security question, etc.).

* Avoid using static or easily guessable unlock methods.

* Log all unlock events and notify the user via email/SMS.

**Defense-in-Depth**

* Implement **rate limiting** even if lockout is in place — it reduces stress on the system and prevents slow brute-force attempts.

* Add **progressive delays** on each failed login to slow down attacks further.

**Monitoring & Logging**

* Log all login attempts — successful and failed — along with IPs, timestamps, and user-agents.

* Alert security/admin teams on spikes in login failures or repeated lockouts.

**Test It**

* Simulate both brute-force and lockout bypass attempts as part of your automated testing.

* Include lockout validation in your QA checklist before production release.

