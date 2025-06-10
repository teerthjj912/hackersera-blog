**WSTG-BUSL-03**

Test Name----\> Test Integrity Checks

Objectives---\> \- Review the project documentation for components of the system that move, store, or handle data.

\- Determine what type of data is logically acceptable by the component and what types the system should guard against.

\- Determine who should be allowed to modify or read that data in each component.

\- Attempt to insert, update, or delete data values used by each component that should not be allowed per the business logic workflow.

**Overview-**

Data is the lifeblood of every application—but without proper integrity checks, it's like leaving a bank vault wide open with a note saying, "Please don’t touch."

This vulnerability occurs when an attacker can **manipulate or corrupt data** that should be immutable, restricted, or bound to specific conditions. It's not just about SQL injection or missing authentication—this is about failing to **enforce the rules of the system's universe**.

An integrity failure lets someone alter data in a way that makes no logical or authorized sense within the application’s workflow. Whether it's tampering with transaction statuses, updating someone else’s balance, or deleting audit logs—the problem is the **lack of trust boundaries** and **missing checks** on sensitive operations.

**Real World Example-**

**The Incident:**  
An online food delivery app allowed users to cancel their orders and receive automatic refunds. One attacker noticed that the cancellation request only needed a valid order\_id. They intercepted the request and modified the order\_id to someone else’s completed order—bam, refund granted. No ownership checks. No verification. Just free money.

**What Went Wrong:**

* No integrity validation on who owns the order\_id.  
* Business rules (e.g., “only pending orders can be cancelled”) were either **nonexistent** or only checked client-side.  
* The backend didn’t cross-verify the user’s identity or the order status before processing the refund.

**How the Vulnerability occurs-**

**Missing Ownership Validation**

* The application allows actions like updates or deletions on data entities without confirming if the user owns or is authorized to modify them.

**Broken State Transitions**

* A user can force a transition from one data state to another without following business rules (e.g., marking an order as “shipped” without being an admin or logistics agent).

**Trusting External Input for Critical Data**

* Accepting parameters like user\_id, role, account\_type, or transaction\_status without server-side validation.

**Logical Data Inconsistencies**

* Creating entries with mismatched relationships (e.g., assigning a shipment to a non-existent user).  
* Deleting records that should be preserved for audit or legal reasons.

**Secure Coding Recommendations-**

  **Implement Ownership and Role-Based Checks:**

* Always verify that the user has the authority to perform an action on the targeted data.

  **Validate Logical State Transitions:**

* Ensure that changes to the state of an object (e.g., status, permissions) follow defined, irreversible flows.

* Use finite state machines (FSMs) to control object lifecycle transitions.

  **Use Server-Side Enforcement for Data Rules:**

* Never rely on the client or hidden fields to determine what’s valid.

* All critical data logic should reside and be enforced on the server.

  **Apply Fine-Grained Access Control:**

* Implement layered access control not just at the UI level but deep within the service layer.

* Limit privileges based on user roles and context (e.g., time, state, relationships).

  **Keep an Audit Trail:**

* Log every change to sensitive or business-critical data, including who made the change and when.

**Mitigation Steps (Developer Focused)-**

* **Define strict ownership models** in the backend—every entity should have a clear owner or permission boundary.

* **Enforce state validation on the server**, making sure data transitions (e.g., from pending to approved) can’t be forged or manipulated.

* **Restrict access to high-impact operations**, ensuring only authorized roles can insert, update, or delete key records.

* **Normalize and sanitize all incoming data**, and check it against the expected schema, state, and business logic.

* **Introduce consistency checks across systems**—verify that related data (e.g., invoices and orders) stay in sync and aren’t manipulated independently.

* **Log every critical transaction or update**, and alert on suspicious patterns (e.g., frequent status changes from a single account).

