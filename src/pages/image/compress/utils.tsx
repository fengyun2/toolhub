// import pica from 'pica';
import compressorjs from 'compressorjs';
import imageCompression from 'browser-image-compression';
import { filesize } from 'filesize';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import type { UploadFile } from 'antd';
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ css, prefixCls }) => {
  const uploadPrefix = `${prefixCls}-upload`;
  const styles = {
    wrapper: css`
      padding: 20px;
    `,
    compressionRateWrapper: css`
      position: relative;
      display: flex;
      align-items: center;
    `,
    compressionRateSlider: css`
      display: inline-flex !important;
      width: 200px !important;
    `,
    uploadWrapper: css`
      .${uploadPrefix}-wrapper {
        .${uploadPrefix}-drag {
          .${uploadPrefix} {
            padding: 8px;
          }
          p.${uploadPrefix}-drag-icon {
            margin-bottom: 8px;
          }
          .${uploadPrefix}-text {
          }
          .${uploadPrefix}-hint {
            font-size: 12px;
            margin-bottom: 0;
          }
        }
      }
    `,
  };

  return styles;
});

const getBlobDimensions = (blob: Blob): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
};

/**
 * 压缩图片-Compressor.js
 * @param {UploadFile} file
 * @param {number} compressionRate 压缩率
 * @returns
 */
const compressedImageByCompressor = async (file: UploadFile, compressionRate: number): Promise<UploadFile> => {
  return new Promise((resolve, reject) => {
    new compressorjs(file as any as File, {
      quality: compressionRate / 100,
      success: (compressedBlob) => {
        const compressedFile: UploadFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        }) as any as UploadFile;
        compressedFile.uid = file.uid;
        resolve(compressedFile);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * 压缩图片2-browser-image-compression
 * @param {UploadFile} file
 * @param {number} compressionRate 压缩率
 * @returns
 */
const compressImageByImageCompression = async (file: UploadFile, compressionRate: number): Promise<UploadFile> => {
  return new Promise((resolve, reject) => {
    const options = {
      maxSizeMB: Infinity, // 不限制文件大小
      maxWidthOrHeight: Infinity, // 不改变图形尺寸
      initialQuality: compressionRate / 100, // 设置图像质量，范围是 0 到 1
      useWebWorker: true, // 使用 Web Worker 进行压缩
      libURL: '/js/browser-image-compression.js',
    };
    imageCompression(file as any as File, options)
      .then((compressedBlob) => {
        const compressedFile: UploadFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        }) as any as UploadFile;
        compressedFile.uid = file.uid;
        resolve(compressedFile);
      })
      .catch((error) => reject(error));
  });
};

/**
 * 文件大小格式化
 * @param {number} size 文件大小，字节
 * @returns
 */
const formatFileSize = (size: number): string => {
  return filesize(size);
};

/**
 * 单个文件下载
 * @param {File} file
 */
const downloadFile = (file: File) => {
  FileSaver.saveAs(file, file.name);
};

/**
 * 批量下载
 * @param {File[]} files 文件流
 * @param {string} fileName 下载的文件名
 */
const batchDownloadFile = (files: File[], fileName?: string) => {
  const saveFileName = fileName ?? `批量下载-${new Date().getTime()}`;
  const zip = new JSZip();
  const folder = zip.folder(saveFileName);
  files.forEach((file) => {
    folder?.file(file.name, file, { binary: true });
  });
  zip.generateAsync({ type: 'blob' }).then((content) => {
    FileSaver.saveAs(content, `${saveFileName}.zip`);
  });
};

/**
 * 检测是否是图片格式
 * @param {File} file
 * @returns
 */
const checkImage = (file: UploadFile | File): boolean => {
  return !!file.type?.startsWith('image/');
};

export {
  useStyle,
  getBlobDimensions,
  compressedImageByCompressor,
  compressImageByImageCompression,
  formatFileSize,
  downloadFile,
  batchDownloadFile,
  checkImage,
};
