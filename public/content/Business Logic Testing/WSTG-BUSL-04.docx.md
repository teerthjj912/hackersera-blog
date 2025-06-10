**WSTG-BUSL-04**

Test Name----\> Test for Process Timing

Objectives---\> \- Review the project documentation for system functionality that may be impacted by time.

\- Develop and execute misuse cases.

**Overview-**

In the world of business logic, **timing isn’t just everything—it’s a vulnerability vector**. This category of flaws stems from applications that fail to handle time-based logic securely or consistently. When developers overlook **race conditions, time-bound state changes, or scheduling logic**, attackers can take advantage of those gaps to manipulate workflows or gain unauthorized benefits.

Process timing vulnerabilities usually arise when **expected timing assumptions** are broken—like performing an action before a scheduled validation, exploiting delays in synchronization, or racing the backend to complete operations out of order.

**Real World Example-**

**The Incident:**  
A fintech app allowed users to transfer funds between wallets. The app displayed a "Transfer Successful" message immediately upon clicking "Send"—even before the backend had completed validating balances and transaction limits. An attacker rapidly initiated multiple concurrent transfers using automated scripts. Due to a processing lag, the system allowed **overdrawn transfers**, causing a financial discrepancy before the backend reconciled it.

**What Went Wrong:**

* There was no atomicity or locking to prevent race conditions.

* The application made timing assumptions that didn’t hold up under concurrent requests.

* Time-bound rules (e.g., daily limits) weren’t being enforced at the actual decision point.

**How the Vulnerability occurs-**

**Race Conditions and Parallel Requests**

* The application allows multiple simultaneous requests to interact with the same object or data record before locking or validation is applied.

**Inconsistent Time-Based Validation**

* Time-bound restrictions (e.g., once-per-day, expires-in-10-minutes) are applied only client-side or are enforced inconsistently across components.

**Scheduled Job Manipulation**

* Actions that are dependent on a delay or scheduled task (e.g., a refund that processes after 24 hours) can be manipulated by triggering related events in an incorrect sequence.

**Client-Driven Time Input**

* The system relies on user-provided timestamps (e.g., expiration dates, request times) rather than verifying with a server-controlled time source.

**Secure Coding Recommendations-**

·  **Use Server-Side Timestamps and Time Validation:**

* Never trust time values from the client. The server should define all time-related rules and record the actual times events occur.

  **Enforce Time-Based Conditions at the Point of Execution:**

* Always validate time constraints (e.g., “must wait X minutes”) at the **execution layer**, not just during UI input or submission.

  **Introduce Atomic Operations or Locks:**

* For any operation that can be raced (like financial transfers, inventory purchases), ensure operations are atomic or use database-level locks or semaphores.

  **Throttle Sensitive Requests:**

* Implement rate limiting or action throttling for operations that could be abused through rapid repeated attempts.

  **Audit and Monitor Timed Processes:**

* Track and log delays, failures, and inconsistencies in time-based logic, especially for scheduled or batch tasks.

**Mitigation Steps (Developer Focused)-**

  **Implement server-enforced timing controls** for all critical actions, including expiration, retries, and daily/hourly limits.

  **Use locking mechanisms or transactions** when dealing with shared resources or operations that must not be executed concurrently.

  **Apply race condition detection tools** in QA or staging environments to stress test workflows under high concurrency.

  **Validate scheduled operations** (e.g., cleanup jobs, delayed refunds) to ensure they're secure and can’t be manipulated through premature triggers.

  **Avoid trusting timestamps sent from the client**, and rely on synchronized server time (e.g., NTP-controlled clocks) for consistency.

