import React from 'react';
import { Modal } from 'antd';
import { ActivityLog } from './types';

interface ActivityLogModalProps {
  log: ActivityLog | null;
  open: boolean;
  onClose: () => void;
}

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

const ActivityLogModal: React.FC<ActivityLogModalProps> = ({
  log,
  open,
  onClose,
}) => {
  return (
    <Modal
      title="Activity Log Details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="p-4"
    >
      {log && (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Thời gian</div>
            <div>{new Date(log.createdAt).toLocaleString()}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Người dùng</div>
            <div className="font-medium">{log.user.fullName || log.user.userName}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Hành động</div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className={`font-medium px-3 py-1 rounded ${getColorForAction(log.action)}`}>
                {log.action}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Loại đối tượng</div>
            <div>{log.entityType}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Mô tả</div>
            <div>{log.description}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Địa chỉ IP</div>
            <div>{log.ipAddress}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">User Agent</div>
            <div>{log.userAgent}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Metadata</div>
            <pre className="rounded-md bg-gray-50 p-3">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ActivityLogModal;
