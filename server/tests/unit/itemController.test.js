// server/tests/unit/itemController.test.js

const { createItem, getItems, updateItem, deleteItem } = require('../../src/controllers/itemController');
const Item = require('../../src/models/Item');

// Mock the Item model
jest.mock('../../src/models/Item');

describe('Item Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response objects
    mockReq = {
      body: {},
      params: { id: '1' } // Default id for tests that need it
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createItem', () => {
    test('should create a new item and return 201', async () => {
      const itemData = { name: 'Test Item', description: 'Test Description' };
      const savedItem = { _id: '1', ...itemData };
      const successResponse = { success: true, data: savedItem };

      mockReq.body = itemData;
      // CORRECTED: Mock the static Item.create method
      Item.create.mockResolvedValue(savedItem);

      await createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(successResponse);
    });

    test('should return 500 if there is an error', async () => {
      const errorMessage = 'Database error';
      const errorResponse = { success: false, message: errorMessage };
      
      // CORRECTED: Mock the static Item.create method to reject
      Item.create.mockRejectedValue(new Error(errorMessage));

      await createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(errorResponse);
    });
  });

  describe('getItems', () => {
    test('should return a list of items', async () => {
      const items = [{ name: 'Item 1' }, { name: 'Item 2' }];
      const successResponse = { success: true, data: items };
      
      Item.find.mockResolvedValue(items);

      await getItems(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(successResponse);
    });
  });

  describe('updateItem', () => {
    test('should update an item and return it', async () => {
      const updatedItem = { _id: '1', name: 'Updated Name' };
      const successResponse = { success: true, data: updatedItem };
      mockReq.body = { name: 'Updated Name' };
      
      Item.findByIdAndUpdate.mockResolvedValue(updatedItem);

      await updateItem(mockReq, mockRes);

      expect(Item.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Updated Name' }, { new: true, runValidators: true });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(successResponse);
    });
  });

  describe('deleteItem', () => {
    test('should delete an item and return a success message', async () => {
      const deletedItem = { _id: '1' };
      const successResponse = { success: true, message: 'Item deleted successfully' };
      
      Item.findByIdAndDelete.mockResolvedValue(deletedItem);

      await deleteItem(mockReq, mockRes);

      expect(Item.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(successResponse);
    });
  });
});