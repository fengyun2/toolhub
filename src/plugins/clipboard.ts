import { readText } from '@tauri-apps/plugin-clipboard-manager';
import Store from '@/utils/store'

export const CLIPBOARD_STORAGE_KEY = 'clipboard_history'

// 使用 localStorage
const localStorageInstance = new Store();

function getClipboardHistory() {
  return localStorageInstance.getItem<Array<string>>(CLIPBOARD_STORAGE_KEY)
}

/**
 * 获取剪贴板历史记录列表
 * @returns 剪贴板历史记录列表
 */
export function getClipboardHistoryList() {
  return getClipboardHistory() || []
}

/**
 * 追加剪贴板历史记录
 * @param text 要添加的文本
 */
function addClipboardHistory(text: string) {
  const clipboardHistory = getClipboardHistory() || []
  clipboardHistory.unshift(text)
  localStorageInstance.setItem(CLIPBOARD_STORAGE_KEY, clipboardHistory)
}

// 监听剪贴板
function watchClipboard() {
  setInterval(async () => {
    try {
      // 从剪切板读取内容
      const clipboardText = await readText()
      if (clipboardText) {
        // 将剪贴板内容存储在localStorage
        addClipboardHistory(clipboardText)
      }
    } catch (error) {
      console.error('读取粘贴板内容失败: ', error)
    }

  }, 1000)
}

watchClipboard()