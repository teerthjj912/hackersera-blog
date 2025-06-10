**WSTG-CLNT-10**

Test Name----\> Testing WebSockets

Objectives---\> \- Identify the usage of WebSockets.

\- Assess its implementation by using the same tests on normal HTTP channels.

**Overview-**

**WebSockets** provide full-duplex communication channels over a single TCP connection — meaning the server and client can send messages to each other independently at any time. They’re a cornerstone of modern, real-time web applications: chats, games, live dashboards, stock tickers, collaborative editing tools — all powered under the hood by WebSocket connections.

But with great power comes… you guessed it — a gaping security risk *if* not properly handled.

Unlike traditional HTTP, WebSockets don’t come with built-in protections like same-origin policy, CSRF tokens, or standard HTTP headers — making them a juicy target for attackers.

Testing WebSocket security is about going beyond the handshake and peering into how messages are exchanged, authenticated, and validated throughout the session.

**Real-World Example-**

**The Incident:**  
In 2018, a vulnerability was discovered in a trading platform’s WebSocket implementation. Attackers could send custom WebSocket messages to modify bid prices and execute unauthorized trades by bypassing client-side logic. Why? Because the server trusted client-side JavaScript to send “clean” requests and never validated message content.

**What Went Wrong:**

* WebSocket messages weren’t authenticated after the handshake.

* Message content wasn't validated server-side.

* The assumption was: “If it comes over the socket, it must be safe.” Spoiler: it wasn't.

**How the Vulnerability occurs-**

WebSocket vulnerabilities can crop up due to multiple missteps in implementation:

* **Lack of Authentication or Authorization** after the initial handshake  
  WebSocket handshakes are done over HTTP, but once the connection is established, many developers assume that the session stays secure — even if tokens expire or users log out. If the server doesn’t re-verify identity, unauthorized users can continue sending messages.  
* **Missing Input Validation**  
  WebSockets are just pipes. If the server blindly processes incoming JSON or binary data without sanitizing it, attackers can trigger SQL injection, command injection, or logic abuse.  
* **Cross-Site WebSocket Hijacking**  
  WebSocket connections initiated from a malicious origin may still go through unless server-side origin checks or token-based authentication are enforced.  
* **Improper Use of Secure Headers**  
  WebSockets ignore most traditional HTTP security headers like X-Frame-Options or Content-Security-Policy. Developers must implement equivalent protections manually.  
* **Lack of TLS Encryption**  
  Using unencrypted ws:// connections rather than wss:// exposes WebSocket data to interception or tampering.

**Secure Coding Recommendations-**

**Use wss:// (Secure WebSockets) Always**  
Never expose sensitive operations over unencrypted WebSocket channels. Use TLS to secure the connection, just like HTTPS.

**Authenticate Every Message, Not Just the Handshake**  
Don’t rely on a one-time token exchange. Validate that each message comes from an authenticated, authorized source — either through session IDs, API keys, or embedded tokens.

**Implement Role-Based Access Control (RBAC)**  
A WebSocket user might be connected, but can they *do* what they’re trying to do? Always check user privileges for each action or message type.

**Validate Message Payloads on the Server**  
Always parse, validate, and sanitize incoming WebSocket data server-side. Assume nothing about message structure or content.

**Implement CORS-Like Origin Checks**  
Check the Origin header during the handshake and reject unknown or untrusted origins. This protects against Cross-Site WebSocket Hijacking.

**Rate Limiting and Throttling**  
WebSockets are persistent — which makes them ripe for abuse. Apply usage limits to avoid denial-of-service through message floods.

**Session Timeout and Re-authentication**  
Treat WebSocket sessions like any secure session — time them out after inactivity, and revalidate when needed.

**Log and Monitor WebSocket Activity**  
Don’t treat WebSockets like a black box. Log actions, detect anomalies, and flag patterns of misuse.

**Mitigation Steps (Developer Focused)-**

  **Verify WebSocket Connections at the Server Level**  
Check Origin and Sec-WebSocket-Key headers during the handshake. Reject unknown origins or malformed requests.

  **Secure Deployment Configuration**  
Ensure proxies (like NGINX) or load balancers are configured to support and inspect wss:// traffic. Strip insecure headers before forwarding to the app server.

  **Strict Message Parsing and Schema Validation**  
Use JSON schema validators or custom middleware to enforce structure on incoming messages before acting on them.

  **Limit Message Size and Frequency**  
Prevent memory exhaustion or flooding by rejecting oversized messages and setting a max frequency per connection.

  **Ensure CSRF Protection Where Applicable**  
While CSRF doesn’t apply in the same way as HTTP, use session tokens or JWTs to protect WebSocket actions tied to user accounts.

  **Test with WebSocket Fuzzers and Tools**  
Use tools like Burp Suite's WebSocket tab, Wsdump, WebSocket King, and ZAP to craft, fuzz, and manipulate WebSocket messages during testing.

* 