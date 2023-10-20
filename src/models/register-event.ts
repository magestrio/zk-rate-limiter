import { Field, PublicKey, Struct } from "o1js";

export class RegisterEvent extends Struct({
  userPk: PublicKey,
  position: Field
}) {}