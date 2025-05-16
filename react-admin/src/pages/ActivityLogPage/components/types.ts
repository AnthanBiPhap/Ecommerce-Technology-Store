export interface ActivityLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;  
  metadata: string;
  ipAddress: string;
  userAgent: string;
  user: {
    _id: string;
    userName: string;
    fullName: string;
  };
  createdAt: string;
}

export interface Pagination {
  totalRecord: number;
  limit: number;
  page: number;
}
