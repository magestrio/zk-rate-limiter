import { AccountUpdate, Mina, PrivateKey } from "o1js";
import { ZKRateLimiter } from "./zk-rate-limiter";

let doProofs = false;

(async () => {
  let Local = Mina.LocalBlockchain({ proofsEnabled: doProofs });
  Mina.setActiveInstance(Local);

  let feePayerKey = Local.testAccounts[0].privateKey;
  let feePayer = Local.testAccounts[0].publicKey;

  // the zkapp account
  let zkappKey = PrivateKey.random();
  let zkappAddress = zkappKey.toPublicKey();

  // Initialize offchain service

  const zkRateLimiter = new ZKRateLimiter(zkappAddress);

  if (doProofs) {
    await ZKRateLimiter.compile();
  }

  let tx = await Mina.transaction(feePayer, () => {
    AccountUpdate.fundNewAccount(feePayer);
    zkRateLimiter.deploy();
  });

  await tx.prove();
  await tx.sign([zkappKey, feePayerKey]).send();
})()