import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { Zap, Activity, Wind, TrendingDown, ArrowUpRight, ArrowDownRight, Database, AlertTriangle, Target, Compass } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, unit, icon: Icon, trend, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={clsx("p-2 rounded-lg", color)}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            {trend && (
                <div className={clsx("flex items-center text-xs font-medium px-2 py-1 rounded-full",
                    trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                    {trend > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div className="text-sm text-slate-500 font-medium">{title}</div>
        <div className="text-2xl font-bold text-slate-900 mt-1">
            {value} <span className="text-sm text-slate-400 font-normal">{unit}</span>
        </div>
    </motion.div>
);

const Report = ({ data }) => {
    if (!data || !data.summary) return null;

    const summary = data.summary;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Gross AEP"
                    value={summary.gross_aep}
                    unit="GWh"
                    icon={Zap}
                    color="bg-amber-500"
                    trend={2.4}
                    delay={0}
                />
                <MetricCard
                    title="Net AEP"
                    value={summary.net_aep}
                    unit="GWh"
                    icon={Activity}
                    color="bg-emerald-500"
                    trend={1.8}
                    delay={0.1}
                />
                <MetricCard
                    title="Availability"
                    value={(summary.availability * 100).toFixed(1)}
                    unit="%"
                    icon={Wind}
                    color="bg-blue-500"
                    trend={-0.5}
                    delay={0.2}
                />
                <MetricCard
                    title="Wake Loss"
                    value={(summary.wake_loss * 100).toFixed(1)}
                    unit="%"
                    icon={TrendingDown}
                    color="bg-rose-500"
                    trend={0.2}
                    delay={0.3}
                />
                <MetricCard
                    title="Capacity Factor"
                    value={(summary.capacity_factor * 100).toFixed(1)}
                    unit="%"
                    icon={Database}
                    color="bg-violet-500"
                    trend={1.2}
                    delay={0.4}
                />
                <MetricCard
                    title="Electrical Loss"
                    value={(summary.electrical_loss * 100).toFixed(1)}
                    unit="%"
                    icon={AlertTriangle}
                    color="bg-orange-500"
                    trend={-0.1}
                    delay={0.5}
                />
                {summary.eya_gap !== 0 && (
                    <MetricCard
                        title="EYA Gap"
                        value={(summary.eya_gap * 100).toFixed(1)}
                        unit="%"
                        icon={Target}
                        color={summary.eya_gap >= 0 ? "bg-emerald-500" : "bg-red-500"}
                        trend={null}
                        delay={0.6}
                    />
                )}
                {summary.yaw_misalignment !== 0 && (
                    <MetricCard
                        title="Avg Yaw Misalignment"
                        value={summary.yaw_misalignment}
                        unit="°"
                        icon={Compass}
                        color="bg-indigo-500"
                        trend={null}
                        delay={0.7}
                    />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-blue-500" />
                        Monthly Production
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.monthly_production}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="energy" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-500" />
                        Power Curve
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.power_curve}>
                                <defs>
                                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="wind_speed" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="power" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPower)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {data.turbine_performance && data.turbine_performance.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Wind className="h-5 w-5 text-sky-500" />
                        Turbine Performance Ranking (Top 10)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-3 px-4 text-sm font-semibold text-slate-600">Turbine ID</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-slate-600">Energy (MWh)</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-slate-600">Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.turbine_performance.slice(0, 10).map((turbine, index) => (
                                    <tr key={turbine.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-slate-900 font-medium">{turbine.id}</td>
                                        <td className="py-3 px-4 text-slate-600">{turbine.energy}</td>
                                        <td className="py-3 px-4">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-semibold",
                                                index < 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                                            )}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Report;
