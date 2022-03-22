import createResponse from './response';
import batchWeekService from './batchWeek.service';

export interface Event {
  path: string;
  httpMethod: string;
  body?: string;
}
export async function handler(event: Event) {
  const parts = event.path.split('/batches/')[1];
  let [batchid, _, weeknumber] = parts.split('/');
  //
  switch (event.httpMethod) {
    case 'GET': {
      if (batchid) {
        const qcweek = await batchWeekService.getWeeksByBatchId(batchid);
        if (qcweek) {
          return createResponse(JSON.stringify(qcweek), 200);
        }
        return createResponse('', 400);
      }
      return createResponse('', 400);
    }
    case 'POST': {
      const { note, overallstatus } = JSON.parse(event.body as string);
      const qcweek = await batchWeekService.addWeek({
        batchid,
        weeknumber: Number(weeknumber),
        note,
        overallstatus,
      });
      if (qcweek) {
        return createResponse(JSON.stringify(qcweek), 200);
      }
      return createResponse('', 400);
    }
    case 'PUT': {
      const { note, overallstatus } = JSON.parse(event.body as string);
      const qcweek = await batchWeekService.updateFeedback({
        batchid,
        weeknumber: Number(weeknumber),
        note,
        overallstatus,
      });
      if (qcweek) {
        return createResponse(JSON.stringify(qcweek), 200);
      }
      return createResponse('', 400);
    }
    default:
      return createResponse('', 400);
  }
}
