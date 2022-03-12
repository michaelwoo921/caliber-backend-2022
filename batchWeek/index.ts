import createResponse from './response';
import batchWeekService, { Event } from './batchWeek.service';

export async function handler(event: Event) {
  const parts = event.path.split('/batches/')[1];
  const [batchid, _, weeknumber] = parts.split('/');
  switch (event.httpMethod) {
    case 'GET': {
      if (batchid) {
        const qcweek = await batchWeekService.getWeeksByBatchId(batchid);
        return createResponse(JSON.stringify(qcweek), 200);
      }
      return createResponse('', 400);
    }
    case 'POST': {
      const qcweek = await batchWeekService.addWeek(event);
      return createResponse(JSON.stringify(qcweek), 200);
    }
    case 'PUT': {
      const qcweek = await batchWeekService.updateFeedback(event);
      return createResponse(JSON.stringify(qcweek), 200);
    }
    default:
      return createResponse('', 400);
  }
}
