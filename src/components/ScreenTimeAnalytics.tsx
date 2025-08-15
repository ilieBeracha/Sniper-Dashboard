import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
  RadialBarChart, RadialBar
} from 'recharts';
import { 
  Clock, TrendingUp, TrendingDown, Smartphone, Globe, 
  MessageSquare, Briefcase, Play, AlertCircle, Activity,
  Monitor, Sun, Moon, Coffee
} from 'lucide-react';

interface ScreenTimeData {
  totalTime: string;
  categories: {
    other: { time: string; percentage: number; color: string };
    productivity: { time: string; percentage: number; color: string };
    social: { time: string; percentage: number; color: string };
  };
  topApps: Array<{
    name: string;
    icon: string;
    time: string;
    category: string;
    url?: string;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    other: number;
    productivity: number;
    social: number;
    total: number;
  }>;
}

// Mock data based on the screenshot
const mockData: ScreenTimeData = {
  totalTime: "14h 1m",
  categories: {
    other: { time: "7h 14m", percentage: 51.7, color: "#60A5FA" },
    productivity: { time: "3h 41m", percentage: 26.3, color: "#3B82F6" },
    social: { time: "41m", percentage: 4.9, color: "#F59E0B" }
  },
  topApps: [
    { name: "Chrome", icon: "🌐", time: "3h 18m", category: "productivity" },
    { name: "Safari", icon: "🧭", time: "2h 34m", category: "productivity" },
    { name: "com.todesktop.230313mzl4w4u92", icon: "⚙️", time: "3h 4m", category: "other" },
    { name: "vercel.com", icon: "▲", time: "51m", category: "productivity", url: "vercel.com" },
    { name: "cursor.com", icon: "C", time: "2h 36m", category: "productivity", url: "cursor.com" },
    { name: "Wolt", icon: "🍕", time: "29m", category: "other" }
  ],
  hourlyDistribution: [
    { hour: 0, other: 0.5, productivity: 0.3, social: 0, total: 0.8 },
    { hour: 1, other: 0.7, productivity: 0.4, social: 0.1, total: 1.2 },
    { hour: 2, other: 0.3, productivity: 0.2, social: 0, total: 0.5 },
    { hour: 3, other: 0.2, productivity: 0.1, social: 0, total: 0.3 },
    { hour: 4, other: 0.4, productivity: 0.2, social: 0, total: 0.6 },
    { hour: 5, other: 0.5, productivity: 0.4, social: 0.1, total: 1.0 },
    { hour: 6, other: 1.0, productivity: 0.8, social: 0.3, total: 2.1 },
    { hour: 7, other: 1.2, productivity: 1.0, social: 0.4, total: 2.6 },
    { hour: 8, other: 1.1, productivity: 1.2, social: 0.2, total: 2.5 },
    { hour: 9, other: 0.9, productivity: 1.0, social: 0.1, total: 2.0 },
    { hour: 10, other: 0.7, productivity: 0.8, social: 0.1, total: 1.6 },
    { hour: 11, other: 0.5, productivity: 0.6, social: 0, total: 1.1 },
    { hour: 12, other: 0.6, productivity: 0.4, social: 0.1, total: 1.1 },
    { hour: 13, other: 0.4, productivity: 0.3, social: 0, total: 0.7 },
    { hour: 14, other: 0.5, productivity: 0.4, social: 0.1, total: 1.0 },
    { hour: 15, other: 0.6, productivity: 0.5, social: 0.2, total: 1.3 },
    { hour: 16, other: 0.7, productivity: 0.6, social: 0.3, total: 1.6 },
    { hour: 17, other: 0.5, productivity: 0.5, social: 0.2, total: 1.2 },
    { hour: 18, other: 0.3, productivity: 0.2, social: 0.1, total: 0.6 },
    { hour: 19, other: 0.2, productivity: 0.1, social: 0.1, total: 0.4 },
    { hour: 20, other: 0.3, productivity: 0.2, social: 0.1, total: 0.6 },
    { hour: 21, other: 0.4, productivity: 0.3, social: 0, total: 0.7 },
    { hour: 22, other: 0.3, productivity: 0.2, social: 0, total: 0.5 },
    { hour: 23, other: 0.4, productivity: 0.2, social: 0, total: 0.6 }
  ]
};

