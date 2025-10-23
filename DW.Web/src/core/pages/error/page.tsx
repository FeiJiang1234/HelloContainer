import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            页面未找到
          </h2>
          <p className="text-gray-600 mb-6">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>错误信息:</strong> {error.message || '未知错误'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            返回首页
          </Link>
          
          <Link 
            to="/container" 
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            查看容器
          </Link>
        </div>
      </div>
    </div>
  );
}
