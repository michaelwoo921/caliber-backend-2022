import { Role, helper, generateIamPolicy } from './authorizer';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

var serviceAccountKey = require('./serviceAccountKey.json');

let app = initializeApp({
  credential: cert(serviceAccountKey),
  databaseURL: 'https://caliber-12-2021-default-rtdb.firebaseio.com',
});

export async function handler(event: any, context: any) {
  try {
    if (!event.authorizationToken) {
      return context.fail('Unauthorized');
    }
    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];

    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
      return context.fail('Unauthorized');
    }

    let roles: Role = {
      qc: false,
      vp: false,
      trainer: false,
    };
    await getAuth()
      .verifyIdToken(tokenValue)
      .then((claims) => {
        roles = {
          qc: claims.ROLE_QC,
          vp: claims.ROLE_VP,
          trainer: claims.ROLE_TRAINER,
        };
        console.log('roles: ', roles);
      })
      .catch((err) => console.log(err));
    if (roles.vp) {
      return generateIamPolicy('Allow', event.methodArn);
    }
    let status = helper(event.methodArn, roles);
    if (status === 'Allow') {
      return generateIamPolicy('Allow', event.methodArn);
    }
    return generateIamPolicy('Deny', event.methodArn);
  } catch (err) {
    return generateIamPolicy('Deny', event.methodArn);
  }
}

// const token =
//   'bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJkYzBlNmRmOTgyN2EwMjA2MWU4MmY0NWI0ODQwMGQwZDViMjgyYzAiLCJ0eXAiOiJKV1QifQ.eyJST0xFX1FDIjpmYWxzZSwiUk9MRV9UUkFJTkVSIjp0cnVlLCJST0xFX1ZQIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2NhbGliZXItMTItMjAyMSIsImF1ZCI6ImNhbGliZXItMTItMjAyMSIsImF1dGhfdGltZSI6MTY0NzEzMzgyNiwidXNlcl9pZCI6IlVSZU1LZkkwa2lhN0Z2ZE1Zc1VYV0d4elNXMzMiLCJzdWIiOiJVUmVNS2ZJMGtpYTdGdmRNWXNVWFdHeHpTVzMzIiwiaWF0IjoxNjQ3MTMzODI2LCJleHAiOjE2NDcxMzc0MjYsImVtYWlsIjoidHJhaW5lckByZXZhdHVyZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidHJhaW5lckByZXZhdHVyZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.hCNpnRgXpMApkd2-1EPcAWj4m668gyd3Bh0iM5OG8nWPfxhpcO82Da0d2veGYj6Rj1RhOo1lQTfWnfxFJntQ0FUivHp6u368IHRF5PQ-ZTwys0P52oN9cBt5yZqD1b4o4K1M5wy3fWq8hyckia-LeBuc6HECqYC0gNUqJQsi9WqgN2PZ1eOZFFVFydeTWqpgh1v4fFPqOp3mWRecov1WIBoj7qRn5zfmedZjPLFRYGIR39-f0HIgdsK0UdSec96OAjz7d5PlCficvE232OkQVob56VOLOKKLEV6OZUAx2GyamdqqfaKzm37ZZFScS0prGp_dKilnWE2v3hKWYff5Cg';

// handler(
//   {
//     authorizationToken: token,
//   },
//   {}
// );
