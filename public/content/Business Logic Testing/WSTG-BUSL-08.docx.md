**WSTG-BUSL-08**

Test Name----\> Test Upload of Unexpected File Types

Objectives---\> \- Review the project documentation for file types that are rejected by the system.

\- Verify that the unwelcomed file types are rejected and handled safely.

\- Verify that file batch uploads are secure and do not allow any bypass against the set security measures.

**Overview-**

File uploads are one of the most common and **most abused** functionalities in any web application. The problem? Users never follow instructions, and attackers treat every upload input like a door left slightly ajar—with just enough room to sneak in a payload dressed as a resume or a cat picture.

This test checks whether your application can **recognize, reject, and properly handle file types that shouldn’t be allowed**, whether individually or in bulk uploads. It also evaluates how thoroughly the file validation logic defends against bypass tricks like **obfuscation, magic byte tampering, and multi-extension filenames**.

**Real World Example-**

**The Incident:**  
In 2021, an educational platform accepted .pdf and .docx files for assignment submissions. An attacker renamed a PHP shell as assignment.pdf.php, uploaded it, and accessed it via the public file storage URL. The web server executed the script, giving the attacker remote access to the server.

**What Went Wrong:**

* No validation of actual content type (MIME sniffing was skipped).

* Weak or missing file extension checks.

* Public file directory allowed code execution from uploaded files.

**How the Vulnerability occurs-**

**Extension Obfuscation**

Attackers upload image.jpg.php or file.docx.exe hoping the system only checks the first extension or trusts the user-provided file name.

**MIME-Type Spoofing**

Clients can lie. Just because the browser claims it’s a “text/plain” doesn’t mean it is. Attackers use tools like curl or intercept proxy tools to **spoof MIME headers**.

**Magic Byte Mismatch**

Even if extensions and MIME types are checked, attackers modify file headers to mimic legitimate formats—so a .php file might start with %PDF-1.5.

**Batch Upload Blindness**

Some systems validate individual uploads but **fail to validate all files** in a zipped archive, allowing unexpected or malicious files to sneak in.

**Executable Upload in Web-Accessible Paths**

If uploaded files land in a web-accessible directory and aren't stripped of executable permissions or renamed safely, they become ticking time bombs.

**Secure Coding Recommendations-**

1. **Use a Whitelist Approach for File Types:**  
   Only allow file extensions and MIME types explicitly required by business logic. Reject everything else.

2. **Validate Content Type Server-Side:**  
   Do not trust browser MIME types—**verify the actual file content (magic numbers)** on the server before processing.

3. **Strip/Normalize Filenames:**  
   Rename uploaded files on the server to remove dangerous extensions or characters. Prefer **UUIDs or hashed names**.

4. **Store Files Outside Web Root:**  
   Prevent direct access to uploaded files by storing them outside publicly accessible directories. Serve them through controlled APIs if needed.

5. **Scan Files Before Accepting:**  
   Integrate with antivirus/malware detection tools to scan files—especially in environments like HR, customer support, or education platforms.

6. **Thoroughly Validate Batch Uploads:**  
   If users upload archives (like .zip), **extract and validate each file individually**. Reject the archive if any content is not allowed.

**Mitigation Steps (Developer Focused)-**

  Enforce both **client-side and server-side validation** of file extensions and MIME types.

  Reject files with **multiple extensions**, uncommon characters, or suspicious naming patterns.

  Limit the **maximum file size** and type to prevent resource exhaustion or parser attacks.

  Use a **dedicated file server or CDN** that does not execute files, only serves them as downloads.

  If uploads are critical to business logic, implement a **review/approval flow** for sensitive use cases (e.g., media uploads, plugins).

  Implement **logging and alerting** for all upload attempts—especially rejections and repeat offenders.

