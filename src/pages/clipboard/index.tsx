import { useEffect } from 'react';
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';
import {Button} from 'antd'
import PageContainer from 'components/page-container';

function ClipboardPage() {
  const startClipboard = async () => {
    // 将内容写到剪贴板
    await writeText('Tauri is awesome!');

    // 从剪贴板读取内容
    const content = await readText();
    console.log(content);
    // Prints "Tauri is awesome!" to the console
  };
  useEffect(() => {
    startClipboard();
  }, []);

  return (
    <PageContainer header={{ title: '剪贴面板' }}>
      <h3>我是测试页面</h3>
      <Button>剪贴板</Button>
    </PageContainer>
  );
}

export default ClipboardPage;
