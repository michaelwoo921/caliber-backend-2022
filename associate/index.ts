import createResponse from './createResponse';
import associateService from './associate.service';
import { parsePath } from './parsePath';
import { QcFeedback } from './associate.service';

export interface Event {
  path: string;
  httpMethod: string;
  body?: string;
}

export async function handler(event: Event) {
  const { batchid, weeknumber, associateid } = parsePath(event.path);

  switch (event.httpMethod) {
    case 'GET': {
      const associate = await associateService.getAssociate({
        batchid,
        weeknumber: Number(weeknumber),
        associateid,
      });
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      }
      return createResponse('', 404);
    }
    case 'PUT': {
      if (event.body) {
        const { notecontent, technicalstatus } = JSON.parse(
          event.body
        ) as QcFeedback;
        const associate = await associateService.putAssociate({
          batchid,
          weeknumber,
          associateid,
          notecontent,
          technicalstatus,
        });
        if (associate) {
          return createResponse(JSON.stringify(associate), 200);
        }
        return createResponse('', 404);
      }
      return createResponse('', 404);
    }
    case 'PATCH': {
      if (event.body) {
        const { notecontent, technicalstatus } = JSON.parse(
          event.body
        ) as QcFeedback;
        const associate = await associateService.patchAssociate({
          batchid,
          weeknumber,
          associateid,
          notecontent,
          technicalstatus,
        });
        if (associate) {
          return createResponse(JSON.stringify(associate), 200);
        }
        return createResponse('', 404);
      }
      return createResponse('', 404);
    }
    default:
      console.log('something went wrong in handler');
      return createResponse('', 404);
  }
}