const categoryIcons = {
  other: <Play className="w-5 h-5" />,
  productivity: <Briefcase className="w-5 h-5" />,
  social: <MessageSquare className="w-5 h-5" />
};

const categoryDescriptions = {
  other: "Entertainment, food delivery, and miscellaneous apps",
  productivity: "Work tools, development environments, and browsers",
  social: "Communication and social networking apps"
};

export default function ScreenTimeAnalytics() {
  const data = mockData;

  // Calculate peak usage hours
  const peakHour = data.hourlyDistribution.reduce((prev, current) => 
    prev.total > current.total ? prev : current
  );

  // Calculate productivity ratio
  const productivityRatio = (data.categories.productivity.percentage / 
    (data.categories.other.percentage + data.categories.social.percentage)).toFixed(2);

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  // Custom tooltip for hourly chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <p className="font-semibold mb-2">{formatHour(label)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
              <span className="capitalize">{entry.name}:</span>
              <span className="font-medium">{entry.value.toFixed(1)}h</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t">
            <span className="text-sm font-semibold">Total: {total.toFixed(1)}h</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Screen Time Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed breakdown of your digital activity
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{data.totalTime}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total today</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Peak Hour</p>
              <p className="text-2xl font-bold">{formatHour(peakHour.hour)}</p>
              <p className="text-xs text-gray-500">{peakHour.total.toFixed(1)}h usage</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Productivity Ratio</p>
              <p className="text-2xl font-bold">{productivityRatio}x</p>
              <p className="text-xs text-gray-500">vs other activities</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Most Used</p>
              <p className="text-xl font-bold">{data.topApps[0].name}</p>
              <p className="text-xs text-gray-500">{data.topApps[0].time}</p>
            </div>
            <Monitor className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Hours</p>
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs text-gray-500">out of 24 hours</p>
            </div>
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">24-Hour Activity Pattern</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Screen time distribution throughout the day
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.hourlyDistribution}>
              <defs>
                <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="hour" 
                tickFormatter={formatHour}
                interval={2}
              />
              <YAxis 
                label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="other" 
                stackId="1" 
                stroke="#60A5FA" 
                fillOpacity={1} 
                fill="url(#colorOther)" 
              />
              <Area 
                type="monotone" 
                dataKey="productivity" 
                stackId="1" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorProductivity)" 
              />
              <Area 
                type="monotone" 
                dataKey="social" 
                stackId="1" 
                stroke="#F59E0B" 
                fillOpacity={1} 
                fill="url(#colorSocial)" 
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Time Period Indicators */}
          <div className="flex justify-around mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Morning Peak: 7-9am</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Afternoon: 2-5pm</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Evening: 8-10pm</span>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Category Distribution</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Time spent by app category
            </p>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Other', value: data.categories.other.percentage, color: data.categories.other.color },
                  { name: 'Productivity', value: data.categories.productivity.percentage, color: data.categories.productivity.color },
                  { name: 'Social', value: data.categories.social.percentage, color: data.categories.social.color }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[data.categories.other, data.categories.productivity, data.categories.social].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Category Details */}
          <div className="space-y-3 mt-4">
            {Object.entries(data.categories).map(([key, category]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${category.color}20` }}>
                    {categoryIcons[key as keyof typeof categoryIcons]}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{key}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {categoryDescriptions[key as keyof typeof categoryDescriptions]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{category.time}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{category.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* App Usage Details */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">App Usage Breakdown</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detailed time spent on each application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.topApps.map((app, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{app.icon}</div>
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{app.category}</p>
                  {app.url && (
                    <p className="text-xs text-blue-500">{app.url}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{app.time}</p>
                <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1`}
                  style={{ 
                    backgroundColor: data.categories[app.category as keyof typeof data.categories].color + '20',
                    color: data.categories[app.category as keyof typeof data.categories].color
                  }}>
                  {((parseFloat(app.time) / 14) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Productivity Insight</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your most productive hours are between 7-11am. You spent {data.categories.productivity.time} on 
                work-related activities, with peak focus during morning hours.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 dark:text-orange-100">Usage Pattern</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Your screen time drops significantly after 6pm, suggesting good work-life balance. 
                Consider utilizing evening hours for learning if desired.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}