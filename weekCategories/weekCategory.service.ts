import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

class WeekCategoryService {
  constructor() {}

  async getCategories(batchid: string, weeknumber: number) {
    const client = new Client();
    try {
      await client.connect();
      const q = `select id from qcweeks where 
      batchid=$1::text and weeknumber = $2::integer;`;
      const res = await client.query(q, [batchid, weeknumber]);
      console.log(res.rows[0]);
      const { id } = res.rows[0];
      console.log('**', typeof id, id);
      const query = `select c.skill, c.id from categories c join weekcategories w
      on c.id = w.categoryid where w.qcweekid = ${id};`;
      const result = await client.query(query);
      return result.rows;
    } catch (err: any) {
      console.log(err.trace);
      return null;
    } finally {
      client.end();
    }
  }

  async addWeekCategory(params: any) {
    const client = new Client();
    try {
      await client.connect();
      const q = `insert into weekcategories (categoryid, qcweekid)
      values ($1::integer, $2::integer) returning *;`;
      const { categoryid, qcweekid } = params;
      const res = await client.query(q, [categoryid, qcweekid]);
      return res.rows[0];
    } catch (err: any) {
      console.log(err.trace);
      return null;
    } finally {
      client.end();
    }
  }

  async deleteWeekCategory(
    batchid: string,
    weeknumber: number,
    categoryid: number
  ) {
    const client = new Client();
    try {
      await client.connect();
      const q = `select id from qcweeks where batchid=$1::text and
      weeknumber =$2::integer;`;
      const res = await client.query(q, [batchid, weeknumber]);
      if (res.rows.length > 0) {
        const { id } = res.rows[0];
        const query = `delete from weekcategories where qcweekid = $1::number
        and categoryid =$2::number;`;
        await client.query(query, [id, categoryid]);
        return 'success';
      }
      return null;
    } catch (err: any) {
      console.log(err.trace);
      return null;
    } finally {
      client.end();
    }
  }
}

const weekCategoryService = new WeekCategoryService();

export default weekCategoryService;
