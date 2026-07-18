import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-6">
      {/* 404 Icon Card */}
      <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-violet-400 animate-pulse">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2.5 max-w-md">
        <h1 className="text-4xl font-extrabold text-slate-100 font-outfit leading-tight m-0 select-none">
          404 - Page Not Found
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          The academic page or lecture resource you are looking for does not exist or has been archived.
        </p>
      </div>

      <div>
        <Link to="/">
          <Button className="h-10 px-5 text-sm gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
