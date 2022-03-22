import createResponse from './response';
import categoryService from './category.service';

export interface Event {
  httpMethod: string;
  path: string;
  body?: string;
  queryStringParameters?: any;
}
export async function handler(event: Event) {
  switch (event.httpMethod) {
    case 'GET': {
      const { queryStringParameters } = event;
      if (!queryStringParameters) {
        const categories = await categoryService.getCategories();
        return createResponse(JSON.stringify(categories), 200);
      }
      const { active } = queryStringParameters;
      if (!active) {
        const categories = await categoryService.getCategories();
        return createResponse(JSON.stringify(categories), 200);
      }
      let bool = active === 'true';
      const categories = await categoryService.getCategories(bool);

      return createResponse(JSON.stringify(categories), 200);
    }
    case 'POST': {
      const { body } = event;
      if (!body) {
        return createResponse('', 400);
      }
      const { skill } = JSON.parse(body);
      if (!skill) {
        return createResponse('', 400);
      }

      const categories = await categoryService.postCategories(skill);
      return createResponse(JSON.stringify(categories), 200);
    }
    case 'PUT': {
      const parts = event.path.split('/');
      const id = parts[parts.length - 1];
      const { skill, active } = JSON.parse(event.body as string);

      const categories = await categoryService.putCategories({
        id: Number(id),
        skill,
        active,
      });
      return createResponse(JSON.stringify(categories), 200);
    }
    default: {
      return createResponse('', 400);
    }
  }
}
