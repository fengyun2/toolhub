/**
 * URL参数格式化
 */
import { useState, useMemo } from 'react';
import { Space, Typography, Select, Table, Input, Button, Tooltip, message } from 'antd';
import type { TableProps, SelectProps } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PageContainer from 'components/page-container';
import TextareaWithCopy from 'components/TextareaWithCopy';
import { extractParamsFromUrl } from '@/utils/utils';

const { Text } = Typography;

type EncodingValue = 'UTF-8' | 'GBK';
interface Result {
  key: string;
  value: string;
}

const encodingOptions: SelectProps<EncodingValue>['options'] = [
  { label: 'UTF-8', value: 'UTF-8' },
  { label: 'GBK（简繁体）', value: 'GBK', disabled: true },
];

const columns: TableProps<Result>['columns'] = [
  {
    title: '键',
    dataIndex: 'key',
    minWidth: 150,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text copyable>{text}</Text>
      </Tooltip>
    ),
  },
  {
    title: '值',
    dataIndex: 'value',
    minWidth: 150,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text copyable>{text}</Text>
      </Tooltip>
    ),
  },
];

function UrlParameterFormatPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState<string>('');
  const [encoding, setEncoding] = useState('UTF-8');
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<Result[]>([]);

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message || '复制成功',
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message || '复制失败',
    });
  };

  const parseUrl = (newUrl: string) => {
    const parseResult = extractParamsFromUrl(newUrl);
    setUrl(parseResult?.path ?? '');
    setResult(parseResult?.params ?? []);
  };

  const onValueChange = (newValue: string) => {
    setValue(newValue);
    parseUrl(newValue);
  };

  const copyText = useMemo(() => {
    return result.map((item) => `${item.key}:${item.value}`).join('\n');
  }, [result]);

  const onCopy = (text: string, result: boolean) => {
    if (result) {
      console.log(`${text} 复制到剪贴板成功`);
      success('复制成功');
    } else {
      error('复制失败');
    }
  };

  return (
    <PageContainer header={{ title: 'URL参数格式化' }}>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div>
          <TextareaWithCopy value={value} onChange={onValueChange} />
        </div>
        <div>
          <Text>字符编码：</Text>
          <Select
            size="small"
            variant="borderless"
            value={encoding}
            popupMatchSelectWidth={false}
            options={encodingOptions}
            onChange={(newEncoding) => {
              setEncoding(newEncoding);
            }}
          />
        </div>
        <Space.Compact block>
          <Button>URL</Button>
          <Input value={url} readOnly />
          <CopyToClipboard text={url} onCopy={onCopy}>
            <Button color="primary" variant="outlined">复制</Button>
          </CopyToClipboard>
        </Space.Compact>
        <div>
          <CopyToClipboard text={copyText} onCopy={onCopy}>
            <Button color="primary" variant="outlined">
              复制键值
            </Button>
          </CopyToClipboard>
        </div>
        <div>
          <Table size="small" columns={columns} dataSource={result} pagination={false} />
        </div>
      </Space>
    </PageContainer>
  );
}

export default UrlParameterFormatPage;
