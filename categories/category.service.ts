import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export interface Event {
  httpMethod: string;
  path: string;
  body?: string;
  queryStringParameters?: any;
}

class CategoryService {
  constructor() {}

  async getCategories(event: Event) {
    const client = new Client();
    const { active } = event.queryStringParameters;
    if (active !== undefined) {
      try {
        await client.connect();
        const q = `select id, skill, active from categories where active=$1::boolean;`;
        const res = await client.query(q, [active]);
        return res.rows;
      } catch (err: any) {
        console.log(err.stack);
        return null;
      } finally {
        client.end();
      }
    } else {
      try {
        await client.connect();
        const q = `select id, skill, active from categories;`;

        const res = await client.query(q);
        return res.rows;
      } catch (err: any) {
        console.log(err.stack);
        return null;
      } finally {
        client.end();
      }
    }
  }

  async postCategories(event: Event) {
    const client = new Client();
    try {
      await client.connect();
      const q = `insert into categories (skill, active) values ($1::text, true)
      returning id, skill, active;`;
      const { skill } = JSON.parse(event.body as string);
      const resp = await client.query(q, [skill]);
      return resp.rows;
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }

  async putCategories(event: Event) {
    const client = new Client();
    try {
      await client.connect();
      const parts = event.path.split('/');
      const id = parts[parts.length - 1];
      const q = `update categories 
      set skill=$1::text, active=$2::boolean where id=$3::integer returning *;`;
      const { skill, active } = JSON.parse(event.body as string);
      const resp = await client.query(q, [skill, active, id]);
      return resp.rows;
    } catch (err: any) {
      console.log(err.stack);
      return null;
    } finally {
      client.end();
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
