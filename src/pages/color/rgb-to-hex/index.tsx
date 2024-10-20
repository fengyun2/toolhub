/**
 * 颜色代码转换
 */
import { useState } from 'react';
import { ColorPicker, Button, Input, Tag, Row, Col, Divider, Typography, theme, Space, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PageContainer from 'components/page-container';
import { usePresets, useStyle, getColorString, convertColor } from './utils';
import type { ColorPickerProps, Color, ColorFormat, ColorType } from './utils';

interface ColorPresets {
  color: string;
  className?: string;
  onClick?: (color: string) => void;
}

const { Text } = Typography;
function RGBToHexPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const presets = usePresets();
  const { styles } = useStyle({ test: true });
  const [open, setOpen] = useState<boolean>(false);
  const [colorPicker] = useState<Color>(token.colorPrimary);
  const [colorInput, setColorInput] = useState<string>('');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('rgb');

  // 快速颜色选择预设值
  const colorPresets: ColorPresets[] = [
    {
      color: token.colorPrimary,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.colorSuccess,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.colorWarning,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.colorError,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.colorTextBase,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.yellow,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.gold,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.pink,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.cyan,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
    {
      color: token.purple,
      className: styles.presetsItem,
      onClick: (color: string) => colorPresetsChange(color),
    },
  ];

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

  const customPanelRender: ColorPickerProps['panelRender'] = (_, { components: { Picker, Presets } }) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider type="vertical" style={{ height: 'auto' }} />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  const onColorPickerChange = (value: Color) => {
    const colorString = getColorString(value, colorFormat);
    setColorInput(colorString);
  };

  const onCopy = (text: string, result: boolean) => {
    if (result) {
      success(`${text} 复制到剪贴板成功`);
    } else {
      error(`${text} 复制到剪贴板失败`);
    }
  };

  const colorSearchRender = () => {
    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setColorInput(newValue);
    };

    return (
      <Space.Compact block>
        <ColorPicker
          style={{ width: 62 }}
          value={colorPicker}
          format={colorFormat}
          presets={presets}
          open={open}
          onOpenChange={setOpen}
          onChange={onColorPickerChange}
          onFormatChange={setColorFormat}
          showText={() => <DownOutlined rotate={open ? 180 : 0} style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
          styles={{ popupOverlayInner: { width: 480 } }}
          panelRender={customPanelRender}
        />
        <Input value={colorInput} onChange={onValueChange} />
        {colorInput ? <Button style={{ width: 60, backgroundColor: colorInput }} /> : null}
      </Space.Compact>
    );
  };

  const colorPresetsChange = (color: string) => {
    setColorInput(color);
  };

  const colorPresetsRender = () => {
    return (
      <Space.Compact block>
        <Text className={styles.presetsLabel}>示例输入: &nbsp;&nbsp;</Text>
        {colorPresets.map((preset) => (
          <Tag key={preset.color} color={preset.color} className={preset.className} onClick={() => preset.onClick?.(preset.color)}>
            {preset.color}
          </Tag>
        ))}
      </Space.Compact>
    );
  };

  const colorInputRender = (colorType: ColorType) => {
    const addonBeforeText = colorType?.toUpperCase();
    const value = colorInput ? convertColor(colorInput, colorType) : '';
    return (
      <Space.Compact block>
        <Button style={{ width: 60 }}>{addonBeforeText}</Button>
        <Input value={value} readOnly />
        <CopyToClipboard text={value} onCopy={onCopy}>
          <Button color="primary" variant="outlined">
            复制
          </Button>
        </CopyToClipboard>
      </Space.Compact>
    );
  };

  return (
    <PageContainer header={{ title: '颜色代码转换' }}>
      {contextHolder}
      <div className={styles.wrapper}>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          {colorSearchRender()}
          {colorPresetsRender()}
          {colorInputRender('hex')}
          {colorInputRender('rgb')}
          {colorInputRender('rgba')}
          {colorInputRender('hsv')}
          {colorInputRender('hsl')}
          {colorInputRender('cmyk')}
        </Space>
      </div>
    </PageContainer>
  );
}

export default RGBToHexPage;
