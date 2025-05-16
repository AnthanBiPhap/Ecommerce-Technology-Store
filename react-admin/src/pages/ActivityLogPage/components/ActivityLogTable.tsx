import React from 'react';
import { Table } from 'antd';
import { ActivityLog, Pagination } from './types';

interface ActivityLogTableProps {
  activityLogs: ActivityLog[];
  loading: boolean;
  pagination: Pagination;
  onChange: (newPagination: any) => void;
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({
  activityLogs,
  loading,
  pagination,
  onChange,
}) => {
  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: (a: ActivityLog, b: ActivityLog) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.fullName || user?.userName,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Loại đối tượng',
      dataIndex: 'entityType',
      key: 'entityType',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <Table
      dataSource={Array.isArray(activityLogs) ? activityLogs : []}
      columns={columns}
      loading={loading}
      rowKey="_id"
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.totalRecord,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total) => <span className="ml-4">Total {total} logs</span>,
      }}
      onChange={onChange}
      className="rounded-md shadow-sm"
    />
  );
};

export default ActivityLogTable;
