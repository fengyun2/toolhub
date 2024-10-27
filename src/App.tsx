import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
import Router from './router';
import './plugins/clipboard'

dayjs.locale('zh-cn');

function App() {
  return (
    <BrowserRouter>
      <StyleProvider hashPriority='high' transformers={[legacyLogicalPropertiesTransformer]}>
        <ConfigProvider locale={zhCN}>
          <Router />
        </ConfigProvider>
      </StyleProvider>
    </BrowserRouter>
  );
}

export default App;
