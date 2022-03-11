import axios from 'axios';
import https from 'https';

export interface Event {
  path: string;
  httpMethod: string;
  body?: string;
}
export const agent = new https.Agent({ rejectUnauthorized: false });

class BatchAssociateService {
  private URI: string;
  constructor() {
    this.URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';
  }

  async getAssociates(path: string): Promise<any[]> {
    let newpath = path.split('/');

    return axios
      .get(this.URI + '/' + newpath[newpath.length - 1] + '/associates', {
        withCredentials: true,
        httpsAgent: agent,
      })
      .then((result: { data: any }) => result.data)
      .catch((err: any) => {
        console.error(err);
        return [];
      });
  }
}

const batchAssociateService = new BatchAssociateService();
export default batchAssociateService;
