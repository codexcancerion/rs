"use client"
// app/project/page.tsx
import React from 'react';
import { Layout } from 'antd';
// import { useRouter } from 'next/navigation';



const ProjectPage: React.FC = () => {
  // const router = useRouter();


  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Main content area */}
        <div className='bg-white text-center p-10'>
          <h1 className="text-4xl font-semibold mb-4">Your Research Project</h1>
          <p>Select a step from the sidebar to begin working on your research project.</p>
        </div>
    </Layout>
  );
};

export default ProjectPage;
