import React from 'react';
import { Input, Select, Space } from 'antd';

interface ActivityLogFiltersProps {
  searchText: string;
  filterEntityType: string;
  onSearch: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const ActivityLogFilters: React.FC<ActivityLogFiltersProps> = ({
  searchText,
  filterEntityType,
  onSearch,
  onFilterChange,
}) => {
  return (
    <Space>
      <Input.Search
        placeholder="Tìm kiếm theo hành động"
        onSearch={onSearch}
        className="rounded-md"
      />
      <Select
        placeholder="Lọc theo loại đối tượng"
        className="rounded-md"
        value={filterEntityType}
        onChange={onFilterChange}
      >
        <Select.Option value="users">Người dùng</Select.Option>
        <Select.Option value="products">Sản phẩm</Select.Option>
        <Select.Option value="orders">Đơn hàng</Select.Option>
      </Select>
    </Space>
  );
};

export default ActivityLogFilters;
