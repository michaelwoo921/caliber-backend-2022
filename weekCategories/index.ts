import createResponse from './response';
import weekCategoryService from './weekCategory.service';

export async function handler(event: any) {
  switch (event.httpMethod) {
    case 'GET': {
      const parts = event.path.split('/');
      let batchid = parts[parts.length - 4];
      let weeknumber = Number(parts[parts.length - 2]);
      const categories = await weekCategoryService.getCategories(
        batchid,
        weeknumber
      );
      if (categories) {
        return createResponse(JSON.stringify(categories), 200);
      }
      return createResponse('', 400);
    }

    case 'POST': {
      let { categoryid, qcweekid } = JSON.parse(event.body);

      const weekCategory = await weekCategoryService.addWeekCategory({
        categoryid,
        qcweekid,
      });
      return createResponse(JSON.stringify(weekCategory), 200);
    }
    case 'DELETE': {
      const parts = event.path.split('/');
      const batchid = parts[parts.length - 5];
      const weeknumber = Number(parts[parts.length - 3]);
      const categoryid = Number(parts[parts.length - 1]);

      const res = await weekCategoryService.deleteWeekCategory(
        batchid,
        weeknumber,
        categoryid
      );
      if (res) {
        return createResponse(res, 200);
      }
      return createResponse('', 400);
    }
  }
}
