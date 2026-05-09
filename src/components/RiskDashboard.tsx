import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, 
  Legend, ReferenceDot, ReferenceLine, Label, LabelList
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

const BulletChart = ({ title, actual, target, unit, betterBelow = true, targetLabel = "KPI" }: any) => {
  const isPositiveValue = betterBelow ? actual <= target : actual >= target;
  
  // Normalized visual logic:
  // We place the target at 70% mark of the bar width.
  // This allows showing up to ~140% of target (overperformance).
  const normalizedTarget = 70;
  let barWidth = 0;
  
  if (target !== 0) {
    barWidth = (actual / target) * normalizedTarget;
  } else {
    // If target is 0 (e.g., 0% gap benchmark)
    // We treat 0 as the middle (50%)
    barWidth = 50 + actual * 5; // 1% = 5% of width
  }
  
  // Cap visual width
  const displayWidth = Math.min(100, Math.max(0, barWidth));

  return (
    <div className="flex-1">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <span className={`text-xs font-black p-0.5 px-1.5 rounded ${isPositiveValue ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
          {actual.toFixed(1)}{unit}
        </span>
      </div>
      <div className="relative h-4 bg-slate-100/80 rounded-sm">
        {/* Background segments (qualitative zones) */}
        <div className="absolute inset-0 flex opacity-20">
          <div className={`h-full border-r border-white/40 ${betterBelow ? 'bg-emerald-500 w-[70%]' : 'bg-slate-300 w-[70%]'}`} />
          <div className={`h-full ${betterBelow ? 'bg-slate-300 w-[30%]' : 'bg-emerald-500 w-[30%]'}`} />
        </div>
        
        {/* Performance Measure Bar */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${displayWidth}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-1 bottom-1 left-0 rounded-r-sm shadow-sm z-10 ${
            isPositiveValue ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
        
        {/* Target Marker */}
        <div 
          className="absolute top-[-4px] bottom-[-4px] w-1 bg-slate-900 z-20 shadow-sm" 
          style={{ left: `${target === 0 ? 50 : normalizedTarget}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-slate-900"></div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-slate-800 uppercase bg-white/80 px-1 rounded">
             {targetLabel}: {target.toFixed(1)}{unit}
          </div>
        </div>
      </div>
    </div>
  );
};

const KPIModule = ({ title, absolute, relative, contract, icon: Icon }: any) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
       <h4 className="text-[11px] font-black text-slate-900 uppercase border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
         <Icon size={16} className="text-blue-500" /> {title}
       </h4>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
          <BulletChart 
            title="点价绝对值"
            actual={absolute.actual}
            target={absolute.target}
            unit={contract.unit || ''}
            betterBelow={true}
            targetLabel="基准价"
          />
          <BulletChart 
            title="节省/达成率"
            actual={relative.actual}
            target={relative.target}
            unit="%"
            betterBelow={false} // Higher savings % is better
            targetLabel="目标值"
          />
       </div>
    </div>
  )
}

