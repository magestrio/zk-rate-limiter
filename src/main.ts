import { AccountUpdate, Mina, Poseidon, MerkleTree, PrivateKey, Field } from "o1js";
import { MemberMerkleWitness8, ActionMerkleWitness8, ZKRateLimiter, initZKRateLimiter } from "./app/zk-rate-limiter.js";

let doProofs = false;

const DEFAULT_HEIGHT = 8;

(async () => {
  let Local = Mina.LocalBlockchain({ proofsEnabled: doProofs });
  Mina.setActiveInstance(Local);

  let feePayerKey = Local.testAccounts[0].privateKey;
  let feePayer = Local.testAccounts[0].publicKey;

  const accounts = Local.testAccounts;

  // the zkapp account
  let zkappKey = PrivateKey.random();
  let zkappAddress = zkappKey.toPublicKey();

  // Initialize offchain service

  const zkRateLimiter = new ZKRateLimiter(zkappAddress);

  const memberMerkeTree = new MerkleTree(DEFAULT_HEIGHT);
  const actionMerkeTree = new MerkleTree(DEFAULT_HEIGHT);

  initZKRateLimiter(memberMerkeTree.getRoot(), actionMerkeTree.getRoot());

  if (doProofs) {
    await ZKRateLimiter.compile();
  }

  console.log('Deploying...');

  let tx = await Mina.transaction(feePayer, () => {
    AccountUpdate.fundNewAccount(feePayer);
    zkRateLimiter.deploy();
  });

  await tx.prove();
  await tx.sign([zkappKey, feePayerKey]).send();

  // register some users
  for (let i = 1; i < 5; i++) {
    console.log(`Register new user ${i}`);
    const index = BigInt(i);
    const accountKey = accounts[i].privateKey;
    memberMerkeTree.setLeaf(index, Poseidon.hash(accountKey.toFields()));
    const witness = new MemberMerkleWitness8(memberMerkeTree.getWitness(index));

    tx = await Mina.transaction(accounts[i].publicKey, () => {
      zkRateLimiter.register(accountKey, Field(index), witness);
    });

    await tx.prove();
    await tx.sign([zkappKey, accountKey]).send();
  }

  // Emulate action
  console.log('User action...');
  const actionWitness = new ActionMerkleWitness8(actionMerkeTree.getWitness(BigInt(1)));
  const memberWitness = new MemberMerkleWitness8(memberMerkeTree.getWitness(BigInt(1)));

  tx = await Mina.transaction(accounts[1].publicKey, () => {
    zkRateLimiter.checkActionAllowance(accounts[1].privateKey, Field(1), Field(0), memberWitness, actionWitness);
  });

  await tx.prove();
  await tx.sign([zkappKey, accounts[1].privateKey]).send();

})()