**WSTG-CLNT-09**

Test Name----\> Testing for Clickjacking

Objectives---\> \- Understand security measures in place.

\- Assess how strict the security measures are and if they are bypassable.

**Overview-**

**Clickjacking** (aka "UI Redressing") is a deceptive attack technique where a legitimate webpage or element (like a button or form) is invisibly embedded in a malicious page via an \<iframe\>. The victim thinks they're clicking something innocent — like “Play” or “Get Free Stuff” — but behind the scenes, they're triggering unintended actions: liking a page, transferring funds, changing settings, or worse.

The real evil here is in the illusion. Clickjacking manipulates the visual rendering of a page while keeping its actual behavior hidden, making users the weapon against their own accounts. The vulnerability doesn’t exploit a flaw in the application logic — it exploits the **absence of protective headers and frame-breaking scripts**.

**Real-World Example-**

**The Incident:**  
Back in 2009, a proof-of-concept clickjacking attack allowed malicious sites to trick users into enabling their webcam and microphone in Adobe Flash — all through transparent layers and deceptive overlays. Later, Facebook was famously targeted by clickjacking campaigns that tricked users into liking spam pages with invisible “Like” buttons.

**What Went Wrong:**

* These sites didn't implement the X-Frame-Options or Content-Security-Policy: frame-ancestors headers.

* Attackers created malicious sites that loaded the vulnerable pages inside invisible iframes.

* Clever CSS positioning made invisible buttons overlay decoy buttons.

* Users were tricked into clicking elements they couldn't see or understand.

* No client-side JavaScript was in place to detect or stop framing.

**How the Vulnerability occurs-**

Clickjacking happens when:

1. A vulnerable page doesn’t set proper **anti-framing headers** (like X-Frame-Options or Content-Security-Policy: frame-ancestors).  
2. An attacker creates a site that uses an \<iframe\> to load the target site and overlays it with transparent content.  
3. Victims interact with the malicious site, thinking they’re clicking on safe UI — but actually trigger actions inside the framed legitimate site.

Common targets for clickjacking include:

* **"Log Out" or "Delete Account"** buttons  
* **Purchase, Transfer, or Donate** functions  
* **Like, Share, Subscribe** buttons  
* **Settings toggles** that enable/disable features or permissions

**Bypass Variants:**

* **Multiple frame nesting** to evade naive frame-busting scripts.  
* **Frame reloading with delay** to avoid detection.  
* **Using JavaScript-less attacks** that bypass certain client-side mitigations.

**Secure Coding Recommendations-**

**Set Defensive HTTP Headers:**

* X-Frame-Options: DENY – Blocks all framing.

* X-Frame-Options: SAMEORIGIN – Allows only same-origin framing.

* Content-Security-Policy: frame-ancestors 'none' – More flexible and modern option. Prefer this over X-Frame-Options.

**Apply Defense in Depth with JavaScript:**  
If you need to allow framing in very limited scenarios, consider using JavaScript to detect framing:

if (top \!=\= *self*) {  
    window.top.location \= *self*.location;  
}  
**Visual Clues for Sensitive Actions:**  
Use CAPTCHAs, double-confirmation dialogs, or mouse gestures for critical actions — especially those involving money or account settings.

**Avoid Critical Actions via GET Requests:**  
Clickjacking loves GET — it doesn’t trigger browser warnings or need form submissions. Protect critical operations with POST requests and CSRF tokens.

**Audit Third-Party Widgets:**  
Many third-party plugins or widgets (especially payment gateways, chatbots, or analytics) may relax X-Frame-Options or introduce iframe dependencies. Ensure they follow the same security posture.

**Mitigation Steps (Developer Focused)-**

* **Enforce CSP Headers:**  
  Add Content-Security-Policy: frame-ancestors 'none'; to prevent all framing. This header is recognized by all modern browsers and is considered superior to X-Frame-Options.

* **Retire X-Frame-Options (Eventually):**  
  Use X-Frame-Options only for backward compatibility with legacy browsers. It's deprecated but still widely supported.

* **Framebusting with JavaScript:**  
  Include anti-framing scripts where header controls aren’t feasible (e.g., HTML emails, third-party environments).

* **Segregate High-Risk Actions:**  
  Place sensitive operations (e.g., fund transfers) on separate domains or subdomains, and restrict framing there completely.

* **Regularly Test with Tools:**  
  Use tools like **Burp Suite**, **OWASP ZAP**, or **Clickjacking Test Pages** to assess how your site behaves inside iframes. Automate these checks in CI/CD if possible.

