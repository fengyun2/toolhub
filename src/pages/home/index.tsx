import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'antd';

interface BlockItem {
  name: string;
  title: string;
  icon?: string;
  path: string;
}

const blocks: BlockItem[] = [
  {
    name: 'calendar',
    title: '万年历',
    path: '/calendar',
  },
  {
    name: 'about',
    title: '关于',
    path: '/about',
  },
  {
    name: 'rgb-to-hex',
    title: '颜色代码转换',
    path: '/color/rgb-to-hex',
  },
  {
    name: 'image-compress',
    title: '图片压缩',
    path: '/image/compress',
  }
];

function HomePage() {
  const navigate = useNavigate();
  const goto = (path: string) => () => navigate(path);

  return (
    <Row gutter={[12, 12]}>
      {blocks.map((block) => (
        <Col key={block.name} xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <Card title={block.title} size="small">
            <Button type="primary" onClick={goto(block.path)}>
              进入
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default HomePage;
