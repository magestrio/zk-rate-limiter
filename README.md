Rate Limiting Nullifiers provide an innovative solution to the issue of spam prevention in anonymous environments, particularly in contexts where users are not identified by conventional means. To understand the "Rate Limiting Nullifier", we first need to recap what a nullifier is in the realm of cryptography.

## Nullifiers in Cryptography:
A nullifier is primarily used in Zero-Knowledge Proofs (ZKPs) and is a value derived from a secret (e.g., a secret note or a private key) that signifies that an action has occurred, without revealing any other details about the action or the secret itself. In systems like ZCash, nullifiers are used to prevent double-spending: when a private transaction is made, a nullifier is published to indicate that a particular coin has been spent, without revealing which coin it was.

## Rate Limiting Nullifier - The Concept:
In the context of spam protection, we can use the concept of nullifiers to limit how often a user can perform a particular action without revealing the user's identity or the specifics of the action.

1. **Initialization**: Every user possesses a secret value (e.g., a private key).

2. **Action Commitment**: When a user wants to perform a specific action (e.g., send a message), they create a commitment using their secret and some other data related to the action (like a timestamp).

3. **Nullifier Generation**: From this commitment, a nullifier is derived. This nullifier acts as a one-time-use token for that particular action in the given time frame.

4. **Action Verification**: The system checks if a nullifier derived from that user's secret for the current time frame already exists. If it does, the action is rejected (rate limit enforced). Otherwise, the action is allowed, and the nullifier is stored.

5. **Anonymity**: The system only sees and stores nullifiers. It doesn't know which user corresponds to which nullifier unless the same user tries to perform the action again in the same time frame.

### Merkle Membership:
Merkle Trees provide a structure where membership of a specific item can be proven without revealing the entire set. In the context of rate limiting nullifiers, Merkle Trees can be used to validate whether a nullifier has been used within a given timeframe without exposing the entire list of nullifiers, thus preserving anonymity.

### Slashing Members:
Slashing is a mechanism used in many cryptographic systems to punish bad actors. If a user tries to abuse the rate-limiting system, for instance, by using the same nullifier multiple times in a short span, they can be "slashed" or penalized, possibly by losing some form of collateral or being temporarily banned.

### Shamir Secret Sharing:
Shamir's Secret Sharing is a cryptographic method that allows a secret to be divided into multiple parts, where a specific number of parts are needed to reconstruct the original secret. This can be integrated into the rate limiting system to distribute the user's secret into multiple parts, further ensuring security and flexibility in the system.

## Circuit Description for Rate Limiting Nullifier
The circuitry in the Rate Limiting Nullifier ensures the correct operations and security of the protocol. Here's an organized overview of its structure and functions:

### Registration:
This is the phase where users get registered into the system, allowing them to later signal without revealing their true identities.

- **Membership Proof**: This constraint ensures that a member is part of a recognized group or set. It can be validated using a Merkle proof to show membership without revealing the entire set.

- **Public Inputs for Registration**:

  - **membership_tree_root**: The root of the Merkle Tree that proves membership.
  
- **Private Inputs for Registration**:

  - **auth_path**: The authentication path in the Merkle Tree that proves the member's membership without revealing their exact position or other members.

### Signaling:
During this phase, users send signals to the system. The system checks these signals for validity without compromising user privacy.

- **Share Satisfaction**: The provided share must satisfy a specific linear equation. This is part of the Shamir Secret Sharing, ensuring the shared secret is correctly divided.

- **Correct Nullifier**: This constraint ensures that the nullifier generated from the user's action and secret hasn't been reused within the same timeframe.

- **Public Inputs for Signaling**:

  - **share_x**: The x-coordinate of the Shamir Secret Share.
  - **share_y**: The y-coordinate of the Shamir Secret Share.
  - **epoch**: A time frame or period indicating when the action was performed.
  - **nullifier**: The one-time-use token derived from the user's secret for the action in the current epoch.

### Secret Recovery / Slashing:
In cases where members of the system act maliciously or break protocol rules, mechanisms are in place for secret recovery and potential punitive actions.

- **Private Inputs for Slashing**:
  - **a_0**: A secret value or coefficient used in the linear equation for Shamir Secret Sharing.

## Advantages:

