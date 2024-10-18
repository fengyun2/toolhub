/**
 * 页容器
 */
import { useNavigate } from 'react-router-dom';
import { PageContainer as AntdPageContainer, PageContainerProps as AntdPageContainerProps } from '@ant-design/pro-components';

const defaultProps: Partial<AntdPageContainerProps> = {
  header: {
    title: '',
    breadcrumb: {},
  },
};

function PageContainer(props: AntdPageContainerProps) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1); // 传入-1表示后退

  const { header: headerProps, ...restProps } = props;
  const header: AntdPageContainerProps['header'] = { ...defaultProps.header, ...headerProps, onBack: headerProps?.onBack ?? goBack };
  return <AntdPageContainer {...restProps} header={header} />;
}

export default PageContainer;
