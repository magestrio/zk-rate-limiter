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
  UInt64,
  Provable
} from 'o1js';
import { RegisterEvent } from '../models/register-event.js';

export const MERKLE_HEIGHT = 8;

export class MemberMerkleWitness8 extends MerkleWitness(MERKLE_HEIGHT) {}

export class ActionMerkleWitness8 extends MerkleWitness(MERKLE_HEIGHT) {}

const TIME_DIFFERENCE = 5 * 1000;

let initialMembersCommitmen: Field;
let initialPerformedActionsCommitment: Field;

export class ZKRateLimiter extends SmartContract {
  @state(Field) membersCommitment = State<Field>();
  @state(Field) performedActionsCommitment = State<Field>();

  events = {
    register: RegisterEvent,
    leave: PublicKey,
  };

  @method init() {
    this.account.provedState.assertEquals(this.account.provedState.get());
    this.account.provedState.get().assertFalse();

    super.init();

    this.membersCommitment.set(initialMembersCommitmen);
    this.performedActionsCommitment.set(initialPerformedActionsCommitment);
  }

  @method register(member: PrivateKey, index: Field, witness: MemberMerkleWitness8) {
    this.membersCommitment.getAndAssertEquals();
    witness.calculateRoot(Field(0)).assertEquals(this.membersCommitment.get());

    witness.calculateIndex().assertEquals(index);

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

  @method checkActionAllowance(member: PrivateKey, index: Field, lastTimeUsage: Field, memberWitness: MemberMerkleWitness8, actionWitness: ActionMerkleWitness8) {
    this.membersCommitment.getAndAssertEquals();
    this.performedActionsCommitment.getAndAssertEquals();

    memberWitness.calculateRoot(Poseidon.hash(member.toFields())).assertEquals(this.membersCommitment.get());

    const actionTime = Provable.if(lastTimeUsage.equals(Field(0)), Field(0), Poseidon.hash(member.toFields().concat(lastTimeUsage)));

    actionWitness.calculateRoot(actionTime).assertEquals(this.performedActionsCommitment.get());

    actionWitness.calculateIndex().assertEquals(index);

    this.network.timestamp.getAndAssertEquals();

    this.network.timestamp.get().toFields()[0].sub(lastTimeUsage).assertGreaterThanOrEqual(Field(TIME_DIFFERENCE));

    const newRoot = actionWitness.calculateRoot(Poseidon.hash(member.toFields().concat(this.network.timestamp.get().toFields())));
    this.performedActionsCommitment.set(newRoot);

    // The last time usage will be dispatched to the action storage
  }

  @method leave(member: PrivateKey, witness: MemberMerkleWitness8) {
    this.membersCommitment.getAndAssertEquals();
    witness
      .calculateRoot(Poseidon.hash(member.toFields()))
      .assertEquals(this.membersCommitment.get());

    const newRoot = witness.calculateRoot(Field(0));
    this.membersCommitment.set(newRoot);

    this.emitEvent('leave', member.toPublicKey());
  }
}

export function initZKRateLimiter(memberRoot: Field, actionRoot: Field) {
  initialMembersCommitmen = memberRoot;
  initialPerformedActionsCommitment = actionRoot;
}

