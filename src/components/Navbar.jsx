import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then(() => {
        if (isMounted) setBackendStatus('online');
      })
      .catch(() => {
        if (isMounted) setBackendStatus('offline');
      });
    return () => { isMounted = false; };
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 text-slate-900 group">
            <div className="w-8 h-8 rounded bg-[#0b2545] text-white flex items-center justify-center font-bold tracking-wider text-sm shadow-xs">
              TR
            </div>
            <div>
              <div className="font-semibold text-base leading-tight tracking-tight text-slate-900 flex items-center gap-1.5">
                TRACE AI
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase font-semibold">
                  v1.0
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-normal">Accident Investigation & Reconstruction</div>
            </div>
          </Link>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive('/') ? 'text-[#0b2545] bg-slate-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive('/dashboard') ? 'text-[#0b2545] bg-slate-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Investigations
            </Link>
            <Link
              to="/investigation/INC-20261030-DEMO1"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                location.pathname.includes('DEMO1') ? 'text-[#0b2545] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Demo Case
            </Link>
          </nav>
        </div>

        {/* Right Action & Status */}
        <div className="flex items-center gap-3">
          {/* Backend Health Pill */}
          <div
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border"
            style={{
              backgroundColor: backendStatus === 'online' ? '#f0fdf4' : '#f8fafc',
              borderColor: backendStatus === 'online' ? '#bbf7d0' : '#e2e8f0',
              color: backendStatus === 'online' ? '#166534' : '#64748b',
            }}
            title={backendStatus === 'online' ? 'FastAPI Backend connected' : 'Backend offline or running locally (Demo standby active)'}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: backendStatus === 'online' ? '#22c55e' : '#94a3b8',
              }}
            />
            <span className="font-medium">
              {backendStatus === 'online' ? 'API Online' : 'Standby / Demo Ready'}
            </span>
          </div>

          <Link
            to="/new-investigation"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-[#0b2545] hover:bg-[#134074] rounded transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Investigation</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
