import React from 'react';
import { Calendar as AntdCalendar, Badge, Button, Select, Space } from 'antd';
import type { CalendarProps, SelectProps } from 'antd';
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
  const [selectedHoliday, setSelectedHoliday] = React.useState<Dayjs>();

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

  const headerYearRender: CalendarProps<Dayjs>['headerRender'] = ({ value, onChange }) => {
    const year = value.year();
    const minYear = year - 10;
    const maxYear = year + 10;
    const options = [];
    for (let i = minYear; i <= maxYear; i++) {
      options.push({
        value: i,
        label: `${i}年`,
      });
    }

    const next = () => {
      const newValue = value.clone().add(1, 'year');
      onChange(newValue);
    };
    const prev = () => {
      const newValue = value.clone().subtract(1, 'year');
      onChange(newValue);
    };

    return (
      <span>
        <Button size="small" color="primary" variant="filled" icon={<LeftOutlined />} disabled={year <= minYear} onClick={() => prev()} />
        <Select
          size="small"
          variant="borderless"
          value={year}
          popupMatchSelectWidth={false}
          options={options}
          onChange={(newYear) => {
            const now = value.clone().year(newYear);
            onChange(now);
          }}
        />
        <Button
          size="small"
          color="primary"
          variant="filled"
          icon={<RightOutlined />}
          disabled={year >= maxYear}
          onClick={() => next()}
        />
      </span>
    );
  };

  const headerMonthRender: CalendarProps<Dayjs>['headerRender'] = ({ value, onChange }) => {
    let current = value.clone();
    const month = value.month();
    const localeData = value.localeData();
    const minMonth = 0;
    const maxMonth = 12;
    const months = [];
    for (let i = minMonth; i < maxMonth; i++) {
      current = current.month(i);
      months.push(localeData.monthsShort(current));
    }
    const options = [];
    for (let i = minMonth; i < maxMonth; i++) {
      current = current.month(i);
      options.push({
        value: i,
        label: months[i],
      });
    }

    const next = () => {
      const newValue = value.clone().add(1, 'months');
      onChange(newValue);
    };
    const prev = () => {
      const newValue = value.clone().subtract(1, 'months');
      onChange(newValue);
    };

    return (
      <span>
        <Button
          size="small"
          color="primary"
          variant="filled"
          icon={<LeftOutlined />}
          disabled={month <= minMonth}
          onClick={() => prev()}
        />
        <Select
          size="small"
          variant="borderless"
          value={month}
          popupMatchSelectWidth={false}
          options={options}
          onChange={(newMonth) => {
            const now = value.clone().month(newMonth);
            onChange(now);
          }}
        />
        <Button
          size="small"
          color="primary"
          variant="filled"
          icon={<RightOutlined />}
          disabled={month >= maxMonth}
          onClick={() => next()}
        />
      </span>
    );
  };

  const headerHolidayRender: CalendarProps<Dayjs>['headerRender'] = ({ value, onChange }) => {
    const year = value.year();
    const options: SelectProps['options'] = [];
    const holidays = HolidayUtil.getHolidays(year);
    holidays.forEach((h) => {
      if (h.getTarget() === h.getDay()) {
        options.push({
          value: h.getDay(),
          label: h.getName(),
        });
      }
    });
    // console.log(selectedHoliday?.format('YYYY-MM-DD') , ' headerHolidayRender ===>')
    const selectedHolidayOfDay = selectedHoliday ? selectedHoliday.format('YYYY-MM-DD') : '';
    return (
      <Select
        size="small"
        variant="borderless"
        value={selectedHolidayOfDay}
        popupMatchSelectWidth={false}
        options={options}
        placeholder="假日安排"
        onChange={(newDate: string) => {
          const now = dayjs(newDate);
          onChange(now);
          console.log(now.get('date'), ' 逗比');
          setSelectedHoliday(now);
        }}
      />
    );
  };

  const headerTodayRender: CalendarProps<Dayjs>['headerRender'] = ({ onChange }) => {
    return (
      <div className={styles.header}>
        <Button
          size="small"
          color="primary"
          variant="filled"
          onClick={() => {
            const now = dayjs();
            onChange(now);
          }}
        >
          返回今天
        </Button>
      </div>
    );
  };

  const headerRender: CalendarProps<Dayjs>['headerRender'] = ({ value, type, onChange }) => {
    return (
      <div className={styles.header}>
        <Space>
          {headerYearRender({ value, onChange })}
          {headerMonthRender({ value, onChange })}
          {headerHolidayRender({ value, onChange })}
          {headerTodayRender({ onChange })}
        </Space>
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
