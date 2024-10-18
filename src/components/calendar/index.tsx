import React from 'react';
import { Calendar as AntdCalendar, Badge, Button } from 'antd';
import type { CalendarProps } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { HolidayUtil, Lunar } from 'lunar-typescript';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useStyle } from './utils';

const Calendar: React.FC = () => {
  const { styles } = useStyle({ test: true });

  const [selectDate, setSelectDate] = React.useState<Dayjs>(dayjs());
  const [panelDateDate, setPanelDate] = React.useState<Dayjs>(dayjs());

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
    setPanelDate(value);
  };

  const onDateChange: CalendarProps<Dayjs>['onSelect'] = (value, selectInfo) => {
    if (selectInfo.source === 'date') {
      setSelectDate(value);
    }
  };

  const monthCellRender = (date: Dayjs) => {
    const d2 = Lunar.fromDate(new Date(date.get('year'), date.get('month')));
    const month = d2.getMonthInChinese();
    return (
      <div
        className={classNames(styles.monthCell, {
          [styles.monthCellCurrent]: selectDate.isSame(date, 'month'),
        })}
      >
        {date.get('month') + 1}月（{month}月）
      </div>
    );
  };
  const dateCellRender: CalendarProps<Dayjs>['fullCellRender'] = (date, info) => {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const isWeekend = date.day() === 6 || date.day() === 0;
    const h = HolidayUtil.getHoliday(date.get('year'), date.get('month') + 1, date.get('date'));
    const displayHoliday = h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
    const badgeCount = h?.isWork() !== undefined ? (h?.isWork() ? '班' : '休') : undefined;
    const badgeClasses = classNames({
      [styles.isRestAdjustment]: h?.isWork() === false,
      [styles.isOvertime]: h?.isWork(),
    });

    return React.cloneElement(info.originNode, {
      ...info.originNode.props,
      className: classNames(styles.dateCell, {
        [styles.current]: selectDate.isSame(date, 'date'),
        [styles.today]: date.isSame(dayjs(), 'date'),
      }),
      children: (
        <div className={styles.text}>
          <Badge count={badgeCount} offset={[10, 1]} size="small" className={badgeClasses}>
            <span
              className={classNames({
                [styles.weekend]: isWeekend,
                [styles.gray]: !panelDateDate.isSame(date, 'month'),
              })}
            >
              {date.get('date')}
            </span>
            {info.type === 'date' && (
              <div
                className={classNames(styles.lunar, {
                  [styles.gray]: !panelDateDate.isSame(date, 'month'),
                })}
              >
                {displayHoliday || solarTerm || lunar}
              </div>
            )}
          </Badge>
        </div>
      ),
    });
  };

  const cellRender: CalendarProps<Dayjs>['fullCellRender'] = (date, info) => {
    if (info.type === 'date') return dateCellRender(date, info);
    if (info.type === 'month') return monthCellRender(date);
    return info.originNode;
  };

  const headerRender: CalendarProps<Dayjs>['headerRender'] = ({ value, type, onChange }) => {
    const currentYear = value.format('YYYY年');
    const currentMonth = value.format('M月');
    const next = () => {
      const newValue = value.clone().add(1, type === 'year' ? 'year' : 'months');
      onChange(newValue);
    };
    const prev = () => {
      const newValue = value.clone().subtract(1, type === 'year' ? 'year' : 'months');
      onChange(newValue);
    };

    return (
      <div className={styles.header}>
        <Button size="small" type="text" icon={<LeftOutlined />} onClick={() => prev()} />
        <div>
          <span>{currentYear} </span>
          <span>{currentMonth}</span>
        </div>
        <Button size="small" type="text" icon={<RightOutlined />} onClick={() => next()} />
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <AntdCalendar
        fullCellRender={cellRender}
        fullscreen={false}
        onPanelChange={onPanelChange}
        onSelect={onDateChange}
        headerRender={headerRender}
      />
    </div>
  );
};

export default Calendar;
