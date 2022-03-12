import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

export interface Event {
  path: string;
  httpMethod: string;
  body?: string;
}

class BatchWeekService {
  constructor() {}

  async getWeeksByBatchId(batchId: string) {
    const client = new Client();
    try {
      await client.connect();
      const query = `select id, weeknumber, note, overallstatus, batchid 
      from qcweeks where batchid = $1::text;`;
      const result = await client.query(query, [batchId]);
      console.log(result.rows);
      return result.rows[0];
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }

  async addWeek(event: Event) {
    const client = new Client();
    const { weeknumber, note, overallstatus, batchid } = JSON.parse(
      event.body as string
    );
    try {
      await client.connect();
      const query = `insert into qcweeks (weeknumber, note, overallstatus, batchid)
      values ($1::integer, $2::text, $3::STATUS, $4::text) returning *;
      `;
      const result = await client.query(query, [
        weeknumber,
        note,
        overallstatus,
        batchid,
      ]);
      return result.rows[0];
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }

  async updateFeedback(event: Event) {
    const client = new Client();
    const { note, overallstatus, weeknumber, batchid } = JSON.parse(
      event.body as string
    );
    const query = `update qcweeks set note = $1::text, overallstatus = $2::STATUS
    where weeknumber = $3::integer and batchid = $4::text ;`;
    try {
      const result = await client.query(query, [
        note,
        overallstatus,
        weeknumber,
        batchid,
      ]);
      return result.rows[0];
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }
}

const batchWeekService = new BatchWeekService();

export default batchWeekService;
