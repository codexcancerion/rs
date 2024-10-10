"use client"
/* eslint-disable */

// components/Layout.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import { ResearchProvider } from '../context/ResearchContext';

const { Sider, Content } = Layout;

const steps = [
  { key: 'project/title-making', label: 'Title Making' },
  { key: 'project/objectives', label: 'Objectives' },
  { key: 'project/introduction', label: 'Introduction' },
  { key: 'project/methodology', label: 'Methodology' },
  { key: 'project/literature-review', label: 'Literature Review' },
  { key: 'project/paper-draft', label: 'Paper Draft' },
];

const CustomLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }: React.PropsWithChildren<{}>) => {
  const router = useRouter();

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(`/${key}`);
  };

  return (
    <ResearchProvider>
      <Layout style={{ minHeight: '100vh' }}>
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
            <div className="min-h-screen bg-white shadow-lg rounded-lg p-6">
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ResearchProvider>
  );
};

export default CustomLayout;
