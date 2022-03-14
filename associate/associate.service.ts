import { Client } from 'pg';
import { parsePath } from './parsePath';
import { statusToNumber, numberToStatus } from './statusConversion';
import * as dotenv from 'dotenv';

dotenv.config();

export interface Event {
  path: string;
  httpMethod: string;
  body?: string;
}

export interface QcFeedback {
  batchid: string;
  weeknumber: number;
  associateid: string;
  notecontent: string;
  technicalstatus: number;
}

class AssociateService {
  constructor() {}

  async getAssociate(path: string) {
    let { batchid, weeknumber, associateid } = parsePath(path);
    if (!(batchid && weeknumber && associateid)) {
      return null;
    }
    console.log('***', { batchid, weeknumber, associateid });
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
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      client.end();
    }
  }

  async putAssociate(body: string, path: string) {
    let { notecontent, technicalstatus } = JSON.parse(body);
    let { batchid, weeknumber, associateid } = parsePath(path);

    if (batchid === undefined) {
      return null;
    }
    const client = new Client();
    const query = `insert into qcnotes(batchid, weeknumber, associateid, notecontent, technicalstatus) 
    values ($1::text, $2::integer, $3::text, $4::text, $5::STATUS)
    returning *;`;
    const status =
      numberToStatus[technicalstatus as '1' | '2' | '3' | '4' | '5'];
    try {
      await client.connect();
      const res = await client.query(query, [
        batchid,
        weeknumber,
        associateid,
        notecontent,
        status,
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

  async patchAssociate(body: string, path: string) {
    const client = new Client();
    const { batchid, weeknumber, associateid } = parsePath(path);
    const { notecontent, technicalstatus } = JSON.parse(body);
    if (batchid === undefined) {
      return null;
    }
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
        const status =
          numberToStatus[technicalstatus as '1' | '2' | '3' | '4' | '5'];
        await client.query(query, [status, associateid, weeknumber, batchid]);
      }
      const check_query = `select batchid, weeknumber, associateid, notecontent, technicalstatus 
      from qcnotes where associateid=$1::text and weeknumber = $2::integer and batchid = $3::text
      returning *;`;
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
