import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, 
  Legend, ReferenceDot
} from 'recharts';
import { 
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, 
  XCircle, Info, User, DollarSign, Package, Activity, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { KCK26_PRICES, RCK26_PRICES, CLOSED_CONTRACTS, EXPOSURE_DATA, SUMMARY_STATS } from '../data';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#84cc16'];
const EXPOSURE_COLORS = ['#3b82f6', '#0ea5e9', '#6366f1', '#a855f7'];

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
        <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-900">
          {payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-[10px] font-normal text-slate-400">{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ label, value, unit, icon: Icon, colorClass = "text-slate-900" }: any) => (
  <div className="p-5 glass-card flex items-center gap-5">
    <div className={`p-3 rounded-xl bg-slate-50 ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-bold mb-0.5 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-black">
        {typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : value}
        <span className="text-sm font-bold text-slate-400 ml-1.5 uppercase">{unit}</span>
      </p>
    </div>
  </div>
);

const RiskMetricBox = ({ label, subtitle, value, unit, description, type }: any) => {
  const isNegative = typeof value === 'number' && value < 0;
  
  // Decide background and text colors based on type
  const themeClasses = type === 'drawdown' 
    ? 'border-red-400/20 bg-red-400/5' 
    : type === 'return' 
      ? 'border-emerald-400/20 bg-emerald-400/5'
      : 'border-blue-400/20 bg-blue-400/5';

  return (
    <div className={`p-7 rounded-2xl border ${themeClasses} backdrop-blur-sm flex flex-col justify-between h-full group transition-all hover:translate-y-[-4px] hover:shadow-xl`}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</p>
            <p className="text-[10px] font-bold text-slate-500/60 uppercase">{subtitle}</p>
          </div>
          <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${isNegative ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {type}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-black tracking-tight ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase">{unit}</span>
        </div>
      </div>
      <div className="mt-8 pt-5 border-t border-white/5">
        <p className="text-xs text-slate-500 leading-relaxed font-medium italic opacity-80">
          {description}
        </p>
      </div>
    </div>
  );
};

const ContractAnalysis = ({ contract }: any) => {
  const prices = contract.symbol === 'KCK26' ? KCK26_PRICES : RCK26_PRICES;
  
  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">Closed Contract</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{contract.symbol} 期货合约复盘分析</h2>
          </div>
          <p className="text-base text-slate-500 flex items-center gap-2 font-bold">
            <Activity size={18} className="text-slate-400" /> 执行周期: {contract.period}
          </p>
        </div>
        <div className="flex gap-2">
          {contract.kpi.map((k: any, idx: number) => (
            <div key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              k.status === '1' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {k.status === '1' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {k.label}: <span className="font-bold underline decoration-dotted">{k.result}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Market Data & Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-6 min-h-[400px]">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   价格走势与执行回顾 <span className="text-xs font-normal text-slate-400">({contract.unit})</span>
                </h3>
                <div className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-wider">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 市场价格</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 点价均价</div>
                   <div className="flex items-center gap-1 border-l border-slate-200 pl-4"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Candies 成交</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div> Wendy 成交</div>
                </div>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prices}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8'}}
                      interval={Math.floor(prices.length / 8)}
                    />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8'}}
                      tickFormatter={(val) => val.toFixed(0)}
                    />
                    <Tooltip content={<CustomTooltip unit={contract.unit} />} />
                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    {/* Reference line for internal price */}
                    <Line type="monotone" dataKey={() => contract.avgPrice} stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                    
                    {/* Trade Records Mapping */}
                    {contract.tradeRecords && contract.tradeRecords.map((trade: any, idx: number) => (
                       <ReferenceDot 
                         key={idx} 
                         x={trade.date} 
                         y={trade.price} 
                         r={4} 
                         fill={trade.trader === 'Candies' ? '#f59e0b' : '#8b5cf6'} 
                         stroke="white" 
                         strokeWidth={2}
                       />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="手数" value={contract.lots} unit="手" icon={Package} />
            <StatCard label="点价均价" value={contract.avgPrice} unit={contract.unit} icon={DollarSign} colorClass="text-emerald-500" />
            <StatCard label="结算均价" value={contract.settlementAvg} unit="元/KG" icon={TrendingDown} />
            <StatCard label="成交总额" value={contract.totalAmout} unit="万元" icon={TrendingUp} />
          </div>
        </div>

        {/* Performance & Risk */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-8 h-full">
            <h3 className="text-base font-black text-slate-800 mb-6 flex items-center gap-3">
              <User size={20} className="text-blue-500" /> 交易员 Performance (各占 50%)
            </h3>
            <div className="space-y-6">
              {contract.traders.map((t: any, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-black text-slate-900">{t.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">点价价位</p>
                      <p className="text-lg font-black text-slate-800">{typeof t.price === 'number' ? t.price.toFixed(1) : t.price} <span className="text-xs text-slate-400">{contract.unit}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">优势率</p>
                      <p className="text-lg font-black text-emerald-600">{t.advantage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 bg-slate-950 border-none relative overflow-hidden group mt-8">
        {/* Ambient highlight effect */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] group-hover:bg-blue-600/10 transition-all"></div>
        
        <h3 className="text-base font-bold text-white/90 mb-8 flex items-center gap-3 relative z-10">
          <AlertTriangle size={24} className="text-amber-400" /> 战略风险指标回测分析
          <span className="text-xs font-normal text-white/40 uppercase tracking-[0.2em] ml-4 font-mono">Strategic Risk Pillars</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <RiskMetricBox 
            label="最大回撤" 
            subtitle="Drawdown"
            value={contract.risk.maxDrawdown} 
            unit={contract.unit} 
            description="回补敞口期间的最大浮亏深度" 
            type="drawdown"
          />
          <RiskMetricBox 
            label="风险收益" 
            subtitle="Risk Return"
            value={contract.risk.riskReturn} 
            unit={contract.unit} 
            description="点价实现节省值" 
            type="return"
          />
          <RiskMetricBox 
            label="收益风险比" 
            subtitle="RR Ratio"
            value={contract.risk.rrRatio} 
            unit="" 
            description="风险承担效率" 
            type="ratio"
          />
        </div>
      </div>
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-4 shadow-2xl rounded-xl border border-white/10 backdrop-blur-md">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{data.name}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black">{Math.round(data.value / 100).toLocaleString()}</span>
          <span className="text-xs font-medium text-slate-400">百万元</span>
        </div>
        {data.percentage && (
          <p className="text-xs font-bold text-blue-400 mt-1">占比: {data.percentage}%</p>
        )}
      </div>
    );
  }
  return null;
};

const ExposureView = () => {
  const pieData = [
    { name: '一口价采购', value: EXPOSURE_DATA.fixedPrice, color: '#0f172a', percentage: 85.6 },
    { name: '风险敞口', value: EXPOSURE_DATA.riskExposure, color: '#ef4444', percentage: 14.4 }
  ];

  const outerData = EXPOSURE_DATA.structure.map((item, index) => ({
    ...item,
    color: EXPOSURE_COLORS[index % EXPOSURE_COLORS.length]
  }));

  return (
    <div className="mt-12 mb-12">
      <div className="flex items-center gap-2 mb-8">
         <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg uppercase tracking-wider">Exposure Analysis</span>
         <h2 className="text-3xl font-black text-slate-900 tracking-tight">现货头寸与风控敞口穿透</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Ratio */}
        <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[480px] hover:shadow-xl transition-all border-slate-200">
           <div className="w-full flex justify-between items-center mb-6">
              <h4 className="text-xl font-black text-slate-800 flex flex-col">
                 <span>1. 采购总量风险分布</span>
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 underline decoration-dotted font-mono">FIXED VS RISK</span>
              </h4>
              <div className="text-right">
                 <p className="text-3xl font-black text-red-600">14.4%</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">风险占比</p>
              </div>
           </div>
           <div className="w-full h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={85}
                      outerRadius={115}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={450}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`inner-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">TOTAL PLAN</p>
                 <p className="text-3xl font-black text-slate-900">{Math.round((EXPOSURE_DATA.fixedPrice + EXPOSURE_DATA.riskExposure) / 100).toLocaleString()}</p>
                 <p className="text-[10px] font-bold text-slate-400">百万元</p>
              </div>
           </div>
           <div className="w-full grid grid-cols-2 gap-4 mt-8">
              {pieData.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-300 transition-colors">
                    <div className="w-5 h-5 rounded-lg shadow-sm" style={{backgroundColor: item.color}}></div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</p>
                       <p className="text-base font-black text-slate-800">{Math.round(item.value / 100).toLocaleString()} <span className="text-[10px] font-bold text-slate-400 ml-1">百万</span></p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Chart 2: Structure */}
        <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[520px] hover:shadow-xl transition-all border-blue-100">
           <div className="w-full flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-slate-800 flex flex-col">
                 <span>2. 风险敞口具体结构</span>
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 underline decoration-dotted font-mono">CONTRACT BREAKDOWN</span>
              </h4>
              <div className="text-right">
                 <p className="text-3xl font-black text-blue-600">{Math.round(EXPOSURE_DATA.riskExposure / 100).toLocaleString()}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">敞口总计 (百万元)</p>
              </div>
           </div>
           
           <div className="w-full h-[320px] relative">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outerData}
                      innerRadius={85}
                      outerRadius={115}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={450}
                    >
                      {outerData.map((entry, index) => (
                        <Cell key={`outer-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">FORWARDS</p>
                 <p className="text-3xl font-black text-blue-600">4 <span className="text-xs font-bold text-blue-400">Contracts</span></p>
              </div>
           </div>
           
           <div className="w-full grid grid-cols-2 gap-4 mt-10">
              {outerData.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50/40 border border-blue-100/50 hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <div className="w-5 h-5 rounded-lg shadow-sm shrink-0" style={{backgroundColor: item.color}}></div>
                    <div className="flex-1 flex justify-between items-center min-w-0">
                       <span className="text-sm font-black text-slate-700 truncate mr-2">{item.name}</span>
                       <div className="text-right shrink-0">
                          <p className="text-base font-black text-blue-700">{item.percentage}%</p>
                          <p className="text-[10px] font-bold text-slate-400">{Math.round(item.amount / 100).toLocaleString()}百万</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default function RiskDashboard() {
  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-10 gap-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
              亿丰咖啡生豆采购<span className="text-blue-600">风险管理</span>看板
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-3xl leading-relaxed">
              实时追踪期货头寸执行状态与敞口结构。风控策略：空头基差合同。通过点价回补平仓，深度监控大盘均价偏离度及极端回撤风险。
            </p>
          </div>
          <div className="flex gap-6">
             <div className="px-6 py-4 bg-white rounded-2xl shadow-md border border-slate-100 text-right min-w-[180px]">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">总体计划额</p>
                <p className="text-3xl font-black text-slate-900">{Math.round(SUMMARY_STATS.totalPlanned / 100).toLocaleString()} <span className="text-sm font-bold text-slate-400 uppercase">百万元</span></p>
             </div>
             <div className="px-6 py-4 bg-blue-50 rounded-2xl shadow-md border border-blue-100 text-right min-w-[180px]">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.15em] mb-1">已关闭敞口</p>
                <p className="text-3xl font-black text-blue-600">{Math.round(SUMMARY_STATS.closedExposure / 100).toLocaleString()} <span className="text-sm font-bold text-blue-400 uppercase">百万元</span></p>
             </div>
             <div className="px-6 py-4 bg-red-50 rounded-2xl shadow-md border border-red-100 text-right min-w-[180px]">
                <p className="text-xs font-bold text-red-400 uppercase tracking-[0.15em] mb-1">当前敞口额</p>
                <p className="text-3xl font-black text-red-600">{Math.round(SUMMARY_STATS.currentExposure / 100).toLocaleString()} <span className="text-sm font-bold text-red-400 uppercase">百万元</span></p>
             </div>
          </div>
        </div>
      </header>

      <main>
        {/* Current Exposure */}
        <div className="mb-8 flex items-center gap-4">
           <div className="h-px bg-slate-200 flex-1"></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Current Exposure Status</span>
           <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <ExposureView />
        </motion.div>

        {/* Closed Contracts Analysis */}
        <div className="mb-8 mt-16 flex items-center gap-4">
           <div className="h-px bg-slate-200 flex-1"></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Historical Post-Mortem</span>
           <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {CLOSED_CONTRACTS.map((contract, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <ContractAnalysis contract={contract} />
          </motion.div>
        ))}
      </main>

      <footer className="mt-24 border-t border-slate-200 pt-16 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
        <div className="flex items-center gap-10 mb-6 md:mb-0">
           <div>
              <p className="font-black text-slate-900 text-lg mb-1 tracking-tight">行情风控组</p>
              <p className="font-medium text-slate-400 uppercase tracking-widest text-[10px]">Risk Management Group</p>
           </div>
           <div className="w-px h-12 bg-slate-200"></div>
           <div>
              <p className="font-black text-slate-900 text-lg mb-1 tracking-tight">负责人 Candies</p>
              <p className="font-medium text-slate-400 uppercase tracking-widest text-[10px]">In Charge</p>
           </div>
        </div>
        <div className="text-right">
           <p className="font-bold text-slate-800 mb-2 text-base">亿丰咖啡采购部 内部专用</p>
           <p className="font-medium">© 2026 Yifeng Coffee Procurement All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
