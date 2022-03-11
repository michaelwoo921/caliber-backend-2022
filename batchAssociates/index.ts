import batchAssociateService, { Event } from './batchAssociate.service';
import createResponse from './response';

export async function handler(event: Event) {
  const associates = await batchAssociateService.getAssociates(event.path);
  if (associates && associates.length > 0) {
    return createResponse(JSON.stringify(associates), 200);
  }
  return createResponse('', 404);
}
