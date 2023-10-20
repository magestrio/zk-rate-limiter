import {
  Field,
  SmartContract,
  State,
  state,
  method,
  PrivateKey,
  MerkleWitness,
  Poseidon,
  PublicKey,
  Bool,
} from 'o1js';
import { RegisterEvent } from './models/register-event';

export const MERKLE_HEIGHT = 8;

export class MyMerkleWitness8 extends MerkleWitness(MERKLE_HEIGHT) {}

export class ActionMerkleWitness8 extends MerkleWitness(MERKLE_HEIGHT) {}

export class ZKRateLimiter extends SmartContract {
  @state(Field) membersCommitment = State<Field>();
  @state(Field) performedActionsCommitment = State<Field>();

  event = {
    register: RegisterEvent,
    leave: PublicKey,
  };

  @method register(member: PrivateKey, witness: MyMerkleWitness8) {
    this.membersCommitment.getAndAssertEquals();
    witness.calculateRoot(Field(0)).assertEquals(this.membersCommitment.get());

    // TODO: Implement incremental merkle tree
    const newRoot = witness.calculateRoot(Poseidon.hash(member.toFields()));
    this.membersCommitment.set(newRoot);

    this.emitEvent(
      'register',
      new RegisterEvent({
        userPk: member.toPublicKey(),
        position: witness.calculateIndex(),
      })
    );
  }

  @method isActionAllowed(member: PrivateKey, witness: ActionMerkleWitness8): Bool {
    this.membersCommitment.getAndAssertEquals();
    witness.calculateRoot(Poseidon.hash(member.toFields())).assertEquals(this.membersCommitment.get())
    return Bool(true);
  }

  @method leave(member: PrivateKey, witness: MyMerkleWitness8) {
    this.membersCommitment.getAndAssertEquals();
    witness
      .calculateRoot(Poseidon.hash(member.toFields()))
      .assertEquals(this.membersCommitment.get());

    const newRoot = witness.calculateRoot(Field(0));
    this.membersCommitment.set(newRoot);

    this.emitEvent('leave', member.toPublicKey());
  }
}
