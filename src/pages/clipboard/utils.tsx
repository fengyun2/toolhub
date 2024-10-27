import { createStyles } from 'antd-style';

const useStyle = createStyles(({ css }) => {
  const styles = {
    item: css`
      &:hover {
        background: #fafafa;
      }
    `,
    title: css`
      width: 100% !important;
    `,
  };

  return styles;
});

export {useStyle}