import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          欢迎使用 DW Web
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            这是一个容器管理应用程序
          </p>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/container" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md text-center transition-colors"
            >
              查看容器
            </Link>
           {' '} |{' '} 
            <Link 
              to="/about" 
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md text-center transition-colors"
            >
              关于我们
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
