import { useState, useEffect } from 'react';
import { Button, List, Typography, Input, Space } from 'antd';
import PageContainer from 'components/page-container';
import { getClipboardHistoryList, updateClipboardHistoryItem, removeClipboardHistoryItem } from '@/plugins/clipboard';

const MAX_COUNT = 100; // 最多一次展示 100 条记录

function ClipboardPage() {
  // 过滤后的剪切板记录
  const [clipboardHistoryList, setClipboardHistoryList] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');

  function filterClipboard() {
    const tmpClipboardHistoryList = getClipboardHistoryList();
    const newClipboardHistoryList = tmpClipboardHistoryList
      .filter((content) => content.includes(keyword))
      .slice(0, MAX_COUNT);
    setClipboardHistoryList(newClipboardHistoryList);
  }

  function onLoadMore() {
    const tmpClipboardHistoryList = getClipboardHistoryList();
    const appendClipboardHistoryList = tmpClipboardHistoryList
      .filter((content) => content.includes(keyword))
      .slice(tmpClipboardHistoryList.length, tmpClipboardHistoryList.length + MAX_COUNT);
    const newClipboardHistoryList = [...clipboardHistoryList, ...appendClipboardHistoryList];
    setClipboardHistoryList(newClipboardHistoryList);
  }

  const loadMore = (
    <div style={{ textAlign: 'center', height: 32, lineHeight: '32px' }}>
      <Button color="primary" variant="filled" onClick={onLoadMore}>
        加载更多
      </Button>
    </div>
  );

  useEffect(() => {
    filterClipboard();
  }, []);

  return (
    <PageContainer header={{ title: '剪贴面板' }}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Space.Compact block>
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          <Button color="primary" variant="outlined" onClick={filterClipboard}>
            搜索
          </Button>
        </Space.Compact>
        <List
          loading={false}
          bordered
          size="small"
          loadMore={loadMore}
          dataSource={clipboardHistoryList}
          renderItem={(item, index) => (
            <List.Item>
              <Typography.Text
                copyable
                ellipsis
                editable={{ text: item, onChange: (value) => updateClipboardHistoryItem(index, value) }}
              >
                {item}
              </Typography.Text>
              <Button
                style={{ marginLeft: 8 }}
                color="danger"
                variant="text"
                onClick={() => removeClipboardHistoryItem(index)}
              >
                删除
              </Button>
            </List.Item>
          )}
        />
      </Space>
    </PageContainer>
  );
}

export default ClipboardPage;
