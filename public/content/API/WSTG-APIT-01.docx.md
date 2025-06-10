**WSTG-APIT-01**

Test Name----\> Testing GraphQL

Objectives---\> \- Assess that a secure and production-ready configuration is deployed.

\- Validate all input fields against generic attacks.

\- Ensure that proper access controls are applied.

**Overview-**

GraphQL is like the all-you-can-eat buffet of APIs — clients can ask for *exactly* what they want, and the server hands it over in a clean, JSON-wrapped platter. But here’s the twist: that flexibility? It’s a **double-edged sword**. If improperly secured, GraphQL becomes a hacker’s dream — exposing too much, validating too little, and skipping access controls like it’s 2015\.

While REST APIs have predictable endpoints, GraphQL revolves around a single endpoint (usually /graphql) and allows dynamic query building. This puts a heavy burden on the backend to validate input types, enforce permissions per field, and lock down introspection in production. And attackers? They know how to probe it — hard.

**Real-World Example-**

**The Incident:**  
A major e-commerce startup exposed their GraphQL endpoint with introspection enabled and no query complexity limits. An attacker used the GraphQL playground to enumerate every type, mutation, and query. They discovered a mutation like:

mutation {  
  createAdmin(input: { email: "attacker@example.com", password: "pass123" }) {  
    id  
  }  
}  
Why was this exposed in production? Because they forgot to restrict dev-only mutations.

Then the attacker pulled off a query like:

{  
  users {  
    id  
    email  
    passwordHash  
    sessionToken  
  }  
}

**What Went Wrong:**

* Introspection left open in production  
* Missing access control at the resolver level  
* Sensitive fields (passwordHash, sessionToken) exposed  
* No depth or complexity limiting — queries could be nested infinitely

The breach gave the attacker admin access, user data, and session hijacking potential — all through a single endpoint.

**How the Vulnerability occurs-**

**1\. Unrestricted Introspection**

GraphQL supports schema introspection — great for developers, terrible for attackers in production. With it, they can:

* Discover all object types, fields, and mutations  
* Enumerate queries and relationships  
* Map out the API like a blueprint for attack

**2\. Missing Field-Level Authorization**

GraphQL resolvers are where access control should happen. But in many implementations, developers forget to check *who* is querying *what*. If an attacker can fetch private fields (e.g., salary, email, or roles), that’s a leak.

**3\. Deeply Nested Queries / DoS**

Since GraphQL allows query nesting, an attacker might write:

{  
  users {  
    friends {  
      friends {  
        friends {  
          ...and so on  
        }  
      }  
    }  
  }  
}

Without depth limiting or complexity scoring, this will **crash** servers or cause resource exhaustion.

**4\. Poor Input Validation / Injection**

Resolvers may pass inputs directly into backends (SQL, NoSQL, LDAP). If not validated:

* SQL injections  
* MongoDB injections  
* Command injections  
  ...are all fair game.

**5\. Misconfigured Mutations**

Mutations change state (e.g., create users, reset passwords). If these aren’t authenticated and rate-limited, attackers can abuse them to:

* Escalate privileges  
* Create backdoor users  
* Spam the system

**Secure Coding Recommendations-**

**Disable Introspection in Production**  
Use server-side config to block introspection in live environments:

introspection: process.env.NODE\_ENV \!== 'production'  
**Implement Depth and Complexity Limiting**  
Limit query depth and compute a "complexity score" per query. Libraries like graphql-depth-limit and graphql-query-complexity can help:

const depthLimit \= require('graphql-depth-limit')*;*  
**Apply Strict Field-Level Access Control**  
Don’t just secure queries — **secure fields within queries**. Use middleware to check roles and permissions per resolver:

if (*\!*user.isAdmin) throw new Error("Access denied")*;*

**Sanitize All Inputs**  
Validate and sanitize every input using a schema validation library like Joi, Yup, or built-in GraphQL scalars. Never trust the client — GraphQL’s type system helps, but it’s not foolproof.

**Rate-Limit GraphQL Requests**  
Use IP-based rate limiting and CAPTCHA challenges where necessary. Prevent brute-force attempts, mutation abuse, or mass enumeration.

**Block Access to Sensitive Fields**  
Never expose internal fields like passwordHash, internalNotes, or sessionToken — even if the query structure allows them. Instead:

* Set them to null in resolver logic  
* Or strip them from the schema entirely for unauthorized users

**Secure Mutations with Strong Auth \+ CSRF Protections**  
Authentication must be required for any state-changing mutation. Also ensure your mutation endpoints are not vulnerable to CSRF via cookie-based sessions.

**Use Strict CORS Headers**  
Disallow arbitrary origins from interacting with your GraphQL endpoint.

**Log and Monitor Usage Patterns**  
Track which queries are being executed. An unusual number of introspection queries, deeply nested queries, or sensitive field access attempts should raise red flags.

**Mitigation Steps (Developer Focused)-**

  **Step 1: Audit Schema for Exposure**  
Use introspection in a controlled dev environment to map out what sensitive data is exposed, what mutations exist, and what needs to be locked down.

  **Step 2: Enforce Auth at Resolver Level**  
Add authentication and role-based checks directly inside resolvers. Avoid relying on frontend logic to hide sensitive fields.

  **Step 3: Disable Introspection \+ Playground in Production**  
Never leave developer tools open in live systems. Disable both introspection and GraphQL Playground/GraphiQL.

  **Step 4: Implement Rate Limits and Complexity Scoring**  
Prevent query flooding, recursive nesting, or expensive joins. Tie limits to user roles — power users can get more room to query.

  **Step 5: Add Input Validation Middleware**  
Use strong validation libraries to whitelist allowed characters, lengths, patterns, and content types.

  **Step 6: Segment Schema by Role**  
Consider using separate schemas or query filters depending on user roles. A standard user shouldn’t see admin-level fields at all — even if they guess the structure.

  **Step 7: Regularly Pentest Your GraphQL Layer**  
Use tools like InQL, GraphQLmap, or Postman to test for:

* Over-fetching  
* Unauthorized mutations  
* Nested query abuse  
* Token/Session leakage

