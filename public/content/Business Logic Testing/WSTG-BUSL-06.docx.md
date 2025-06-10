**WSTG-BUSL-06**

Test Name----\> Testing for the Circumvention of Work Flows

Objectives---\> \- Review the project documentation for methods to skip or go through steps in the application process in a different order from the intended business logic flow.

\- Develop a misuse case and try to circumvent every logic flow identified.

**Overview-**

Applications are built on business rules that expect users to follow a specific sequence—step-by-step processes like checkout, onboarding, password reset, or KYC verification. If those sequences can be **skipped, manipulated, or reordered**, attackers can gain unfair advantages, access restricted features, or abuse critical functionality.

This test is about **hitting fast-forward on processes where you’re not supposed to**. It's not about exploiting a single bug—it's about breaking the logic that glues the business together.

**Real World Example-**

**The Incident:**  
An e-commerce platform offered store credits **only after** a successful product review **post-purchase**. A user discovered that the review submission page could be accessed directly via URL without completing a purchase. The system didn’t verify the order status server-side, and the user spammed fake reviews and earned thousands in credits.

**What Went Wrong:**

* The workflow was **trusting the UI** to enforce purchase-before-review logic.

* No server-side check was in place to validate the user’s order history before allowing the reward.

* Workflow state transitions were not being tracked reliably.

**How the Vulnerability occurs-**

**Missing Workflow State Tracking**

Applications often don’t persist workflow stages on the backend, making it possible to jump to any phase via direct URL or API call.

**Improper Assumptions of Frontend Navigation**

Frontend controls like "Next" and "Submit" buttons might enforce order, but **attackers bypass the UI** entirely.

**Decoupled or Stateless Process Logic**

APIs and endpoints don’t check if previous steps were completed, allowing users to access later stages freely.

**Skipping Optional but Critical Steps**

Steps like agreement to terms, KYC verification, or two-factor authentication might be skippable due to poor validation checks.

**Reusing Tokens or Identifiers**

Session tokens or action tokens used in the workflow may not expire or may be predictable, allowing replay or reuse.

**Secure Coding Recommendations-**

1. **Implement Workflow State Machines:**  
   Track user progress through workflows using **finite-state machines** or backend state flags, ensuring no action is accessible before completing the required steps.

2. **Tie Actions to Prior State Validation:**  
   Every action should validate **prerequisite conditions** before executing. E.g., prevent checkout unless shipping info and payment method are already completed.

3. **Avoid Relying on Client-Side Controls:**  
   Frontend elements like disabled buttons or hidden pages **should never** be trusted to enforce flow logic.

4. **Enforce Strong Access Controls for Each Step:**  
   Backend endpoints should validate if a user is authorized to be in that specific phase of the process.

5. **Invalidate Tokens After Use:**  
   Ensure that workflow-related tokens (email verification, password reset, transaction approval) are **single-use and time-bound.**

**Mitigation Steps (Developer Focused)-**

* Store and track each user’s **current progress in workflows** using database fields or session states.

* At every step, validate that **all prior stages were completed successfully** before proceeding.

* Use **anti-forgery tokens** and **expiring session data** to protect against replay and unauthorized state manipulation.

* Build **unit and integration tests** that mimic misuse cases to test state transitions and enforce proper order.

* Engage business analysts and QA testers to **map misuse cases** and invalid sequences that deviate from intended flows.

