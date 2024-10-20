// import pica from 'pica';
import compressorjs from 'compressorjs'
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ css }) => {
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

const compressedImage = async (file: File, compressionRate: number) => {
  return new Promise((resolve, reject) => {
    new compressorjs(file, {
      quality: compressionRate / 100,
      success: (compressedBlob) => {
        const compressedFile = new File(
          [compressedBlob],
          file.name,
          {
            uid: file.uid,
            type: file.type,
            lastModified: Date.now(),
          }
        );
        resolve(compressedFile);
      },
      error: error => {
        reject(error)
      }
    });
  })
  // const reader = new FileReader();
  // const blob = await new Promise((resolve) => {
  //   reader.onloadend = () => resolve(reader.result as Blob);
  //   reader.readAsDataURL(file);
  // });

  // const { width, height } = await getBlobDimensions(blob);

  // return new Promise((resolve) => {
  //   pica()
  //     .resize(blob, {
  //       quality: compressionRate / 100, // 百分比转为小数
  //       unsharpAmount: 80,
  //       unsharpRadius: 0.5,
  //       unsharpThreshold: 1,
  //       transferable: true,
  //       // Transform options
  //       transform: {
  //         width: (width * (100 - compressionRate)) / 100,
  //         height: (height * (100 - compressionRate)) / 100,
  //       },
  //     })
  //     .then((compressedBlob: any) => {
  //       resolve(compressedBlob);
  //     });
  // });
};

export { useStyle, getBlobDimensions, compressedImage };
