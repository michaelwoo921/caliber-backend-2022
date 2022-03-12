import createResponse from './createResponse';
import associateService, { Event } from './associate.service';

export async function handler(event: Event) {
  switch (event.httpMethod) {
    case 'GET': {
      const associate = await associateService.getAssociate(event.path);
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      }
      return createResponse('', 404);
    }
    case 'PUT': {
      if (event.body) {
        const associate = await associateService.putAssociate(
          event.body,
          event.path
        );
        if (associate) {
          return createResponse(JSON.stringify(associate), 200);
        }
      }
      return createResponse('', 404);
    }
    case 'PATCH': {
      if (event.body) {
        const associate = await associateService.patchAssociate(
          event.body,
          event.path
        );
        if (associate) {
          return createResponse(JSON.stringify(associate), 200);
        }
      }
      return createResponse('', 404);
    }
    default:
      console.log('something went wrong in handler');
      return createResponse('', 404);
  }
}
