import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, FileText, MapPin, Home } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: '小包包聊天',
      icon: Home,
      description: '智能AI对话助手',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      path: '/contract-review',
      label: '合同审核',
      icon: FileText,
      description: '专业合同合规审核',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      path: '/travel-planning',
      label: '旅游规划',
      icon: MapPin,
      description: '智能旅游路线规划',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const currentPath = location.pathname;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 p-2">
        <div className="flex space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  relative group px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2
                  ${isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-md` 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }
                `}
                title={item.description}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {item.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
