import {
  Table,
  Space,
  Input,
  Button,
  Modal,
  Form,
  message,
  Select,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface SEO {
  _id: string;
  entityType: 'products' | 'Category' | 'vendors' | 'pages';
  entityId: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface TablePaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
}



const SEOPage: React.FC = () => {
  const [seos, setSEOs] = useState<SEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSEO, setSelectedSEO] = useState<SEO | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSEOs();
  }, [pagination.current, pagination.pageSize]);

  const fetchSEOs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8889/api/v1/seos', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      });
      setSEOs(response.data.data.seos || []);
      setPagination({
        ...pagination,
        total: response.data.data.pagination?.total || 0,
      });
    } catch (error) {
      message.error('Lỗi khi lấy danh sách SEO');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSEO = () => {
    setSelectedSEO(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditSEO = (seo: SEO) => {
    setSelectedSEO(seo);
    form.setFieldsValue({
      entityType: seo.entityType,
      entityId: seo.entityId,
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      metaKeywords: seo.metaKeywords,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
      canonicalUrl: seo.canonicalUrl,
    });
    setIsModalOpen(true);
  };

  const handleDeleteSEO = async (seoId: string) => {
    try {
      await Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa SEO này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
      });

      await axios.delete(`http://localhost:8889/api/v1/seo/${seoId}`);
      message.success('Xóa SEO thành công');
      fetchSEOs();
    } catch (error) {
      message.error('Lỗi khi xóa SEO');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (selectedSEO) {
        await axios.put(`http://localhost:8889/api/v1/seos/${selectedSEO._id}`, values);
        message.success('Cập nhật SEO thành công');
      } else {
        await axios.post('http://localhost:8889/api/v1/seos', values);
        message.success('Tạo mới SEO thành công');
      }

      setIsModalOpen(false);
      fetchSEOs();
    } catch (error) {
      message.error('Lỗi khi xử lý SEO');
    }
  };

  const columns = [
    {
      title: 'Entity Type',
      dataIndex: 'entityType',
      key: 'entityType',
    },
    {
      title: 'Entity ID',
      dataIndex: 'entityId',
      key: 'entityId',
    },
    {
      title: 'Meta Title',
      dataIndex: 'metaTitle',
      key: 'metaTitle',
      ellipsis: true,
    },
    {
      title: 'Meta Description',
      dataIndex: 'metaDescription',
      key: 'metaDescription',
      ellipsis: true,
    },
    {
      title: 'OG Image',
      dataIndex: 'ogImage',
      key: 'ogImage',
      render: (img: string) => img ? <img src={img} alt="OG Image" style={{ width: 50, height: 50 }} /> : '-'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string | undefined) => date ? new Date(date).toLocaleString() : '-'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: SEO) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditSEO(record)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteSEO(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SEO Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSEO}>
          Add SEO
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={seos}
        loading={loading}
        pagination={pagination}
        rowKey="_id"
        onChange={(newPagination: TablePaginationConfig) => {
          setPagination({
            ...pagination,
            current: newPagination.current || pagination.current,
            pageSize: newPagination.pageSize || pagination.pageSize,
          });
        }}
      />
      <Modal
        title={selectedSEO ? 'Edit SEO' : 'Add SEO'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ entityType: 'products' }}
        >
          <Form.Item
            name="entityType"
            label="Entity Type"
            rules={[{ required: true, message: 'Please select entity type!' }]}
          >
            <Select>
              <Select.Option value="products">Products</Select.Option>
              <Select.Option value="Category">Category</Select.Option>
              <Select.Option value="vendors">Vendors</Select.Option>
              <Select.Option value="pages">Pages</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="entityId"
            label="Entity ID"
            rules={[{ required: true, message: 'Please enter entity ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="metaTitle"
            label="Meta Title"
            rules={[{ max: 100, message: 'Maximum 100 characters!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="metaDescription"
            label="Meta Description"
            rules={[{ max: 200, message: 'Maximum 200 characters!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="metaKeywords"
            label="Meta Keywords"
            rules={[{ max: 200, message: 'Maximum 200 characters!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="ogTitle"
            label="OG Title"
            rules={[{ max: 100, message: 'Maximum 100 characters!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ogDescription"
            label="OG Description"
            rules={[{ max: 200, message: 'Maximum 200 characters!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="ogImage"
            label="OG Image URL"
            rules={[{ max: 255, message: 'Maximum 255 characters!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="canonicalUrl"
            label="Canonical URL"
            rules={[{ max: 255, message: 'Maximum 255 characters!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SEOPage;
