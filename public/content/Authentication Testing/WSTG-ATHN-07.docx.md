**WSTG-ATHN-07**

Test Name----\> Testing for Weak Password Policy

Objectives----\> \- Determine the resistance of the application against brute force password guessing using available password dictionaries by evaluating the length, complexity, reuse, and aging requirements of passwords.

**Overview-**

A password is often the first (and sometimes the only) line of defense against unauthorized access. A **weak password policy** — allowing short, simple, reused, or never-expiring passwords — turns this defense into a wet paper wall. If users are allowed to set poor passwords like 123456 or qwerty, attackers can **brute force or guess credentials** using widely available password dictionaries.

**Technologies commonly affected:**

* Web applications that allow self-registration or password updates

* Legacy systems without enforced password complexity rules

* Internal enterprise apps without modern authentication controls

**Real World Example-**

**Incident:** In 2020, an unsecured Elasticsearch database belonging to an e-learning platform exposed 25 million records due to reused credentials. The root issue? Users were allowed to reuse old passwords, and many chose **weak or recycled passwords** across systems — which attackers exploited using credential stuffing attacks.

**What went wrong:**

* No enforcement of strong password complexity

* No restriction on password reuse

* Lack of multi-factor authentication as a fallback

**How the Vulnerability occurs-**

Here’s what a weak password policy typically *doesn’t* do:

* Doesn’t enforce **minimum length** (e.g., \< 8 characters)

* Allows **common or dictionary-based passwords** (e.g., admin, welcome)

* Permits passwords without **special characters, numbers, or mixed-case letters**

* Allows **password reuse** — either the same password again or a recently used one

* Lacks **expiration policy**, allowing unchanged passwords for years

* Doesn’t limit **failed login attempts**, enabling brute-force or dictionary attacks

**Insecure example:**

Password: admin123  
(No restriction, accepted after one attempt)

**Secure Coding Recommendations-**

A strong password policy isn’t just good practice — it’s often a compliance requirement (e.g., NIST, ISO27001, OWASP).

**Password Complexity Rules**

* Minimum length: **At least 12 characters**  
* Must include:  
  * Uppercase & lowercase letters  
  * Numbers  
  * Special characters (e.g., \!@\#%^&\*)  
* Disallow passwords from a **common passwords list** (e.g., rockyou.txt)  
* Block **contextual passwords**: like companyname123, username2024

**Password Reuse and Aging**

* Prevent reuse of the **last 5 passwords**  
* Enforce **password change every 90–180 days** (based on risk profile)  
* Force password change on **first login** or after reset

**Login Rate Limiting & Throttling**

* Lock accounts temporarily after **5–10 failed attempts**  
* Introduce **exponential backoff** for repeated login failures  
* Log and alert on **suspicious login activity**

**Encourage or Require MFA**

* Enforce **multi-factor authentication** (OTP, authenticator apps) for high-privilege users  
* Allow MFA enrollment during first login

**Mitigation Steps (Developer Focused)-**

**🔧 Enforce Secure Password Policy Programmatically**

Use server-side password validation on registration & password reset:

*def* is\_strong\_password(*pwd*):  
    import re  
    if len(pwd) \< 12:  
        return False  
    if not re.search(*r*'\[A-Z\]', pwd): return False  
    if not re.search(*r*'\[a-z\]', pwd): return False  
    if not re.search(*r*'\[0-9\]', pwd): return False  
    if not re.search(*r*'\[\!@\#\\$%\\^&\\\*\]', pwd): return False  
    return True

**Prevent Reuse of Previous Passwords**

* Store password hashes of the last 5–10 passwords per user  
* On password change, compare new hash to stored history

**Use a Password Blacklist**

* Integrate common password databases (e.g., HaveIBeenPwned API)  
* Reject passwords known to have been leaked

**Enforce Expiration and Rotation**

* Implement backend logic to:  
  * Store password\_last\_changed timestamp  
  * Prompt user to update password after 90 days

**Logging and Monitoring**

* Track login attempts per IP/user  
* Alert on:  
  * Rapid login attempts  
  * Repeated failures across accounts  
* Consider CAPTCHA after multiple failed logins.

