import { generate, green, presetPalettes, red } from '@ant-design/colors';
import type { ColorPickerProps, GetProp } from 'antd';
import { theme } from 'antd';
import { createStyles } from 'antd-style';
import { TinyColor } from '@ctrl/tinycolor';

type Presets = Required<ColorPickerProps>['presets'][number];
type Color = GetProp<ColorPickerProps, 'value'>;
type ColorFormat = ColorPickerProps['format'];

const genPresets = (presets = presetPalettes) => Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors }));
const usePresets = () => {
  const { token } = theme.useToken();
  const presets = genPresets({ primary: generate(token.colorPrimary), red, green });
  return presets;
};

const useStyle = createStyles(({ token, css, prefixCls }) => {
  const styles = {
    wrapper: css`
      padding: 0;
    `,
    colorInput: css`
      flex: 1 !import;
    `
  };

  return styles;
});

const colorFormatFuncs = {
  rgb: 'toRgbString',
  hex: 'toHexString',
  hsb: 'toHsbString',
}

/**
 * 转为string格式的字符串
 * @param {Color} color
 * @param {ColorFormat} colorFormat
 * @returns string
 */
const getColorString = (color: Color, colorFormat?: ColorFormat): string => {
  if (typeof color === 'string') {
    return color
  }
  if (!colorFormat) {
    return color as unknown as string
  }
  const func = colorFormatFuncs[colorFormat]
  if (func && (color as any)[func]) {
    return (color as any)[func]?.();
  }
  return color as unknown as string;
};

// 辅助函数：检查是否为有效的十六进制颜色
const isHexColor = (color: string): boolean => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

// 辅助函数：检查是否为有效的 RGB 颜色
const isRgbColor = (color: string): boolean => {
  const regex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = color.match(regex);
  if (!match) return false;

  const [r, g, b] = match.slice(1).map(Number);
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
};

// 辅助函数：检查是否为有效的 RGBA 颜色
const isRgbaColor = (color: string): boolean => {
  const regex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+(\.\d+)?)\s*\)$/;
  const match = color.match(regex);
  if (!match) return false;

  const [r, g, b, a] = match.slice(1).map(Number);
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1;
};

// 辅助函数：检查是否为有效的 HSB 颜色
const isHsbColor = (color: string): boolean => {
  const regex = /^hsb\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
  const match = color.match(regex);
  if (!match) return false;

  const [h, s, b] = match.slice(1).map(Number);
  return h >= 0 && h <= 360 && s >= 0 && s <= 100 && b >= 0 && b <= 100;
};


// 主函数：根据颜色类型进行转换
const convertColor = (color: string, targetFormat: ColorFormat | 'rgba'): string => {
  const tmpColor = new TinyColor(color);
  const newColor = tmpColor.clone();
  if (newColor.isValid) {
    switch (targetFormat) {
      case 'hex':
        return newColor.toHexString();
      case 'rgb':
        return newColor.toRgbString();
      case 'rgba':
        // 设置透明度为1
        newColor.setAlpha(1.00);
        return newColor.toRgbString();
      case 'hsb':
        return newColor.toHsvString();
      default:
        return color;
    }
  }
  return ''
};

export { usePresets, useStyle, getColorString, convertColor, isHexColor, isRgbColor, isRgbaColor, isHsbColor };
export type { ColorPickerProps, Color, ColorFormat };
