import createResponse from './response';
import categoryService, { Event } from './category.service';

export async function handler(event: Event) {
  switch (event.httpMethod) {
    case 'GET': {
      const categories = await categoryService.getCategories(event);
      return createResponse(JSON.stringify(categories), 200);
    }
    case 'POST': {
      const categories = await categoryService.postCategories(event);
      return createResponse(JSON.stringify(categories), 200);
    }
    case 'PUT': {
      const categories = await categoryService.putCategories(event);
      return createResponse(JSON.stringify(categories), 200);
    }
    default: {
      return createResponse('', 400);
    }
  }
}
