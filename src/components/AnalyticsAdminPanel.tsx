import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { Download, RefreshCw } from 'lucide-react';

const AnalyticsAdminPanel = () => {
  const { analyticsConsent, setAnalyticsConsent } = useAnalytics();
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    // Simulate data export
    setTimeout(() => {
      // In a real implementation, you would export actual analytics data
      const data = {
        exportDate: new Date().toISOString(),
        analyticsEnabled: analyticsConsent,
        // Add other analytics data here
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1000);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      // In a real implementation, you would refresh analytics data from the service
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Analytics Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Allow collection of usage data to improve your experience
              </p>
            </div>
            <Switch
              checked={analyticsConsent === true}
              onCheckedChange={(checked) => setAnalyticsConsent(checked)}
              aria-label="Toggle analytics tracking"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Anonymize Data</h3>
              <p className="text-sm text-muted-foreground">
                Remove personally identifiable information from collected data
              </p>
            </div>
            <Switch
              defaultChecked
              aria-label="Toggle data anonymization"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enhanced Measurement</h3>
              <p className="text-sm text-muted-foreground">
                Collect additional interaction data (scroll depth, engagement, etc.)
              </p>
            </div>
            <Switch
              defaultChecked
              aria-label="Toggle enhanced measurement"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExportData} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={handleRefreshData} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Export your analytics data for offline analysis or compliance purposes.
              Data is exported in JSON format and includes all collected metrics.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Privacy Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Data Retention</h3>
              <p className="text-sm text-muted-foreground">
                Automatically delete analytics data after 24 months
              </p>
            </div>
            <Switch
              defaultChecked
              aria-label="Toggle data retention"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Third-party Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Prevent sharing of analytics data with third-party services
              </p>
            </div>
            <Switch
              defaultChecked
              aria-label="Toggle third-party sharing"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsAdminPanel;