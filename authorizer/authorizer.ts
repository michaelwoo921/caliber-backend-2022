export interface Role {
  qc: boolean;
  vp: boolean;
  trainer: boolean;
}

export function generateIamPolicy(effect: any, resource: any) {
  if (effect && resource) {
    return {
      policyDocument: {
        Statement: [
          { Action: 'execute-api:Invoke', Effect: effect, Resource: resource },
        ],
      },
    };
  }
  return {};
}

export function helper(arn: string, roles: Role) {
  let status = 'Deny';
  const pathParts = arn.split('/');
  //arn:smth.smth-smth/state-name/GET/categories;
  const method = pathParts[2];
  if (pathParts[3].includes('categories')) {
    if (!pathParts[4]) {
      if (method === 'GET' && (roles.qc || roles.trainer)) {
        status = 'Allow';
      }
    }
  } else if (pathParts[3].includes('batches')) {
    if (method === 'GET' && (roles.qc || roles.trainer)) {
      status = 'Allow';
    }
  } else if (pathParts[3].includes('qc')) {
    if (!pathParts[6]) {
      if (method == 'GET' && (roles.qc || roles.trainer)) {
        status = 'Allow';
      }
    } else {
      if (!pathParts[7]) {
        if (method === 'GET' && (roles.qc || roles.trainer)) {
          status = 'Allow';
        } else if (method === 'POST' && roles.qc) {
          status = 'Allow';
        }
      } else {
        if (!pathParts[8]) {
          if (method === 'POST' && roles.qc) {
            status = 'Allow';
          }
        } else if (pathParts[8].includes('categories')) {
          if (!pathParts[9]) {
            if (
              (method == 'GET' || method == 'POST') &&
              (roles.qc || roles.trainer)
            ) {
              status = 'Allow';
            }
          } else {
            if (method == 'DELETE' && (roles.qc || roles.trainer)) {
              status = 'Allow';
            }
          }
        } else if ((method === 'PUT' || method === 'PATCH') && roles.qc) {
          status = 'Allow';
        }
      }
    }
  }
  return status;
}
