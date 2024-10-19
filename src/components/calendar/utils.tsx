import { createStyles } from 'antd-style';

const useStyle = createStyles(({ token, css, cx, prefixCls }) => {
  const lunar = css`
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
  `;
  const weekend = css`
    color: ${token.colorError};
    &.gray {
      opacity: 0.4;
    }
  `;

  const gray = css`
    opacity: 0.4;
  `

  // 是否调休
  const isRestAdjustment = css`
    .${prefixCls}-badge-count {
      color: ${token.colorPrimary} !important;
      background: transparent !important;
      box-shadow: none !important;
    }
  `;

  // 是否加班
  const isOvertime = css`
    .${prefixCls}-badge-count {
      color: ${token.colorWarning} !important;
      background: transparent !important;
      box-shadow: none !important;
    }
  `;

  const header = css`
    display: flex;
    flex-direction: row;
    align-item: center;
    padding-bottom: 5px;
  `;

  const styles = {
    wrapper: css`
      width: 450px;
      border: 2px solid ${token.colorPrimary};
      padding: 5px;
      .${prefixCls}-picker-calendar {
        .${prefixCls}-picker-date-panel .${prefixCls}-picker-content th {
          padding-bottom: ${token.paddingXS}px;
        }
        .${prefixCls}-picker-cell {
          border-top: 1px solid ${token.colorBorderSecondary};
        }
      }
    `,
    dateCell: css`
      position: relative;
      &:before {
        content: '';
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 40px;
        height: 40px;
        background: transparent;
        transition: background-color 300ms;
        border-radius: 100%;
        border: 1px solid transparent;
        box-sizing: border-box;
      }
      &:hover:before {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    today: css`
      &:before {
        border: 1px solid ${token.colorPrimary};
      }
    `,
    text: css`
      position: relative;
      z-index: 1;
    `,
    lunar,
    current: css`
      color: ${token.colorTextLightSolid};
      &:before {
        background: ${token.colorPrimary};
      }
      &:hover:before {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
      .${cx(lunar)} {
        color: ${token.colorTextLightSolid};
        opacity: 0.9;
      }
      .${cx(weekend)} {
        color: ${token.colorTextLightSolid};
      }
    `,
    monthCell: css`
      width: 120px;
      color: ${token.colorTextBase};
      border-radius: ${token.borderRadiusOuter}px;
      padding: 5px 0;
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    monthCellCurrent: css`
      color: ${token.colorTextLightSolid};
      background: ${token.colorPrimary};
      &:hover {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
    `,
    weekend,
    isRestAdjustment,
    isOvertime,
    header,
    gray,
  };

  return styles;
});

export { useStyle };
