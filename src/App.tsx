import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';

dayjs.locale('zh-cn');

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <Router />
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;