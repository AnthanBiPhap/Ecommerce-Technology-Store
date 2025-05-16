import React, { useState, useEffect } from 'react';
import { Space, message, Typography } from 'antd';
import axios from 'axios';
import { useAuthStore } from '../../stores/useAuthStore';
import { env } from '../../constants/getEnvs';
import { ActivityLog, Pagination } from './components/types';
import ActivityLogTable from './components/ActivityLogTable';
import ActivityLogFilters from './components/ActivityLogFilters';
import ActivityLogModal from './components/ActivityLogModal';
import { Button, Modal } from 'antd';
const { Title } = Typography;

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
        `${env.API_URL}/api/v1/activityLogs?${params.toString()}`,
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

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, page: 1 });
    fetchActivityLogs();
  };

  const handleFilterChange = (value: string) => {
    setFilterEntityType(value);
    setPagination({ ...pagination, page: 1 });
    fetchActivityLogs();
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      page: newPagination.current || 1,
      limit: newPagination.pageSize || 10,
    }));
    fetchActivityLogs();
  };

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
          <ActivityLogFilters
            searchText={searchText}
            filterEntityType={filterEntityType}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>

        <ActivityLogTable
          activityLogs={activityLogs}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>

      <ActivityLogModal
        log={selectedLog}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
};

export default ActivityLogPage;