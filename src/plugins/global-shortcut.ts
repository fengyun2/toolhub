import { register } from '@tauri-apps/plugin-global-shortcut';
import { readText } from '@tauri-apps/plugin-clipboard-manager';

await register('CommandOrControl+Shift+C', () => {
  console.log('触发了 CommandOrControl+Shift+C 快捷键');

});

await register('CommandOrControl+Shift+V', async () => {
  console.log('触发了 CommandOrControl+Shift+V 快捷键');
  // 从剪贴板读取内容
  const content = await readText();
  console.log('粘贴板内容: ', content);
});