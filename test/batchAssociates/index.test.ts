import batchAssociateService, {
  Event,
} from '../../batchAssociates/batchAssociate.service';
import createResponse from '../../batchAssociates/response';
import { handler } from '../../batchAssociates/index';

let testEvent: Event = {
  path: '/something',
  httpMethod: 'GET',
};

let testAssociates = [
  { id: 'associate1@example.net' },
  { id: 'associate2@example.net' },
];

jest.mock('../../batchAssociates/batchAssociate.service', () => {
  const mockget = jest.fn().mockImplementation((path) => {
    if (path === '/something') {
      return testAssociates;
    } else {
      return [];
    }
  });
  return {
    getAssociates: mockget,
  };
});
jest.mock('../../batchAssociates/response', () => {
  return jest.fn().mockImplementation((one, two) => {
    return { body: one };
  });
});

describe('tests for handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('That getAssociates is called using the given path, and createResponse can return 200', async () => {
    const res = await handler(testEvent);

    expect(res).toEqual({ body: JSON.stringify(testAssociates) });
    expect(batchAssociateService.getAssociates).toHaveBeenCalledTimes(1);
    expect(batchAssociateService.getAssociates).toHaveBeenLastCalledWith(
      testEvent.path
    );
    expect(createResponse).toHaveBeenCalledTimes(1);
    expect(createResponse).toHaveBeenLastCalledWith(
      JSON.stringify(testAssociates),
      200
    );
  });

  test('That when no associates are returned, we return a 404', async () => {
    testEvent = {
      path: '/nothing',
      httpMethod: 'GET',
    };

    const res = await handler(testEvent);

    expect(res).toEqual({ body: '' });
    expect(batchAssociateService.getAssociates).toHaveBeenCalledTimes(1);
    expect(batchAssociateService.getAssociates).toHaveBeenLastCalledWith(
      testEvent.path
    );
    expect(createResponse).toHaveBeenCalledTimes(1);
    expect(createResponse).toHaveBeenLastCalledWith('', 404);
  });
});
