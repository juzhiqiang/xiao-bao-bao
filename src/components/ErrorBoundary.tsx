import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/xiao-bao-bao/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-red-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              
              <h1 className="text-xl font-bold text-slate-800 mb-3">
                应用遇到了问题
              </h1>
              
              <p className="text-sm text-slate-600 mb-6">
                小包包在加载过程中遇到了技术问题，这可能是由于网络连接或配置问题导致的。
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left bg-red-50 rounded-xl p-4 mb-6 text-xs">
                  <p className="font-medium text-red-800 mb-2">错误详情：</p>
                  <p className="text-red-600 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={this.handleReload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新加载页面
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  <Home className="w-4 h-4" />
                  返回首页
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-6">
                如果问题持续存在，请检查网络连接或联系技术支持
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
