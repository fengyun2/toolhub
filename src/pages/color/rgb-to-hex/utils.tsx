import { generate, green, presetPalettes, red } from '@ant-design/colors';
import type { ColorPickerProps, GetProp } from 'antd';
import { theme } from 'antd';
import { createStyles } from 'antd-style';
import { TinyColor } from '@ctrl/tinycolor';

type Presets = Required<ColorPickerProps>['presets'][number];
type Color = GetProp<ColorPickerProps, 'value'>;
type ColorFormat = ColorPickerProps['format'];
type ColorType = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv' | 'hsva' | 'cmyk';

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors }));
const usePresets = () => {
  const { token } = theme.useToken();
  const presets = genPresets({ primary: generate(token.colorPrimary), red, green });
  return presets;
};

const useStyle = createStyles(({ css }) => {
  const styles = {
    wrapper: css`
      padding: 0;
    `,
    colorInput: css`
      flex: 1 !import;
    `,
    presetsLabel: css`
      line-height: 30px !important;
    `,
    presetsItem: css`
      font-size: 14px !important;
      line-height: 28px !important;
    `,
  };

  return styles;
});

const colorFormatFuncs = {
  rgb: 'toRgbString',
  hex: 'toHexString',
  hsb: 'toHsbString',
};

/**
 * 转为string格式的字符串
 * @param {Color} color
 * @param {ColorFormat} colorFormat
 * @returns string
 */
const getColorString = (color: Color, colorFormat?: ColorFormat): string => {
  if (typeof color === 'string') {
    return color;
  }
  if (!colorFormat) {
    return color as unknown as string;
  }
  const func = colorFormatFuncs[colorFormat];
  if (func && (color as any)[func]) {
    return (color as any)[func]?.();
  }
  return color as unknown as string;
};

// 主函数：根据颜色类型进行转换
const convertColor = (color: string, targetFormat: ColorType): string => {
  const tmpColor = new TinyColor(color);
  const newColor = tmpColor.clone();
  if (newColor.isValid) {
    switch (targetFormat) {
      case 'hex':
        return newColor.toHexString().toUpperCase();
      case 'rgb':
        return newColor.toRgbString();
      case 'rgba':
        return newColor.toRgbString();
      case 'hsv':
        return newColor.toHsvString();
      case 'hsl':
        return newColor.toHslString();
      case 'cmyk':
        return newColor.toCmykString();
      default:
        return color;
    }
  }
  return '';
};

export { usePresets, useStyle, getColorString, convertColor };
export type { ColorPickerProps, Color, ColorFormat, ColorType };
