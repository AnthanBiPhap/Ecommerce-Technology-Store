import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Input, Select, message, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const { Title } = Typography;

interface ActivityLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  metadata: any;
  ipAddress: string;
  userAgent: string;
  user: {
    _id: string;
    userName: string;
    fullName: string;
  };
  createdAt: string;
}

interface Pagination {
  totalRecord: number;
  limit: number;
  page: number;
}

const ActivityLogPage: React.FC = () => {
  const { user, tokens } = useAuthStore();

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');

  useEffect(() => {
    fetchActivityLogs();
  }, [tokens?.accessToken, pagination.page, pagination.limit]);

  const fetchActivityLogs = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error('Vui lòng đăng nhập để tiếp tục');
        return;
      }

      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        page: pagination.page.toString(),
        search: searchText,
        entityType: filterEntityType
      });

      const response = await axios.get(
        `http://localhost:8889/api/v1/activityLogs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );
      
      // Update state with correct data structure
      setActivityLogs(response.data.data.activityLogs);
      setPagination({
        ...pagination,
        totalRecord: response.data.data.pagination.totalRecord,
      });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      message.error('Lỗi khi lấy dữ liệu hoạt động');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

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
      // filters: [
      //   { text: 'Tạo mới', value: 'create' },
      //   { text: 'Cập nhật', value: 'update' },
      //   { text: 'Xóa', value: 'delete' },
      // ],
      onFilter: (value: any, record: ActivityLog) => record.action === value,
    },
    {
      title: 'Loại đối tượng',
      dataIndex: 'entityType',
      key: 'entityType',
      // filters: [
      //   { text: 'Người dùng', value: 'users' },
      //   { text: 'Sản phẩm', value: 'products' },
      //   { text: 'Đơn hàng', value: 'orders' },
      // ],
      onFilter: (value: any, record: ActivityLog) => record.entityType === value,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    // {
    //   title: 'Chi tiết',
    //   key: 'action',
    //   render: (text: string, record: ActivityLog) => (
    //     <Button
    //       type="link"
    //       icon={<InfoCircleOutlined />}
    //       onClick={() => handleViewDetails(record)}
    //     >
    //       Xem chi tiết
    //     </Button>
    //   ),
    // },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0">
          Activity Log Management
        </Title>
        <span
          className={`font-medium ${
            user?.roles === 'admin' ? 'text-blue-500' : 'text-green-500'
          }`}
        >
          Current Role: {user?.roles ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1) : 'Unknown'}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <Space>
            <Input.Search
              placeholder="Tìm kiếm theo hành động"
              onSearch={(value) => {
                setSearchText(value);
                setPagination({ ...pagination, page: 1 });
                fetchActivityLogs();
              }}
              className="rounded-md"
            />
            <Select
              placeholder="Lọc theo loại đối tượng"
              className="rounded-md"
              onChange={(value) => {
                setFilterEntityType(value);
                setPagination({ ...pagination, page: 1 });
                fetchActivityLogs();
              }}
            >
              <Select.Option value="users">Người dùng</Select.Option>
              <Select.Option value="products">Sản phẩm</Select.Option>
              <Select.Option value="orders">Đơn hàng</Select.Option>
            </Select>
          </Space>
        </div>

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
          onChange={(newPagination) => {
            setPagination(prev => ({
              ...prev,
              page: newPagination.current || 1,
              limit: newPagination.pageSize || 10,
            }));
            fetchActivityLogs();
          }}
          className="rounded-md shadow-sm"
        />
      </div>

      <Modal
        title="Activity Log Details"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        className="p-4"
      >
        {selectedLog && (
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-4">
              <div className="text-gray-600 mb-1">Thời gian</div>
              <div>{new Date(selectedLog.createdAt).toLocaleString()}</div>
            </div>
            <div className="mb-4">
              <div className="text-gray-600 mb-1">Người dùng</div>
              <div className="font-medium">{selectedLog.user.fullName || selectedLog.user.userName}</div>
            </div>
            <div className="mb-4">
              <div className="text-gray-600 mb-1">Hành động</div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className={`font-medium px-3 py-1 rounded ${getColorForAction(selectedLog.action)}`}>
                  {selectedLog.action}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-gray-600 mb-1">Loại đối tượng</div>
              <div>{selectedLog.entityType}</div>
            </div>
            <div className="mb-4">
              <div className="text-gray-600 mb-1">Mô tả</div>
              <div>{selectedLog.description}</div>
            </div>
            <div className="mb-4">
              <div className="text-gray-600 mb-1">Địa chỉ IP</div>
              <div>{selectedLog.ipAddress}</div>
            </div>
            <div className="mb-4">
              <div className="text-gray-600 mb-1">User Agent</div>
              <div>{selectedLog.userAgent}</div>
            </div>
            <div className="mb-4">
              <div className="text-gray-600 mb-1">Metadata</div>
              <pre className="rounded-md bg-gray-50 p-3">
                {JSON.stringify(selectedLog.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const getColorForAction = (action: string) => {
  switch (action) {
    case 'create':
      return 'bg-green-50 text-green-600 border border-green-200';
    case 'update':
      return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'delete':
      return 'bg-red-50 text-red-600 border border-red-200';
    default:
      return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};

export default ActivityLogPage;