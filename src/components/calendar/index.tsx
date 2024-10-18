import React from 'react';
import { Calendar as AntdCalendar, Badge } from 'antd';
import type { CalendarProps } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { HolidayUtil, Lunar } from 'lunar-typescript';
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

  const cellRender: CalendarProps<Dayjs>['fullCellRender'] = (date, info) => {
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

    if (info.type === 'date') {
      return React.cloneElement(info.originNode, {
        ...info.originNode.props,
        className: classNames(styles.dateCell, {
          [styles.current]: selectDate.isSame(date, 'date'),
          [styles.today]: date.isSame(dayjs(), 'date'),
        }),
        children: (
          <div className={styles.text}>
            <Badge count={badgeCount} offset={[16, 3]} size="small" className={badgeClasses}>
              <span
                className={classNames({
                  [styles.weekend]: isWeekend,
                  gray: !panelDateDate.isSame(date, 'month'),
                })}
              >
                {date.get('date')}
              </span>
              {info.type === 'date' && <div className={styles.lunar}>{displayHoliday || solarTerm || lunar}</div>}
            </Badge>
          </div>
        ),
      });
    }

    if (info.type === 'month') {
      // Due to the fact that a solar month is part of the lunar month X and part of the lunar month X+1,
      // when rendering a month, always take X as the lunar month of the month
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
    }
  };

  return (
    <div className={styles.wrapper}>
      <AntdCalendar fullCellRender={cellRender} fullscreen={false} onPanelChange={onPanelChange} onSelect={onDateChange} />
    </div>
  );
};

export default Calendar;
