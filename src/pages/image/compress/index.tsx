/**
 * 图片压缩
 */
import { useState } from 'react';
import type { UploadFile, UploadProps, TableProps } from 'antd';
import { Upload, Button, Slider, Space, Typography, Table, message, Tag, theme } from 'antd';
import PageContainer from 'components/page-container';
import { useStyle, compressedImage } from './utils';

const { Text } = Typography;

interface DataType {
  uid: string;
  name: string;
  uncompressedFileSize: string;
  compressedFileSize: string;
  optimizationRate: string;
}

function ImageCompressPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const { styles } = useStyle({ test: true });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [compressedFileList, setCompressedFileList] = useState<UploadFile[]>([]);
  const [compressionRate, setCompressionRate] = useState<number>(80);

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message || '复制失败',
    });
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '未压缩大小',
      dataIndex: 'uncompressedFileSize',
      key: 'uncompressedFileSize',
    },
    {
      title: '压缩后大小',
      dataIndex: 'compressedFileSize',
      key: 'compressedFileSize',
    },
    {
      title: '压缩率',
      dataIndex: 'optimizationRate',
      key: 'optimizationRate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">
            比较
          </Button>
          <Button type="link" size="small">
            下载
          </Button>
        </Space>
      ),
    },
  ];
  const [data, setData] = useState<DataType[]>([]);

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file } = options;
    try {
      const compressedFile = await compressedImage(file, compressionRate);
      console.log(compressionRate, compressedFile, ' compressedFile ===>');
      setCompressedFileList((prevFileList) => [...prevFileList, compressedFile]);
      setData((prevData) => [...prevData, file]);
    } catch (error) {
      console.error('压缩失败:', error);
    }

    // console.log(options, ' customRequest options ===>');
  };

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log(file, 'beforeUpload ===>');
      const isJPGorPNGorJPEGorWEBPorBMP =
        file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/bmp';
      if (!isJPGorPNGorJPEGorWEBPorBMP) {
        error('只能上传图片文件!');
        return false;
      }
      setFileList((prevFileList) => [...prevFileList, file]);
      return isJPGorPNGorJPEGorWEBPorBMP;
    },
    customRequest,
    fileList,
    multiple: true,
    accept: '.png,.jpg,.jpeg,.webp,.bmp',
  };

  console.log(fileList, ' fileList ====>');

  return (
    <PageContainer header={{ title: '图片压缩' }}>
      {contextHolder}
      <div className={styles.wrapper}>
        <Space direction="vertical">
          <Upload {...uploadProps}>
            <Button type="primary">选择图片</Button>
          </Upload>
          <div className={styles.compressionRateWrapper}>
            <Text>压缩率: &nbsp;&nbsp;</Text>
            <Slider className={styles.compressionRateSlider} min={0} max={100} value={compressionRate} onChange={setCompressionRate} />
            <Tag color={token.colorSuccess}>{compressionRate}%</Tag>
            <Text>（压缩率越大，压缩后的图片越小，同时压缩后的图片越模糊）</Text>
          </div>
          <Table<DataType> rowKey="uid" dataSource={data} columns={columns} size="small" pagination={false} />
          {/* <div style={{ marginTop: 16 }}>
        <h3>压缩后的图片:</h3>
        {compressedFiles.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt="compressed"
            style={{ width: '100px', height: '100px', margin: '5px' }}
          />
        ))}
      </div> */}
        </Space>
      </div>
    </PageContainer>
  );
}

export default ImageCompressPage;
