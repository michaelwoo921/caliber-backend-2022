import axios from 'axios';
import * as https from 'https';

export const agent = new https.Agent({ rejectUnauthorized: false });

class BatchAssociateService {
  private URI: string;
  constructor() {
    this.URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';
  }

  async getAssociates(batchid: string): Promise<any[]> {
    return axios
      .get(this.URI + '/' + batchid + '/associates', {
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
