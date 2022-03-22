import axios from 'axios';
import https from 'https';
import BatchInfo from './BatchInfo';

export const agent = new https.Agent({ rejectUnauthorized: false });

class BatchService {
  private URI: string;

  constructor() {
    this.URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';
  }

  async getAllBatches(year: string): Promise<BatchInfo[]> {
    try {
      const response = await axios.get(this.URI, {
        httpsAgent: agent,
        params: year ? { year: year } : '',
      });

      let batches: BatchInfo[] = response.data.map((batch: any) => {
        let batchData: any = new BatchInfo();
        let arr = [
          'id',
          'batchId',
          'name',
          'startDate',
          'endDate',
          'skill',
          'location',
          'type',
        ];
        for (let el of arr) {
          batchData[el] = batch[el];
        }

        if (
          batch.employeeAssignments &&
          batch.employeeAssignments[0].role === 'ROLE_LEAD_TRAINER'
        ) {
          batchData.trainerEmail = batch.employeeAssignments[0].employee.email;
          batchData.trainerFirstName =
            batch.employeeAssignments[0].employee.firstName;
          batchData.trainerLastName =
            batch.employeeAssignments[0].employee.lastName;
        }

        return batchData as BatchInfo;
      });
      return batches;
    } catch (err: any) {
      console.log(err.stack);
      return [];
    }
  }

  async getValidYears(): Promise<string[]> {
    try {
      return await axios
        .get(this.URI + '/validYears', {
          httpsAgent: agent,
        })
        .then((res) => res.data);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  private async getBatchIDs(trainerEmail: string): Promise<string[]> {
    return axios
      .get(`${this.URI}/${trainerEmail}/ids`, { httpsAgent: agent })
      .then((response) => response.data)
      .catch(() => []);
  }

  private async getBatches(
    batchIDs: string[],
    trainerEmail: string
  ): Promise<BatchInfo[]> {
    let batches: BatchInfo[] = [];

    for (let batchID of batchIDs) {
      await axios
        .get(`${this.URI}/${batchID}`, { httpsAgent: agent })
        .then((res) => {
          let { id, batchId, name, startDate, endDate, skill, location, type } =
            res.data;
          const batchData: BatchInfo = {
            id,
            batchId,
            name,
            startDate,
            endDate,
            skill,
            location,
            type,
            trainerEmail,
            trainerFirstName: '',
            trainerLastName: '',
          };
          batches.push(batchData);
        });
    }
    return batches;
  }

  async getBatchesByTrainer(trainerEmail: string): Promise<BatchInfo[]> {
    if (!trainerEmail) {
      return [];
    }

    const batchIDs = await this.getBatchIDs(trainerEmail);

    if (batchIDs.length > 0) {
      return await this.getBatches(batchIDs, trainerEmail);
    }

    return [];
  }
}

export default new BatchService();
