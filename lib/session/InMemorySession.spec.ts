import { describe, it, expect, beforeEach } from 'vitest';
import { InMemorySession } from './InMemorySession';

type TestSessionData = {
  stringValue: string;
  numberValue: number;
  booleanValue: boolean;
};

describe('InMemorySession', () => {
  let session: InMemorySession<TestSessionData>;

  beforeEach(() => {
    session = new InMemorySession<TestSessionData>();
  });

  describe('get and set', () => {
    it('should set and get a value', async () => {
      await session.set('stringValue', 'test');
      const value = await session.get('stringValue');
      expect(value).toBe('test');
    });

    it('should return undefined for non-existent key', async () => {
      const value = await session.get('numberValue');
      expect(value).toBeUndefined();
    });
  });

  describe('getBatch and setBatch', () => {
    it('should set and get multiple values', async () => {
      await session.setBatch({
        stringValue: 'test',
        numberValue: 123,
        booleanValue: true,
      });
      const values = await session.getBatch(
        'stringValue',
        'numberValue',
        'booleanValue'
      );
      expect(values).toEqual({
        stringValue: 'test',
        numberValue: 123,
        booleanValue: true,
      });

      await session.setBatch({
        booleanValue: false,
      });
      const values2 = await session.getBatch('booleanValue');
      expect(values2).toEqual({
        booleanValue: false,
      });
    });

    it('should return undefined for non-existent keys in batch', async () => {
      const values = await session.getBatch('stringValue', 'numberValue');
      expect(values).toEqual({
        stringValue: undefined,
        numberValue: undefined,
      });
    });
  });

  describe('delete', () => {
    it('should delete a value and return it', async () => {
      await session.set('stringValue', 'test');
      const deletedValue = await session.delete('stringValue');
      expect(deletedValue).toBe('test');
      const value = await session.get('stringValue');
      expect(value).toBeUndefined();
    });

    it('should return undefined when deleting non-existent key', async () => {
      const deletedValue = await session.delete('numberValue');
      expect(deletedValue).toBeUndefined();
    });
  });

  describe('deleteBatch', () => {
    it('should delete multiple values and return them', async () => {
      await session.setBatch({
        stringValue: 'test',
        numberValue: 123,
        booleanValue: true,
      });
      const deletedValues = await session.deleteBatch(
        'stringValue',
        'numberValue'
      );
      expect(deletedValues).toEqual({
        stringValue: 'test',
        numberValue: 123,
      });
      const remainingValue = await session.get('booleanValue');
      expect(remainingValue).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all values', async () => {
      await session.setBatch({
        stringValue: 'test',
        numberValue: 123,
        booleanValue: true,
      });
      await session.clear();
      const values = await session.getBatch(
        'stringValue',
        'numberValue',
        'booleanValue'
      );
      expect(values).toEqual({
        stringValue: undefined,
        numberValue: undefined,
        booleanValue: undefined,
      });
    });
  });
});
