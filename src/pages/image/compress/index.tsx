/**
 * 图片压缩
 */
import { useState, useContext, useEffect } from 'react';
import type { UploadFile, UploadProps, TableProps, SelectProps } from 'antd';
import {
  Upload,
  Button,
  Slider,
  Space,
  Typography,
  Table,
  message,
  Tag,
  theme,
  Image,
  Modal,
  Row,
  Col,
  ConfigProvider,
  Select,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Big from 'big.js';
import PageContainer from 'components/page-container';
import {
  useStyle,
  compressedImageByCompressor,
  compressImageByImageCompression,
  formatFileSize,
  downloadFile,
  batchDownloadFile,
  checkImage,
} from './utils';

const { Text } = Typography;
const { Dragger } = Upload;

interface DataType extends UploadFile {
  file: UploadFile;
  compressedFile: UploadFile;
  uid: string;
  name: string;
  uncompressedFileSize: string;
  compressedFileSize: string;
  optimizationRate: string;
}

type CompressedMethod = 'browser-image-compression' | 'Compressor';
const compressedMethodOptions: SelectProps<CompressedMethod>['options'] = [
  {
    label: 'Browser Image Compression',
    value: 'browser-image-compression',
  },
  {
    label: 'Compressor.js',
    value: 'Compressor',
  },
];
const compressedImageFuncs = {
  'browser-image-compression': compressImageByImageCompression,
  Compressor: compressedImageByCompressor,
};

function ImageCompressPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const { styles } = useStyle({ test: true });
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const uploadPrefixCls = getPrefixCls('upload');
  const [compressedMethod, setCompressedMethod] = useState<CompressedMethod>('browser-image-compression');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [compressedFileList, setCompressedFileList] = useState<UploadFile[]>([]);
  const [compressionRate, setCompressionRate] = useState<number>(80);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareModalFile, setCompareModalFile] = useState<UploadFile>();
  const [compareModalCompressedFile, setCompareModalCompressedFile] = useState<UploadFile>();

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
      ellipsis: true,
      width: 200,
    },
    {
      title: '压缩后大小',
      dataIndex: 'compressedFileSize',
      key: 'compressedFileSize',
      ellipsis: true,
      width: 200,
    },
    {
      title: '压缩率',
      dataIndex: 'optimizationRate',
      key: 'optimizationRate',
      ellipsis: true,
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => {
              setCompareModalFile(record.file);
              setCompareModalCompressedFile(record.compressedFile);
              setIsCompareModalOpen(true);
            }}
          >
            比较
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              downloadFile(record.compressedFile as File);
            }}
          >
            下载
          </Button>
        </Space>
      ),
    },
  ];
  const [data, setData] = useState<DataType[]>([]);

  async function startCompressedImage(file: UploadFile, nextCompressionRate?: number) {
    const compressedImageFunc = compressedImageFuncs[compressedMethod];
    const compressedFile = await compressedImageFunc(file, nextCompressionRate ?? compressionRate);
    setCompressedFileList((prevCompressedFileList) => [...prevCompressedFileList, compressedFile]);
    // 使用big.js进行计算
    const fileSize = new Big(file.size || 0);
    const compressedFileSize = new Big(compressedFile.size || 0);
    const optimizationRate = fileSize.minus(compressedFileSize).div(fileSize).times(100).toFixed(2) + '%';
    const newCompressionFile: DataType = {
      file,
      compressedFile,
      uid: file.uid,
      name: file.name,
      uncompressedFileSize: formatFileSize(file.size || 0),
      compressedFileSize: formatFileSize(compressedFile.size || 0),
      optimizationRate,
    };
    setData((prevData) => [...prevData, newCompressionFile]);
  }

  /**
   * 重新执行压缩
   * @param {number} nextCompressionRate 压缩率 0-100
   */
  async function restartCompressedImageList(nextCompressionRate?: number) {
    // 清空文件列表
    setData([]);
    setCompressedFileList([]);
    fileList.forEach((file) => startCompressedImage(file, nextCompressionRate));
  }

  function onChangeCompressionRate(nextCompressionRate: number) {
    setCompressionRate(nextCompressionRate);
  }

  function onChangeCompleteCompressionRate(newCompressionRate: number) {
    restartCompressedImageList(newCompressionRate);
    // 清空文件列表
    // setData([]);
    // setCompressedFileList([]);
    // fileList.forEach((file) => startCompressedImage(file, newCompressionRate));
  }

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: async (file) => {
      try {
        const isImage = checkImage(file);
        if (!isImage) {
          error('只能上传图片文件!');
          return false;
        }
        setFileList((prevFileList) => [...prevFileList, file]);
        startCompressedImage(file);
        return false;
      } catch (error) {
        return false;
      }
    },
    fileList,
    showUploadList: false,
    multiple: true,
    accept: '.png,.jpg,.jpeg,.webp,.bmp',
  };

  const handleCompareModalOk = () => {
    setIsCompareModalOpen(false);
  };

  const handleCompareModalCancel = () => {
    setIsCompareModalOpen(false);
  };

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            setFileList((prevFileList) => [...prevFileList, file as any as UploadFile]);
            startCompressedImage(file as any as UploadFile);
          }
          // 只处理第一个图像文件
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <PageContainer header={{ title: '图片压缩' }}>
      {contextHolder}
      <div className={styles.wrapper}>
        <Space direction="vertical">
          {/* <Upload {...uploadProps}>
            <Button type="primary">选择图片</Button>
          </Upload> */}
          <div className={styles.uploadWrapper}>
            <Dragger {...uploadProps}>
              <p className={`${uploadPrefixCls}-drag-icon`}>
                <InboxOutlined />
              </p>
              <p className={`${uploadPrefixCls}-text`}>将图片拖到此处，或点击选择图片</p>
              <p className={`${uploadPrefixCls}-hint`}>支持拖拽上传，支持批量上传（格式：png、jpg、jpeg、webp、bmp）</p>
            </Dragger>
          </div>
          <div className={styles.compressionRateWrapper}>
            <Text>压缩率: &nbsp;&nbsp;</Text>
            <Slider
              className={styles.compressionRateSlider}
              min={0}
              max={100}
              value={compressionRate}
              onChange={onChangeCompressionRate}
              onChangeComplete={onChangeCompleteCompressionRate}
            />
            <Tag color={token.colorSuccess}>{compressionRate}%</Tag>
            <Text>（压缩率越大，压缩后的图片越小，同时压缩后的图片越模糊）</Text>
          </div>
          <div>
            <span>
              <Text>压缩方法: &nbsp;&nbsp;</Text>
              <Select
                size="small"
                variant="borderless"
                popupMatchSelectWidth={false}
                value={compressedMethod}
                options={compressedMethodOptions}
                onChange={(value) => {
                  setCompressedMethod(value);
                  restartCompressedImageList();
                }}
              />
            </span>
            {compressedFileList.length > 0 && (
              <Button type="primary" onClick={() => batchDownloadFile(compressedFileList as any as File[])}>
                批量下载
              </Button>
            )}
            <Button
              danger
              onClick={() => {
                // 清空文件列表
                setData([]);
                setFileList([])
                setCompressedFileList([]);
              }}
            >
              全部清空
            </Button>
          </div>

          <Table<DataType> rowKey="uid" dataSource={data} columns={columns} size="small" pagination={false} />
        </Space>
      </div>
      {isCompareModalOpen && (
        <Modal
          title="图片对比"
          width="100%"
          open={isCompareModalOpen}
          onOk={handleCompareModalOk}
          onCancel={handleCompareModalCancel}
        >
          <Row justify="space-between" wrap={false}>
            <Col span={12}>
              <Image
                key="original"
                src={URL.createObjectURL(compareModalFile as any as File)}
                alt="原始图片"
                preview={false}
              />
            </Col>
            <Col span={12}>
              <Image
                key="compressed"
                src={URL.createObjectURL(compareModalCompressedFile as any as File)}
                alt="压缩图片"
                preview={false}
              />
            </Col>
          </Row>
        </Modal>
      )}
    </PageContainer>
  );
}

export default ImageCompressPage;
