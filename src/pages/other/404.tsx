import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

function NotFoundPage() {
  const navigate = useNavigate();
  const goHome = () => navigate('/');
  return (
    <Result
      status="404"
      subTitle="抱歉，您当前访问的页面不存在。"
      extra={[
        <Button key="again" style={{ margin: '0 16px' }}>
          再试一次
        </Button>,
        <Button key="back" type="primary" onClick={goHome}>
          返回首页
        </Button>,
      ]}
    />
  );
}

export default NotFoundPage;
