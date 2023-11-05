import { Experimental, Field } from "o1js";

type Share = { x: bigint, y: bigint };

function lagrangeInterpolation(shares: Share[], prime: bigint): bigint {
    let secret = BigInt(0);

    for (let i = 0; i < shares.length; i++) {
        let numerator = BigInt(1);
        let denominator = BigInt(1);

        for (let j = 0; j < shares.length; j++) {
            if (i !== j) {
                numerator = (numerator * (-shares[j].x)) % prime;
                denominator = (denominator * (shares[i].x - shares[j].x)) % prime;
            }
        }

        let lagrangePoly = numerator * modInverse(denominator, prime);

        secret = (prime + secret + (shares[i].y * lagrangePoly)) % prime;
    }

    return secret;
}

function modInverse(a: bigint, prime: bigint): bigint {
    let m0 = prime;
    let y = BigInt(0);
    let x = BigInt(1);

    if (prime === BigInt(1)) {
        return BigInt(0);
    }

    while (a > BigInt(1)) {
        let q = a / prime;
        let t = prime;

        prime = a % prime;
        a = t;
        t = y;

        y = x - q * y;
        x = t;
    }

    if (x < BigInt(0)) {
        x += m0;
    }

    return x;
}

const prime = BigInt('251');
const exampleShares = [
    { x: BigInt(1), y: BigInt(123) },
    { x: BigInt(2), y: BigInt(150) },
    { x: BigInt(3), y: BigInt(200) }
];

const secret = lagrangeInterpolation(exampleShares, prime);
console.log(`Recovered secret: ${secret}`);


// const LagrangeInterpolation = Experimental.ZkProgram({
//     publicInput: Field,
//     publicOutput: Field,
// })