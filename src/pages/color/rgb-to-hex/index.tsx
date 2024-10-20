/**
 * 颜色代码转换
 */
import { useState } from 'react';
import { ColorPicker, Button, Input, Form, Row, Col, Divider, theme, Space, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PageContainer from 'components/page-container';
import { usePresets, useStyle, getColorString, convertColor } from './utils';
import type { ColorPickerProps, Color, ColorFormat } from './utils';

function RGBToHexPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const presets = usePresets();
  const { styles } = useStyle({ test: true });
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [colorPicker, setColorPicker] = useState<Color>(token.colorPrimary);
  const [colorInput, setColorInput] = useState<string>('');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('rgb');
  const [colorHex, setColorHex] = useState<string>('');
  const [colorRgb, setColorRgb] = useState<string>('');
  const [colorRgba, setColorRgba] = useState<string>('');
  const [colorHsb, setColorHsb] = useState<string>('');

  // const initialValues = {
  //   colorPicker: token.colorPrimary,
  // };

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

  const convertAllTypeColor = (color: string) => {
    const innerHexValue = convertColor(color, 'hex');
    const innerRgbValue = convertColor(color, 'rgb');
    const innerRgbaValue = convertColor(color, 'rgba');
    const innerHsbValue = convertColor(color, 'hsb');
    setColorHex(innerHexValue);
    setColorRgb(innerRgbValue);
    setColorRgba(innerRgbaValue);
    setColorHsb(innerHsbValue);
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
    // console.log(colorString, ' colorString ===>');
    // form.setFieldValue('colorInput', colorString);
    setColorInput(colorString);
    convertAllTypeColor(colorString);
  };

  // const onFinish = (values: any) => {
  //   console.log('Success:', values);
  // };

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
      convertAllTypeColor(newValue);
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
      </Space.Compact>
    );
  };

  const colorInputRender = (color: ColorFormat | 'rgba') => {
    const addonBeforeText = color?.toUpperCase();
    let value = '';
    if (color === 'hex') {
      value = colorHex;
    } else if (color === 'rgb') {
      value = colorRgb;
    } else if (color === 'rgba') {
      value = colorRgba;
    } else if (color === 'hsb') {
      value = colorHsb;
    }
    // const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const newValue = e.target.value;
    //   if (color === 'hex') {
    //     setColorHex(newValue)
    //     const innerRgbValue = convertColor(newValue, 'rgb')
    //     const innerRgbaValue = convertColor(newValue, 'rgba')
    //     const innerHsbValue = convertColor(newValue, 'hsb')
    //     setColorRgb(innerRgbValue)
    //     setColorRgba(innerRgbaValue)
    //     setColorHsb(innerHsbValue)
    //   } else if (color === 'rgb') {
    //     setColorRgb(newValue)
    //     const innerHexValue = convertColor(newValue, 'hex')
    //     const innerRgbaValue = convertColor(newValue, 'rgba')
    //     const innerHsbValue = convertColor(newValue, 'hsb')
    //     setColorHex(innerHexValue)
    //     setColorRgba(innerRgbaValue)
    //     setColorHsb(innerHsbValue)
    //   } else if (color === 'rgba') {
    //     setColorRgba(newValue)
    //     const innerHexValue = convertColor(newValue, 'hex')
    //     const innerRgbValue = convertColor(newValue, 'rgb')
    //     const innerHsbValue = convertColor(newValue, 'hsb')
    //     setColorHex(innerHexValue)
    //     setColorRgb(innerRgbValue)
    //     setColorHsb(innerHsbValue)
    //   } else if (color === 'hsb') {
    //     setColorHsb(newValue)
    //     const innerHexValue = convertColor(newValue, 'hex')
    //     const innerRgbValue = convertColor(newValue, 'rgb')
    //     const innerRgbaValue = convertColor(newValue, 'rgba')
    //     setColorHex(innerHexValue)
    //     setColorRgb(innerRgbValue)
    //     setColorRgba(innerRgbaValue)
    //   }
    // };
    return (
      <Space.Compact block>
        <Button style={{ width: 60 }}>{addonBeforeText}</Button>
        <Input value={value} readOnly />
        {/* <Input value={value} readOnly onChange={onValueChange} /> */}
        {/* <Button color="primary" variant="outlined">
          转换
        </Button> */}
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
          {/* <Form layout="inline" form={form} name="search" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item name="colorPicker" label="">
              <ColorPicker
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
            </Form.Item>
            <Form.Item name="colorInput" label="" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Form> */}
          {colorSearchRender()}
          {colorInputRender('hex')}
          {colorInputRender('rgb')}
          {colorInputRender('rgba')}
          {colorInputRender('hsb')}
        </Space>
      </div>
    </PageContainer>
  );
}

export default RGBToHexPage;
