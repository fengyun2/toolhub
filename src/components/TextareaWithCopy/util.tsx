import { createStyles } from 'antd-style';

const useStyle = createStyles(({ css, prefixCls }) => {
  const btnPrefix = `${prefixCls}-btn`;
  const styles = {
    wrapper: css`
      position: relative;
      .${btnPrefix} {
        display: none;
      }
      &:hover {
        .${btnPrefix} {
          display: inline-flex;
        }
      }
    `,
    copyBtn: css`
      position: absolute !important;
      top: 3px;
      right: 10px;
      z-index: 100;
    `,
  };

  return styles;
});


export { useStyle };
