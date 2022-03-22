import createResponse from './response';
import BatchInfo from './BatchInfo';
import batchService from './batch.service';

export interface Event {
  queryStringParameters: {
    trainerEmail?: string;
    query?: string;
    year?: string;
  };
}

export async function handler(event: Event) {
  try {
    let { year, trainerEmail, query } = event.queryStringParameters;
    if (year) {
      let batchInfo: BatchInfo[] = await batchService.getAllBatches(year);
      return createResponse(JSON.stringify(batchInfo), 200);
    } else if (trainerEmail) {
      let batchInfo: BatchInfo[] = await batchService.getBatchesByTrainer(
        trainerEmail
      );
      let validYearsArray = batchInfo.map((batch) => {
        return new Date(batch.startDate).getFullYear().toString();
      });
      let validYearsSet = new Set(validYearsArray);
      let validYears = Array.from(validYearsSet);
      return createResponse(JSON.stringify({ validYears, batches: batchInfo }));
    } else if (query && query === 'validYears') {
      let validYears = await batchService.getValidYears();
      return createResponse(JSON.stringify(validYears), 200);
    } else {
      return createResponse('Not found', 404);
    }
  } catch (err) {
    return createResponse('Bad Request', 400);
  }
}
