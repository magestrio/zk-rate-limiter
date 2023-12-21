import {
  Experimental,
  Field,
  PrivateKey,
  SelfProof,
  Provable,
  UInt64,
} from 'o1js';

import { modExp } from '../utils/field_operations.js';

let isComplied = false;

const numbersOfShares = 3;

const CoefficientsArray = Provable.Array(Field, numbersOfShares - 1);

const SharesArray = Provable.Array(Field, numbersOfShares);

export async function generateSharedSecret(
  secretKey: PrivateKey,
  coefficients: Field[] = [],
  degree: number
) {
  //   if (!isComplied) {
  //     SecretSharingGenerator.analyzeMethods();
  //     console.log('Compile SecretSharingGenerator...');
  //     await SecretSharingGenerator.compile();
  //     isComplied = true;
  //   }

  let coeffs = coefficients;

  if (coeffs.length === 0) {
    coeffs = randomCoefficients(degree);
  }
}

function randomCoefficients(degree: number): Field[] {
  const fields: Field[] = [];

  for (let i = 0; i < degree; i++) {
    fields.push(Field.random());
  }

  return fields;
}

export function generateShares(
    secret: PrivateKey,
    numbersOfShares: number,
    coefficients: Field[] = []
  ): { x: Field; y: Field }[] {
    let shares: { x: Field; y: Field }[] = [];

    let coeffs = coefficients.length === 0 ? randomCoefficients(numbersOfShares - 1) : coefficients;

    let secretField = secret.toFields()[0];
    
    for (let i = 1; i <= numbersOfShares; i++) {
      let xValue = Field(i);
      let shareValue: Field = secretField;
      
      for (let j = 0; j < coeffs.length; j++) {
        let exponent = modExp(Field(i), Field(j + 1));
        shareValue = shareValue.add(exponent.mul(coeffs[j]));
      }
  
      // Add the computed share to the array
      shares.push({ x: xValue, y: shareValue });
    }
  
    return shares;
  }

// const SecretSharingGenerator = Experimental.ZkProgram({
//   publicInput: Field,
//   publicOutput: SharesArray,

//   methods: {
//     generateShares: {
//       privateInputs: [PrivateKey, CoefficientsArray],

//       method(_: Field, secret: PrivateKey, coefficients: Field[]) {
//         const shares: Field[] = [];

//         for (let i = 1; i <= numbersOfShares; numbersOfShares) {
//           let shareValue = secret.toFields()[0];
//           for (let j = 0; j < coefficients.length; j++) {
//             const power = (Field(i).shareValue = shareValue.add());
//             shareValue += coeffs[j] * i ** (j + 1);
//           }
//         }

//         return shares;
//       },
//     },
//     // init: {
//     //   privateInputs: [Field, Field],

//     //   method(_: Field) {

//     //   },
//     // },
//     // step: {
//     //     privateInputs: [SelfProof, Field, Field],

//     //     method()
//     // }
//   },
// });
