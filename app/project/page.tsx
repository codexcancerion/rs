"use client"
// app/project/page.tsx
import React from 'react';
import { Layout } from 'antd';
import { useRouter } from 'next/navigation';

const { Content } = Layout;


const ProjectPage: React.FC = () => {
  const router = useRouter();


  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Main content area */}
        <Content style={{ padding: '20px' }}>
          <h1 className="text-2xl font-semibold mb-4">Research Project Steps</h1>
          <p>Select a step from the sidebar to begin working on your research project.</p>
        </Content>
    </Layout>
  );
};

export default ProjectPage;
