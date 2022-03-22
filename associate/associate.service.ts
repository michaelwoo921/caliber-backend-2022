import { Client } from 'pg';
import { statusToNumber, numberToStatus } from './statusConversion';
import * as dotenv from 'dotenv';

dotenv.config();

export interface QcFeedback {
  batchid: string;
  weeknumber: number;
  associateid: string;
  notecontent?: string;
  technicalstatus?: '1' | '2' | '3' | '4' | '5';
}

class AssociateService {
  constructor() {}

  async getAssociate({ batchid, weeknumber, associateid }: QcFeedback) {
    const client = new Client();

    try {
      await client.connect();
      const query = `select batchid, weeknumber, associateid, notecontent, 
      technicalstatus from qcnotes 
      where batchid = $1::text and weeknumber = $2::integer and associateid = $3::text;`;

      const res = await client.query(query, [batchid, weeknumber, associateid]);
      const status: 'Undefined' | 'Poor' | 'Average' | 'Good' | 'Superstar' =
        res.rows[0].technicalstatus;
      res.rows[0].technicalstatus = statusToNumber[status];
      console.log(res.rows[0]);
      return res.rows[0] as QcFeedback;
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }

  async putAssociate(qcFeedback: QcFeedback) {
    const { batchid, weeknumber, associateid, notecontent, technicalstatus } =
      qcFeedback;
    const client = new Client();

    if (notecontent === undefined || technicalstatus === undefined) {
      return null;
    }

    try {
      await client.connect();
      let query;
      query = `update qcnotes set notecontent = $1::text, technicalstatus = $2::STATUS 
      where associateid = $3::text and weeknumber = $4::integer and batchid = $5::text;`;
      const status = numberToStatus[technicalstatus];
      await client.query(query, [
        notecontent,
        status,
        associateid,
        weeknumber,
        batchid,
      ]);

      const check_query = `select batchid, weeknumber, associateid, notecontent, technicalstatus 
      from qcnotes where associateid=$1::text 
      and weeknumber = $2::integer and batchid = $3::text;`;
      const res = await client.query(check_query, [
        associateid,
        weeknumber,
        batchid,
      ]);
      console.log(res.rows[0]);
      return res.rows[0];
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }

  async patchAssociate(qcFeedback: QcFeedback) {
    const { batchid, weeknumber, associateid, notecontent, technicalstatus } =
      qcFeedback;
    const client = new Client();

    if (notecontent === undefined && technicalstatus === undefined) {
      return null;
    }

    try {
      await client.connect();

      let query;
      if (notecontent) {
        query = `update qcnotes set notecontent = $1::text 
      where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text;`;
        await client.query(query, [
          notecontent,
          associateid,
          weeknumber,
          batchid,
        ]);
      }
      if (technicalstatus != undefined) {
        query = `update qcnotes set technicalstatus = $1::STATUS
      where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text;`;
        const status = numberToStatus[technicalstatus];
        await client.query(query, [status, associateid, weeknumber, batchid]);
      }
      const check_query = `select batchid, weeknumber, associateid, notecontent, technicalstatus 
      from qcnotes where associateid=$1::text and weeknumber = $2::integer and batchid = $3::text;`;
      const res = await client.query(check_query, [
        associateid,
        weeknumber,
        batchid,
      ]);
      console.log(res.rows[0]);
      return res.rows[0];
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }
}

const associateService = new AssociateService();

export default associateService;
