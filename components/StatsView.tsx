
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const moodData = [
    { name: 'Happy', value: 4 },
    { name: 'Calm', value: 3 },
    { name: 'Sad', value: 2 },
    { name: 'Excited', value: 1 },
];

const activityData = [
    { name: 'Mon', entries: 2 },
    { name: 'Tue', entries: 3 },
    { name: 'Wed', entries: 1 },
    { name: 'Thu', entries: 4 },
    { name: 'Fri', entries: 2 },
    { name: 'Sat', entries: 5 },
    { name: 'Sun', entries: 3 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export const StatsView: React.FC = () => {
    return (
        <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg h-full flex flex-col overflow-y-auto">
            <h2 className="text-3xl font-bold font-mplus mb-6 text-gray-700 dark:text-gray-200">Stats & Trends</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl shadow">
                    <h3 className="font-semibold mb-4 text-center">Mood Distribution (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={moodData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {moodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl shadow">
                     <h3 className="font-semibold mb-4 text-center">Entry Frequency (Last 7 Days)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activityData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip wrapperClassName="!bg-white/80 dark:!bg-gray-700/80 !border-gray-300 dark:!border-gray-600 rounded-lg" />
                            <Legend />
                            <Bar dataKey="entries" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="mt-6 p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl shadow">
                <h3 className="font-semibold mb-2">Weekly Summary (AI Generated)</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p>今週もお疲れ様！全体的に落ち着いた一週間だったみたいだね。週の後半に活動的になってるのが良い感じだよ。</p>
                    <p>ちょっと落ち込む日もあったみたいだけど、ちゃんと自分でリフレッシュできてるのがえらい！来週も君のペースで、楽しく過ごせるといいね。</p>
                </div>
            </div>
        </div>
    );
};
   