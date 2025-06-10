**WSTG-ATHN-08**

Test Name----\> Testing for Weak Security Question Answer

Objectives----\> \- Determine the complexity and how straight-forward the questions are.

\- Assess possible user answers and brute force capabilities.

**Overview-**

Security questions were once the go-to backup for password recovery. But in today's threat landscape, they’re often a **glaring weak spot**. When questions are too simple ("What is your favorite color?") or answers can be easily guessed or found on social media ("Mother’s maiden name"), attackers don’t need brute force — they just need Google or a scroll through your Facebook.

If your application still uses security questions, it's crucial to **evaluate their strength, uniqueness, and resistance to guesswork or social engineering.**

**Technologies commonly affected:**

* Legacy web portals (especially banking, government, or academic systems)

* Any system offering password recovery/reset via static questions

**Real World Example-**

**Incident:** In 2008, Sarah Palin’s Yahoo\! email account was hacked by someone who correctly guessed the answer to her security question: "Where did you meet your spouse?" — information publicly available online.

**What went wrong:**

* The system relied on a single, easily guessable question

* No multi-factor authentication as backup

* No attempt detection or account lockout mechanisms

**How the Vulnerability occurs-**

Security question vulnerabilities typically arise when:

* The questions are **too simple or generic**  
  e.g., “What’s your favorite food?”, “What’s your pet’s name?”

* The answers are **guessable or publicly known**  
  (especially for public figures or oversharers)

* The answers are **stored insecurely** (e.g., in plaintext)

* The system allows **brute-force attempts** or doesn’t throttle/restrict multiple wrong guesses

* There’s **no validation** to ensure users pick unique or complex answers

**Example attack:**  
An attacker resets a user’s password using What city were you born in?. Knowing the target's public profile, they try 5-10 city names and get access — no hacking tools required.

**Secure Coding Recommendations-**

Modern systems should **avoid relying solely on security questions**. If you must use them (e.g., for legacy compliance), treat them like passwords:

**Question & Answer Complexity**

* Avoid questions with **finite or easily guessable answers**  
  (e.g., colors, cities, relatives)  
* Let users **create their own custom question/answer pair**  
  — but validate that the answer is sufficiently long and complex  
* Encourage **non-trivial answers**: enforce a **minimum length**, require **alphanumeric** input

**Limit Guessability**

* Block use of answers found in **common password dictionaries**  
* Monitor and alert on multiple failed recovery attempts  
* Use **CAPTCHA** or similar friction to deter automation

**Use Better Alternatives**

* Prefer **email-based or SMS-based** recovery with short-lived, single-use codes  
* Encourage use of **MFA for account recovery**  
* If using security questions, **require confirmation via second channel** (email/SMS).

**Mitigation Steps (Developer Focused)-**

**📜 Input Validation and Answer Storage**

* Enforce **minimum answer length** (e.g., ≥ 10 characters)  
* Store answers as **salted, hashed values** — never plaintext

import bcrypt  
hashed\_answer \= bcrypt.hashpw(user\_answer.encode(), bcrypt.gensalt())

**Throttle and Monitor Recovery Attempts**

* Limit recovery attempts per user/IP (e.g., max 3 tries/hour)  
* Trigger **alerts** for unusual recovery patterns

**MFA or Multi-Step Recovery**

* Combine security question with:  
  * Email or SMS OTP  
  * Biometric prompt (where applicable)  
  * Temporary account lock and admin intervention (for high-privilege users)

**Deprecate Security Questions Altogether**

If feasible, **disable security question recovery** entirely and shift to:

* **Magic links** sent via email  
* **Authenticator-based recovery**  
* **Time-bound tokens** with 2FA confirmation

