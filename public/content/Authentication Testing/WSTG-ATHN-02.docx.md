**WSTG-ATHN-02**

Test Name----\> Testing for Default Credentials

Objectives----\> \- Enumerate the applications for default credentials and validate if they still exist.

\- Review and assess new user accounts and if they are created with any defaults or identifiable patterns.

**Overview-**

**Default credentials** are pre-configured usernames and passwords that come bundled with software, devices, or applications — often for initial setup or testing purposes. If these credentials aren't changed or disabled before deployment, attackers can exploit them to gain unauthorized access.

This vulnerability is especially dangerous because **lists of default credentials are publicly available**, and automated tools can easily brute-force or scan for them. Even worse, if new user accounts follow predictable patterns (e.g., user1, user2 with password password123), they become low-hanging fruit for attackers.

**Commonly affected technologies:**

* Routers, IoT devices, admin panels, CMSs (WordPress, Joomla)

* Internal tools or dashboards exposed to the internet

* SaaS platforms and development environments

* Custom applications with hardcoded test credentials

**Real World Example-**

**Incident:** In 2021, several Hikvision IP cameras were compromised globally because organizations left the **default admin credentials (admin/12345)** unchanged. Attackers used these to gain access to internal video feeds and networks.

**What went wrong:** Manufacturers had shipped devices with known default credentials. Administrators failed to change them, leaving critical infrastructure exposed to the internet with trivial login barriers.

**How the Vulnerability occurs-**

Default credentials remain exploitable when:

* Developers or admins forget to remove or change them post-deployment.

* Devices or services don’t enforce a password change on first login.

* Registration processes generate predictable or identical credentials.

* Configuration management lacks audit or validation for weak accounts.

**Example of insecure practice (PHP-based admin panel):**

*$*default\_username \= 'admin'*;*  
*$*default\_password \= 'admin123'*;*

Hardcoded values like this may be left behind during development, giving attackers a clear backdoor.

**Secure Coding Recommendations-**

To prevent default credential exploitation:

* **Never hardcode credentials** in source code or config files.

* **Force users to change passwords** during first-time login or account creation.

* Use secure password generation libraries for temporary passwords.

* **Disallow weak or common passwords** (e.g., admin, 123456, qwerty).

* Randomize default credentials per deployment if absolutely needed.

**Recommended practices/tools:**

* Enforce strong password policies with libraries like zxcvbn or OWASP password policy libraries.

* Use tools like TruffleHog to detect hardcoded secrets in source repositories.

* Store credentials securely using secrets management solutions (e.g., HashiCorp Vault, AWS Secrets Manager).

**Mitigation Steps (Developer Focused)-**

Here’s what developers and system architects need to do:

**Eliminate Hardcoded Credentials**

* Scan codebases for any hardcoded usernames, passwords, or API keys before deployment.

* Use environment variables or secure vaults for managing secrets in production.

**Enforce First Login Changes**

* Require all default or temporary passwords to be changed upon first login.

* Invalidate default credentials post-installation automatically.

**Secure Account Provisioning**

* For automatically created accounts (like on registration), generate **random, strong** temporary passwords and **communicate securely** to users.

* Avoid sequential usernames or emails that allow attackers to guess accounts.

**Audit and Monitor**

* Run regular audits for accounts using weak/default credentials.

* Log all login attempts and flag brute-force behavior.

* Include checks in CI/CD pipelines for default account patterns and known credentials.

**Harden Access Points**

* Disable or lock default accounts if not needed (e.g., admin, root).

* Restrict access to admin panels using IP allowlists or 2FA.

