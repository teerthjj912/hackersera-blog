**WSTG-BUSL-09**

Test Name----\> Test Upload of Malicious Files

Objectives---\> \- Identify the file upload functionality.

\- Review the project documentation to identify what file types are considered acceptable, and what types would be considered dangerous or malicious.

\- Determine how the uploaded files are processed.

\- Obtain or create a set of malicious files for testing.

\- Try to upload the malicious files to the application and determine whether it is accepted and processed.

**Overview-**

File upload features are like that one friend who’s great until they invite *the wrong crowd* to the party. Malicious files, if accepted, can turn a seemingly innocent upload portal into a launchpad for attacks ranging from **remote code execution to data exfiltration**.

This test focuses on whether the business logic around file uploads is tight enough to detect and reject harmful files, *not just by superficial checks*, but by understanding how the application processes those uploads — from the moment you click “Upload” to the moment that file is stored, parsed, or executed.

**Real World Example-**

**The Incident:**  
In 2019, a content management system allowed users to upload image files. However, the application didn’t properly inspect file content or processing flow. An attacker uploaded a PHP backdoor disguised as a .jpg. Upon processing, the system executed the backdoor, leading to a full system compromise.

**What Went Wrong:**

* Lack of thorough validation of file content beyond extension and MIME type.  
* Failure to consider how uploaded files were handled downstream (e.g., image resizing, thumbnail generation).  
* No business logic enforcement on file types and processing flow.

**How the Vulnerability occurs-**

**Insufficient Content Validation**

The system trusts extensions and MIME types without checking the actual file content, allowing executable code to masquerade as harmless files.

**Unmonitored File Processing**

Malicious files that slip through initial validation are later processed (e.g., by image libraries) that could trigger vulnerabilities in those processing libraries (buffer overflows, parsing bugs).

**Misconfigured Business Logic**

If the business logic assumes all uploaded files are safe, it may automatically move, parse, or execute files without further checks.

**Lack of Detection for Known Malicious Patterns**

No scanning or filtering of known malware signatures or payload structures.

**Secure Coding Recommendations-**

* **Define Clear Policies on Allowed File Types:**  
  Document and enforce which file types are acceptable, considering business needs. Clearly label others as potentially dangerous.

* **Implement Deep Content Validation:**  
  Use file signature checks, and verify file headers and internal structure beyond just extensions and MIME types.

* **Isolate and Sandbox File Processing:**  
  Process files in isolated environments (e.g., separate servers or containers) to prevent impact on core application if a malicious payload is triggered.

* **Incorporate Antivirus/Anti-Malware Scanning:**  
  Automatically scan uploaded files against known malware databases before acceptance.

* **Audit File Handling Workflows:**  
  Understand and control every step where uploaded files are moved, parsed, or executed — ensure business logic enforces safe handling.

**Mitigation Steps (Developer Focused)-**

  Establish **strict allowlists** and reject all other file types by default.

  Use libraries/tools to **inspect the internal structure of files** and detect embedded threats.

  Isolate file processing logic from the main application to minimize damage from potential malicious payloads.

  Implement **regular malware signature updates** for any scanning tools integrated into the upload process.

  Create logging and alerting for suspicious upload attempts, including repeated tries with different malicious payloads.

  Educate development teams on **secure file handling practices**, emphasizing risks beyond just extension checking.

