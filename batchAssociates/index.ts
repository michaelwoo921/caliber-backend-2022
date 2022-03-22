import batchAssociateService from './batchAssociate.service';
import createResponse from './response';

export interface Event {
  path: string;
}

export async function handler(event: Event) {
  let newpath = event.path.split('/');
  const batchid = newpath[newpath.length - 1];
  const associates = await batchAssociateService.getAssociates(batchid);
  if (associates && associates.length > 0) {
    return createResponse(JSON.stringify(associates), 200);
  }
  return createResponse('', 404);
}