- **Anonymity**: The true identity or action of the user isn't revealed to the system.

- **Prevents Spam**: It rate-limits actions without compromising user privacy.

- **No User Accounts**: Traditional account-based rate limiting can be bypassed by creating multiple accounts, but with rate-limiting nullifiers, creating a new identity would mean obtaining a new, valid secret, which can be made computationally or logistically challenging.

## Challenges:

- **Storage**: The system needs to store nullifiers. However, this can be managed with techniques like rolling windows, where old nullifiers are deleted after a certain time.

- **Time Synchronization**: The scheme relies on some notion of "time frames" which means nodes or participants in the system need synchronized clocks or a consistent notion of passing time.

- **Computational Overhead**: Generating and verifying nullifiers might add computational overhead, depending on the cryptographic primitives used.

## Use Cases:

- **Anonymous Messaging Platforms**: Preventing spam in platforms where users are not required to sign up with identifiable information.

- **Voting Systems**: Ensuring one vote per user in anonymous voting systems.

- **Feedback Systems**: Allowing users to provide feedback anonymously but prevent spamming or ballot-stuffing.


In conclusion, Rate Limiting Nullifiers offer a unique approach to manage spam in systems where user anonymity is paramount.

## Resources:
- [Specification](https://hackmd.io/tMTLMYmTR5eynw2lwK9n1w?both)
- [(Workshop) Rate Limiting Nullifier](https://www.youtube.com/watch?v=OGhf991iTPc&ab_channel=0xPARCFoundation)
- [Rate Limiting Nullifier by AtHeartEngineer](https://www.youtube.com/watch?v=vrNiPBfbLw0&ab_channel=EthereumFoundation)

## Milestones
**Phase 1: Project Setup (done)**

1. Identify the Issue: Define the problem statement and specific objectives. **(done)**
2. Learning Material: Acquire and document knowledge of required technologies and protocols. **(done)**
3. Write Project Description: Outline the project's scope, functionality, and intended use. **(done)**

**Phase 2: Initial Development**

4. Add Registration with Merkle Witness: Design and document the registration process incorporating Merkle trees.**(done)**
5. Create Circuit for Shamir Secret Sharing Generation: Develop a working prototype for generating secrets with a linear equation, targeting one action per epoch. (**WIP**) 

**Phase 3: Integration and Enhancement (WIP)**

6. Integrate Circuit with SmartContract: Combine the cryptographic circuit with blockchain smart contracts in a test environment.
7. Extend SSS Circuit for Multiple Actions per Epoch: Research scalability solutions and enhance the circuit to support more actions.

**Phase 4: Economic Model and Security**

8. Implement Staking Mechanism during Registration: Code the logic for users to stake cryptocurrency as part of the registration.
9. Develop Withdrawing Mechanism: Create a secure process for users to withdraw their funds.
10. Design Slashing System: Establish a system to penalize dishonest or faulty participants.

**Phase 5: Testing and Optimization**

11. Testing Work Correctness: Execute detailed unit and component tests to ensure system correctness.
12. Testing with Blockchain: Perform comprehensive integration tests with the blockchain.
13. Performance Optimization: After testing, identify performance bottlenecks and optimize the system.

**Phase 6: Data Management and Deployment**

14. Integrate with zkDB or another existed solution for Data Storing
15. Deploy to npm Repository: Finalize the package for deployment, ensuring it has proper versioning and documentation.

**Phase 7: Quality Assurance and Documentation**

16. Code Review and Refactoring: Prior to smart contract integration, review and improve the codebase for maintainability.
17. Security Audits: After initial testing, conduct security audits on smart contracts and cryptographic components.
18. Documentation and Developer Guides: Throughout the testing phase, compile detailed documentation and guides for developers.

**Phase 8: Post-Deployment**

19. User Acceptance Testing: After security audits, validate the system with end-users to ensure it meets user requirements.
20. Monitoring and Analytics Integration: Post-deployment, integrate monitoring tools to track system performance and usage.
21. Community Engagement and Feedback Loop: Create forums and channels for user feedback to inform future project updates.
Each phase should conclude with a review and retrospective to ensure that the project is on track and to integrate any learnings into future phases. This structured approach allows you to manage the project efficiently and adapt as necessary.

## License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
