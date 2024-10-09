"use client"
// components/Layout.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/navigation';

const { Sider, Content } = Layout;

const steps = [
  { key: 'project/title-making', label: 'Title Making' },
  { key: 'project/objectives', label: 'Objectives' },
  { key: 'project/introduction', label: 'Introduction' },
  { key: 'project/methodology', label: 'Methodology' },
  { key: 'project/literature-review', label: 'Literature Review' },
];

const CustomLayout: React.FC = ({ children }: any) => {
  const router = useRouter();

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(`/${key}`);
  };

  return (
    <Layout style={{ minHeight: '100vh'}}>
      {/* Sidebar for navigation */}
      <Sider style={{ height: '100vh', position: 'fixed' }}>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          defaultSelectedKeys={['title-making']}
        >
          {steps.map(step => (
            <Menu.Item key={step.key}>
              {step.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main content area */}
      <Layout>
        <Content style={{ padding: '20px', marginLeft: '200px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
