import { DatePicker, Button, Dropdown, Flex, Space } from 'antd';
import { BarChartOutlined, CalendarOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useState } from 'react';

type DateSelectionProps = {
  onDateSelected: (value: string | number) => void;
};

const DateSelection: React.FC<DateSelectionProps> = ({ onDateSelected }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [mode, setMode] = useState<'diario' | 'mensual'>('diario');

    const handleChange = (value: { toDate: () => Date } | null) => {
        if (value) {
            const jsDate = value.toDate();
            setDate(jsDate);
        } else {
            setDate(null);
        }
        setOpen(false);
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '1') setMode('diario');
        else if (e.key === '2') setMode('mensual');
    };

    const items: MenuProps['items'] = [
        {
            label: 'Diario',
            key: '1',
        },
        {
            label: 'Mensual',
            key: '2',
        },
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const formatDateText = () => {
        if (!date) return 'Seleccionar fecha';

        if (mode === 'diario') {
            return date.toLocaleDateString();
        } else {
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
        }
    };

    const handleAnalyzeClick = () => {
        if (!date) {
            console.log('No hay fecha seleccionada');
            return;
        }

        if (mode === 'diario') {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            onDateSelected(dateString);
        } else {
            const monthNumber = date.getMonth() + 1;
            onDateSelected(monthNumber);
        }
    };

  return (
    <Flex justify="space-between" style={{ width: '100%', borderBottom: '1px solid #e8e8e8', margin: 0 }}>
      <Flex style={{ padding: 24 }}>
        <Dropdown menu={menuProps}>
          <Button style={{ width: '100px'}}>
            <Space style={{ fontSize: 12 }}>
              {mode === 'diario' ? 'Diario' : 'Mensual'}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>

        <Button
          style={{ marginLeft: 16, fontSize: 12 }}
          onClick={() => setOpen(true)}
        >
          {formatDateText()}
          <CalendarOutlined style={{ fontSize: 12, marginLeft: 8 }} />
        </Button>

        <DatePicker
            open={open}
            onOpenChange={(o) => setOpen(o)}
            onChange={handleChange}
            picker={mode === 'mensual' ? 'month' : undefined}
            style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                width: 0,
                height: 0,
            }}
            disabledDate={(current) => {
            if (!current) return false;

            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();

            if (mode === 'mensual') {
                
                if (current.year() !== currentYear) return true;
                
                if (current.month() > currentMonth) return true;
                return false;
            } else {
                
                const startOfYear = new Date(currentYear, 0, 1).getTime();
                const currentTime = current.valueOf();

                if (currentTime < startOfYear) return true;
                if (currentTime > now.getTime()) return true;
                return false;
            }
            }}
        />
      </Flex>

      <Flex justify="end" style={{ padding: 24 }}>
        <Button type="primary" style={{ marginBottom: 16, fontSize: '12px' }} onClick={handleAnalyzeClick}>
            <BarChartOutlined style={{ fontSize: 12, marginRight: 4 }} />
            {mode === 'diario' ? 'Analizar día' : 'Analizar mes'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default DateSelection;
