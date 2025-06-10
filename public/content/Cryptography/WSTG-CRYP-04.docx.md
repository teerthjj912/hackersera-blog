**WSTG-CRYP-04**

Test Name----\> Testing for Weak Encryption

Objectives---\> \- Provide a guideline for the identification weak encryption or hashing uses and implementations.

**Overview-**

Encryption is supposed to keep secrets… well, secret. But when applications use **weak algorithms**, **insecure configurations**, or **improper key management**, the encryption becomes a *false sense of security*. It’s like locking your door with a spaghetti noodle.

Weak encryption vulnerabilities occur when applications rely on outdated, broken, or misused cryptographic primitives—making them trivial for attackers to break through brute-force, known-plaintext, or cryptanalysis attacks. Even worse, many apps still confuse **encoding** or **obfuscation** with actual encryption. (No, Base64 is not security.)

These issues are prevalent in both **data at rest** (e.g., stored passwords, files, database entries) and **data in transit** (e.g., encrypted payloads, cookies, tokens).

**Real World Example-**

**The Incident:**  
LinkedIn, in 2012, stored user passwords using **unsalted SHA-1 hashing**, which was already considered weak at the time. After a breach, hackers dumped over **117 million hashed passwords**. Within days, the entire list was cracked using rainbow tables and dictionary attacks.

**What Went Wrong:**

* SHA-1 is a fast, collision-prone hash function not meant for password storage.

* Lack of **salting** meant identical passwords had identical hashes.

* No **key stretching** mechanisms like PBKDF2 or bcrypt were used, allowing mass cracking at scale.

**How the Vulnerability occurs-**

**Weak or Broken Algorithms**

* Use of **MD5**, **SHA-1**, or **DES**, which are outdated and broken by modern standards.  
* Symmetric encryption with **ECB mode**, which reveals patterns in data.

**Poor Key Management**

* Hardcoded or predictable encryption keys.  
* Keys stored alongside encrypted data.  
* Lack of rotation or lifecycle policies for keys.

**Improper Hashing Practices**

* Passwords hashed without **salts** or with static, reused salts.  
* Lack of **slow hashing algorithms** (bcrypt, scrypt, Argon2).  
* Confusing **encoding (e.g., Base64)** with encryption.

**Reversible “Encryption”**

* Storing sensitive data with weak, easily reversible ciphers (e.g., XOR or ROT13).  
* Relying on custom-built encryption routines instead of battle-tested libraries.

**Secure Coding Recommendations-**

  **Use Modern Encryption Standards:**

* AES-256 in **GCM mode** for symmetric encryption.

* RSA (2048+ bits) or ECC (256+ bits) for asymmetric use cases.

  **Secure Password Storage:**

* Always hash passwords using **bcrypt, Argon2, or PBKDF2**.

* Apply **per-user salts** and consider peppering at the app level.

  **Avoid Deprecated Algorithms:**

* Completely eliminate MD5, SHA-1, DES, RC4, and ECB mode.

* Use SHA-256 or higher only for integrity checks, not password hashing.

  **Manage Keys Properly:**

* Use **Hardware Security Modules (HSMs)** or secure vaults like AWS KMS, HashiCorp Vault.

* Never hardcode keys in the codebase or config files.

* Enforce **key rotation** and auditing.

  **Encrypt Sensitive Data at Rest:**

* Use file-level or field-level encryption.

* Implement envelope encryption strategies where needed.

  **Avoid Building Your Own Crypto:**

* Always rely on **well-established cryptographic libraries** (e.g., OpenSSL, libsodium, BouncyCastle).

* Understand the library’s API—don’t just copy-paste from Stack Overflow.

**Mitigation Steps (Developer Focused)-**

  Audit all existing encryption and hashing implementations for weak algorithms.

  Replace any use of MD5, SHA-1, or DES with modern, secure algorithms.

  Ensure that any stored passwords are re-hashed with slow hash algorithms like **Argon2** or **bcrypt**.

  Review key storage and handling to eliminate hardcoded keys or insecure storage mechanisms.

  Integrate encryption into CI/CD checks and security pipelines to catch weak practices early.

  Train developers on **modern cryptography best practices** and provide secure utility wrappers in your codebase.

