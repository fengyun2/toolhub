/**
 * Store 类用于封装本地存储操作，提供类型安全的存储、获取、删除和清空功能。
 * 支持 `localStorage` 和 `sessionStorage`。
 *
 * 示例：
 * ```typescript
 * // 使用 localStorage
 * const localStorageInstance = new Store(localStorage);
 *
 * // 使用 sessionStorage
 * const sessionStorageInstance = new Store(sessionStorage);
 *
 * // 存储数据
 * localStorageInstance.setItem('user', { name: '张三', age: 25 });
 *
 * // 获取数据
 * const user = localStorageInstance.getItem<{ name: string, age: number }>('user');
 * console.log(user); // 输出: { name: '张三', age: 25 }
 *
 * // 删除数据
 * localStorageInstance.removeItem('user');
 *
 * // 清空所有数据
 * localStorageInstance.clear();
 * ```
 */
class Store {
  private storage: Storage;

  /**
   * 构造函数，初始化 Store 实例。
   * @param storage - 存储对象，可以是 `localStorage` 或 `sessionStorage`。
   */
  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  /**
   * 存储数据到本地存储。
   * @param key - 存储的键。
   * @param value - 要存储的值。
   */
  setItem<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  /**
   * 从本地存储中获取数据。
   * @param key - 要获取的键。
   * @returns 存储的值，如果键不存在则返回 `null`。
   */
  getItem<T>(key: string): T | null {
    const item = this.storage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  /**
   * 从本地存储中删除数据。
   * @param key - 要删除的键。
   */
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * 清空本地存储中的所有数据。
   */
  clear(): void {
    this.storage.clear();
  }
}

export default Store;