const ContractAnalysis = ({ contract }: any) => {
  const prices = contract.symbol === 'KCK26' ? KCK26_PRICES : RCK26_PRICES;
  
  // Market KPI Calculations
  const marketAbsolute = { actual: contract.avgPrice, target: contract.marketAvg };
  const marketRelative = { 
    actual: ((contract.marketAvg - contract.avgPrice) / contract.marketAvg) * 100, 
    target: 2.0 
  };
  
  // Competitor KPI Calculations
  const compAbsolute = { actual: contract.avgPrice, target: contract.competitorPrice };
  const compRelative = { 
    actual: ((contract.competitorPrice - contract.avgPrice) / contract.competitorPrice) * 100, 
    target: 0.0 
  };

  return (
    <div className="mb-16">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-10 gap-x-12 gap-y-6">
        <div className="shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">Closed Contract</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{contract.symbol} 期货合约复盘分析</h2>
          </div>
          <p className="text-base text-slate-500 flex items-center gap-2 font-bold mb-4">
            <Activity size={18} className="text-slate-400" /> 执行周期: {contract.period}
          </p>
          <div className="flex gap-3">
             <div className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={12} /> 基准达成: {marketRelative.actual.toFixed(1)}%
             </div>
             <div className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <TrendingDown size={12} /> 领先竞对: {compRelative.actual.toFixed(1)}%
             </div>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
           <KPIModule 
             title="大盘均价基准 (Market Benchmark)"
             absolute={marketAbsolute}
             relative={marketRelative}
             contract={contract}
             icon={TrendingDown}
           />
           <KPIModule 
             title="竞争对手对比 (Competitor Benchmark)"
             absolute={compAbsolute}
             relative={compRelative}
             contract={contract}
             icon={User}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Market Data & Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-6 min-h-[450px]">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   价格走势与执行回顾 <span className="text-xs font-normal text-slate-400">({contract.unit})</span>
                </h3>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[10px] font-semibold uppercase tracking-wider">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 市场价格</div>
                   <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-red-400 border-t border-dashed border-red-400"></div> 大盘均价</div>
                   <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-emerald-500 border-t border-dashed border-emerald-500"></div> 点价均价</div>
                   <div className="flex items-center gap-1 border-l border-slate-200 pl-4"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Candies 成交</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div> Wendy 成交</div>
                </div>
             </div>
             <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prices} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                    
                    <ReferenceLine 
                      y={contract.marketAvg} 
                      stroke="#ef4444" 
                      strokeDasharray="5 5" 
                      strokeWidth={1.5}
                      label={{ 
                        value: `大盘: ${contract.marketAvg}`, 
                        fill: '#ef4444', 
                        fontSize: 10, 
                        fontWeight: 'bold',
                        position: 'right' 
                      }} 
                    />
                    <ReferenceLine 
                      y={contract.avgPrice} 
                      stroke="#10b981" 
                      strokeDasharray="5 5" 
                      strokeWidth={1.5}
                      label={{ 
                        value: `点价: ${contract.avgPrice}`, 
                        fill: '#10b981', 
                        fontSize: 10, 
                        fontWeight: 'bold',
                        position: 'right' 
                      }} 
                    />

                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    
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
           
           <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={outerData} 
                    layout="vertical" 
                    margin={{ top: 5, right: 80, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      fontSize={12} 
                      fontWeight="bold" 
                      axisLine={false} 
                      tickLine={false} 
                      width={80}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 shadow-xl rounded-lg border border-white/10">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{data.name}</p>
                              <p className="text-sm font-black">{Math.round(data.amount / 100)} 百万元</p>
                              <p className="text-xs text-blue-400 font-bold">{data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
                      radius={[0, 4, 4, 0]} 
                      barSize={32}
                    >
                      {outerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      {/* Custom labels inside or beside bars */}
                      <LabelList dataKey="percentage" position="right" content={(props: any) => {
                        const { x, y, width, value } = props;
                        return (
                          <text x={x + width + 10} y={y + 20} fill="#64748b" fontSize={12} fontWeight="bold">
                            {value}%
                          </text>
                        );
                      }} />
                    </Bar>
                  </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="w-full grid grid-cols-1 gap-3 mt-10">
              {outerData.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/40 border border-blue-100/50">
                    <div className="w-4 h-4 rounded shadow-sm shrink-0" style={{backgroundColor: item.color}}></div>
                    <div className="flex-1 flex justify-between items-center">
                       <span className="text-sm font-black text-slate-700">{item.name}</span>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <p className="text-xs font-bold text-slate-400 uppercase">金额</p>
                             <p className="text-sm font-black text-slate-800">{Math.round(item.amount / 100).toLocaleString()} 百万</p>
                          </div>
                          <div className="text-right min-w-[60px]">
                             <p className="text-xs font-bold text-slate-400 uppercase">占比</p>
                             <p className="text-sm font-black text-blue-700">{item.percentage}%</p>
                          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:w-auto">
             <div className="px-6 py-5 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                   <Package size={14} className="text-slate-300" /> 总体计划额
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{Math.round(SUMMARY_STATS.totalPlanned / 100).toLocaleString()}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">百万元</span>
                </div>
             </div>
             <div className="px-6 py-5 bg-blue-50/50 rounded-2xl shadow-sm border border-blue-100 hover:border-blue-400 transition-colors">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                   <CheckCircle2 size={14} className="text-blue-300" /> 已关闭敞口
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600">{Math.round(SUMMARY_STATS.closedExposure / 100).toLocaleString()}</span>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">百万元</span>
                </div>
             </div>
             <div className="px-6 py-5 bg-red-50/50 rounded-2xl shadow-sm border border-red-100 hover:border-red-400 transition-colors sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-bold text-red-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                   <AlertTriangle size={14} className="text-red-300" /> 当前敞口额
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-red-600">{Math.round(SUMMARY_STATS.currentExposure / 100).toLocaleString()}</span>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-tighter">百万元</span>
                </div>
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
