import { useState } from 'react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AnalyticsAdminPanel from '@/components/AnalyticsAdminPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Settings } from 'lucide-react';

const AnalyticsPage = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'admin'>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Monitor your portfolio performance and manage analytics settings
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeView === 'admin' ? 'default' : 'outline'}
              onClick={() => setActiveView('admin')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeView === 'dashboard' ? 'Performance Dashboard' : 'Analytics Management'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activeView === 'dashboard' ? <AnalyticsDashboard /> : <AnalyticsAdminPanel />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;