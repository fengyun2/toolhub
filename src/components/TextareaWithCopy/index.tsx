import { useState } from 'react';
import { Input, Button, message } from 'antd';
import type { TextAreaProps } from 'antd/lib/input';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStyle } from './util';

// interface TextareaWithCopyProps extends Omit<TextAreaProps, 'onChange'> {
interface TextareaWithCopyProps extends TextAreaProps {
  value?: string;
  // onChange?: (value: string) => void;
}

const TextareaWithCopy = ({ value: formValue, onChange: formChange, placeholder }: TextareaWithCopyProps) => {
  const { styles } = useStyle({ test: true });
  const [messageApi, contextHolder] = message.useMessage();
  // 如果组件被 Form 包裹，则使用 Form 的 value，否则使用内部状态
  const [value, setValue] = useState(formValue);

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

  const handleChange: TextAreaProps['onChange'] = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    // 如果组件被Form包裹，则调用Form的onChange
    if (formChange) {
      formChange(e);
    }
  };

  const onCopy = (text: string, result: boolean) => {
    if (result) {
      console.log(`${text} 复制到剪贴板成功`);
      success('复制成功');
    } else {
      error('复制失败');
    }
  };

  return (
    <div className={styles.wrapper}>
      {contextHolder}
      <Input.TextArea value={value} onChange={handleChange} autoSize={{ minRows: 1, maxRows: 60 }} placeholder={placeholder} />
      <CopyToClipboard text={value!} onCopy={onCopy}>
        <Button color="primary" variant="filled" size="small" className={styles.copyBtn}>
          复制
        </Button>
      </CopyToClipboard>
    </div>
  );
};

export default TextareaWithCopy;
