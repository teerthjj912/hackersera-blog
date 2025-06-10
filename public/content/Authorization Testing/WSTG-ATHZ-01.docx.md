**WSTG-ATHZ-01**

Test Name----\> Testing Directory Traversal File Include

Objectives----\> \- Identify injection points that pertain to path traversal.

\- Assess bypassing techniques and identify the extent of path traversal.

**Overview-**

**Directory Traversal** (a.k.a. *Path Traversal*) vulnerabilities allow an attacker to access **restricted directories or files outside the intended file structure**—think of it as sneaking out the fire escape and ending up in the admin’s office.

Attackers exploit improperly sanitized file paths to move beyond the application's root directory, accessing sensitive files like /etc/passwd, web.config, or even .env files containing credentials.

**Technologies commonly affected:**

* File download/upload features

* Log or image viewers

* Dynamic file inclusion in PHP, Java, Node.js, etc.

* Misconfigured web servers

**Real World Example-**

**Incident:** A popular CMS plugin allowed users to view log files through a browser by specifying the filename in a GET parameter. It didn’t sanitize input properly. Attackers used ../../../ to access /etc/passwd, stealing system-level details.

**What went wrong:**

* No input validation on the file path

* Lack of restrictions on file access

* Web server gave the attacker exactly what they asked for—because no one told it not to

**How the Vulnerability occurs-**

It typically appears when developers allow user-controlled input to decide which file to include or read—without filtering out characters like ../.

**Example vulnerable code (Node.js):**

const file \= req.query.file*;*  
fs.readFile('/var/www/data/' \+ file, (err, data) \=\> {  
  res.send(data);  
})*;*  
Malicious Request:

GET /view*?*file\=../../../etc/passwd  
If no validation exists, this will serve the contents of /etc/passwd—which definitely wasn’t on the guest menu.

Attackers may also use:

* Double URL encoding (..%252f..%252f)

* Null byte poisoning (%00)

* Encoded characters (..%2F or Unicode variants)

**Secure Coding Recommendations-**

**Sanitize and Validate Inputs**

* **Whitelist** filenames or use a map of allowed files  
* Disallow any use of ../, %2e%2e, \\, or null bytes  
* Always treat input as untrusted—even if it's behind auth

**Restrict File Access**

* Lock access to a specific directory using chroot jails or containerized environments  
* Deny symbolic links or absolute paths unless explicitly necessary  
* Never allow users to access system-level directories

**Use Secure APIs**

* In PHP, avoid include() or require() with user input  
* In Node.js or Python, resolve file paths to ensure they remain within allowed directories:

from os.path import realpath, commonprefix

BASE\_DIR \= "/safe/files"  
requested \= realpath(BASE\_DIR \+ "/" \+ user\_input)

if not commonprefix(\[requested, BASE\_DIR\]) \== BASE\_DIR:  
    raise *Exception*("Directory traversal attempt blocked.")

**Mitigation Steps (Developer Focused)-**

**Concrete Steps to Prevent Traversal**

* Use built-in path sanitization functions (path.resolve(), realpath())  
* Normalize paths before access and reject any that break containment  
* Set strict permissions on file directories—your app should **only access what it must**

**Testing & Logging**

* Create automated checks for ../ and encoded variations  
* Log any access attempts to invalid or unexpected paths  
* Use DAST tools or static code analyzers (like SonarQube or Semgrep) to catch path-based flaws

**Server-Side Hardening**

* Deploy applications inside containers with minimal privileges  
* Disable directory listing on servers  
* Avoid giving web processes unnecessary read access to system folders

