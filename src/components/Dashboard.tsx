import React, { useState, useRef } from 'react';
import { Search, RotateCcw, Download, Settings, ChevronDown, X, MessageSquare, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// Types
interface UnitData {
  id: string;
  name: string;
  currentTotal: number;
  scrappedTotal: number;
  gapQuantity: number;
  lawEnforcementPersonnel: number;
  mainPostPersonnel: number;
  remarks: string;
}

// Annotation Card Component
const AnnotationCard = ({ 
  title, 
  content, 
  className,
  ps 
}: { 
  title: string; 
  content: string; 
  className?: string;
  ps?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDragging = useRef(false);

  const handleToggle = () => {
    if (!isDragging.current) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      onDragStart={() => { isDragging.current = true; }}
      onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 100); }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute w-64 bg-yellow-100 border-l-4 border-yellow-400 shadow-lg rounded-r-md overflow-hidden font-sans cursor-grab",
        isExpanded ? "z-[100]" : "z-50",
        className
      )}
    >
      <div 
        className="flex items-center justify-between p-2 bg-yellow-200/50 cursor-pointer hover:bg-yellow-200 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 text-yellow-800 font-bold text-xs uppercase tracking-wider">
          <MessageSquare size={12} />
          <span>需求说明</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp size={14} className="text-yellow-700" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 text-sm text-gray-800 space-y-2">
              <p className="font-medium text-gray-900">{title}</p>
              <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">{content}</p>
              {ps && (
                <div className="pt-2 mt-2 border-t border-yellow-200/60 text-xs text-gray-500 italic whitespace-pre-wrap">
                  PS: {ps}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Mock Data
const MOCK_DATA: UnitData[] = [
  { id: 'total', name: '合计', currentTotal: 1870, scrappedTotal: 33, gapQuantity: 13487, lawEnforcementPersonnel: 801, mainPostPersonnel: 305, remarks: '--' },
  { id: 'jx', name: '江西省本级', currentTotal: 54, scrappedTotal: 1, gapQuantity: 1710, lawEnforcementPersonnel: 97, mainPostPersonnel: 49, remarks: '请输入备注' },
  { id: 'nc', name: '南昌市本级', currentTotal: 114, scrappedTotal: 0, gapQuantity: 1484, lawEnforcementPersonnel: 84, mainPostPersonnel: 16, remarks: '--' },
  { id: 'jdz', name: '景德镇市本级', currentTotal: 163, scrappedTotal: 0, gapQuantity: 1208, lawEnforcementPersonnel: 72, mainPostPersonnel: 27, remarks: '--' },
  { id: 'px', name: '萍乡市本级', currentTotal: 0, scrappedTotal: 0, gapQuantity: 1155, lawEnforcementPersonnel: 64, mainPostPersonnel: 31, remarks: '--' },
  { id: 'jj', name: '九江市本级', currentTotal: 260, scrappedTotal: 0, gapQuantity: 2103, lawEnforcementPersonnel: 124, mainPostPersonnel: 42, remarks: '--' },
  { id: 'xy', name: '新余市本级', currentTotal: 101, scrappedTotal: 15, gapQuantity: 894, lawEnforcementPersonnel: 45, mainPostPersonnel: 22, remarks: '--' },
];

const CITY_OPTIONS = ['市本级', '县区', '功能区'];
const COUNTY_OPTIONS = ['县区', '功能区'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'details' | 'stats'>('stats');
  const [viewMode, setViewMode] = useState<'detail' | 'summary'>('detail');
  const [perspective, setPerspective] = useState<'city' | 'county'>('city');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  // Reset selections when perspective changes
  React.useEffect(() => {
    setSelectedOptions([]);
  }, [perspective]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>执法装备管理</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">装备档案</span>
        </div>
        
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('details')}
            className={cn(
              "pb-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'details' 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            详情
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={cn(
              "pb-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'stats' 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            统计
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filter Area */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 relative">
          
          {/* Annotation 1: Filter Buttons */}
          {viewMode === 'detail' && (
            <AnnotationCard 
              title="筛选条件调整"
              content="隐藏原有“选择所有设区市”和“选择所有县区”两个操作按钮，其他筛选条件保持不变。"
              ps="原型上会少放一些条件，但实际上保持不变就行。"
              className="top-full left-1/2 -translate-x-1/2 mt-2 md:top-4 md:left-auto md:right-[200px] md:translate-x-0 md:mt-0"
            />
          )}

          {/* Annotation: Equipment Type (Summary) */}
          {viewMode === 'summary' && (
            <AnnotationCard 
              title="装备类型筛选"
              content={`1. 新增装备类型筛选条件，交互反馈和明细界面一致；
2. 切换了筛选项后，刷新下方列表装备数量，包括（现有总数、人均配备数量、报废总数、缺口数量）`}
              className="top-full left-[300px] mt-2 w-80"
            />
          )}

          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            {/* Region Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">区域：</label>
              <div className="relative w-64">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md w-full min-h-[38px]">
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                    省本级 <X size={12} className="cursor-pointer hover:text-gray-900" />
                  </span>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">
                    + 12
                  </span>
                  <ChevronDown size={16} className="ml-auto text-gray-400" />
                </div>
              </div>
            </div>

            {/* Equipment Type Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">装备类型：</label>
              <div className="relative w-48">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-md w-full min-h-[38px] cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-500">全部类型</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Hidden buttons as per request: "选择所有设区市", "选择所有县/区" */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Search size={16} />
              查询
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <RotateCcw size={16} />
              重置
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[600px]">
          {/* Toggle & Navigation Container */}
          <div className="p-6 border-b border-gray-100 space-y-6 relative">
            
            {/* Annotation 2: Interaction Feedback (Detail) */}
            {viewMode === 'detail' && (
              <AnnotationCard 
                title="交互说明"
                content={`1、新增单选按钮组，默认不选中任何一个按钮；
2、选中任意一个按钮后后下方列表仅展示地市或县区数据（具体反馈沿用上方隐藏的两个按钮一致）`}
                className="top-20 left-[380px] w-80"
              />
            )}

            {/* Annotation: Perspective Logic (Summary) */}
            {viewMode === 'summary' && (
              <AnnotationCard 
                title="视角逻辑说明"
                content={`1. 【明细和汇总】状态的地市视角和县区不需要联动，【汇总视角】下默认地市视角；可以都不选。
2. 地市视角：选中时下方提供多选组：市本级、县区、功能区；默认全部选中
    a. 列表：单位名称仅显示市级单位（和明细的区别是文本不显示“本级”字眼）
PS:合计行和江西省固定显示不受影响
    b. 市本级：勾选时，下方市级单位的装备计数需要包括本级数量；包括（现有总数、人均配备数量、报废总数、缺口数量）
    c. 县区：勾选时，下方市级单位的装备计数需要包括下级的县区数量；
    d. 功能区：勾选时，下方市级单位的装备计数需要包括下级的功能区数量；功能区列表见需求中的附件
3. 县区视角：选中时下方提供多选组：县区、功能区；默认全部选中
    a. 列表：单位名称仅显示县级单位
PS:合计行和江西省固定显示不受影响
    b. 县区：勾选时，下方县级单位的装备计数需要包括本级数量；包括（现有总数、人均配备数量、报废总数、缺口数量）
    c. 功能区：同上`}
                className="top-20 left-[380px] w-[500px]"
              />
            )}

            {/* Detail/Summary Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setViewMode('detail')}
                className={cn(
                  "px-6 py-1.5 text-sm font-medium rounded-md transition-all",
                  viewMode === 'detail' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                明细
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={cn(
                  "px-6 py-1.5 text-sm font-medium rounded-md transition-all",
                  viewMode === 'summary' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                汇总
              </button>
            </div>

            {/* NEW: Double-layer Card Navigation */}
            <div className="space-y-4">
              {/* Layer 1: Perspective (City vs County) */}
              <div className="flex gap-4">
                <button
                  onClick={() => setPerspective('city')}
                  className={cn(
                    "relative px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all w-48 text-left overflow-hidden group",
                    perspective === 'city' 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/50"
                  )}
                >
                  <div className="relative z-10">
                    <div>地市视角</div>
                  </div>
                  {perspective === 'city' && (
                    <motion.div 
                      layoutId="active-perspective"
                      className="absolute inset-0 bg-blue-100/20" 
                    />
                  )}
                </button>

                <button
                  onClick={() => setPerspective('county')}
                  className={cn(
                    "relative px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all w-48 text-left overflow-hidden group",
                    perspective === 'county' 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/50"
                  )}
                >
                  <div className="relative z-10">
                    <div>县区视角</div>
                  </div>
                  {perspective === 'county' && (
                    <motion.div 
                      layoutId="active-perspective"
                      className="absolute inset-0 bg-blue-100/20" 
                    />
                  )}
                </button>
              </div>

              {/* Layer 2: Selectable Options */}
              <motion.div 
                initial={false}
                animate={{ 
                  height: viewMode === 'summary' ? 'auto' : 0,
                  opacity: viewMode === 'summary' ? 1 : 0,
                  marginTop: viewMode === 'summary' ? 16 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {(perspective === 'city' ? CITY_OPTIONS : COUNTY_OPTIONS).map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleOption(option)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm border transition-all",
                          selectedOptions.includes(option)
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Table Header & Actions */}
          <div className="p-6 pb-0 flex items-center justify-between mb-4 relative">
            {/* Annotation 3: Calculation Rule (Detail) */}
            {viewMode === 'detail' && (
              <AnnotationCard 
                title="计算规则变更"
                content="列表的字段规则保持不变，但修改缺口数量的计算规则，改为用主要执法岗人数来计算。"
                ps="原型上的列表字段和实际会有差异，但实际只需要改上述调整内容，未提到的保持不变。"
                className="top-full left-[55%] mt-4"
              />
            )}

            {/* Annotation: Per Capita (Summary) */}
            {viewMode === 'summary' && (
              <AnnotationCard 
                title="人均配备计算"
                content={`1. 按执法人数=现有总数/执法人员数量，结果保留1位小数不补零
2. 按主要执法岗=现有总数/主要执法岗位人数，结果保留1位小数不补零`}
                className="left-[450px] top-5 w-80"
              />
            )}

            {/* Annotation: Gap Quantity (Summary) */}
            {viewMode === 'summary' && (
              <AnnotationCard 
                title="缺口计算"
                content="计算缺口时改为用[主要执法岗位人数]计算"
                className="top-full left-[65%] mt-4"
              />
            )}

            <h2 className="text-lg font-bold text-gray-900">
              本级及下级单位执法必配装备配备情况统计表
            </h2>
            <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                <Download size={16} />
                导出
              </button>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border border-gray-200 hover:bg-gray-50">
                <Settings size={16} />
                显示
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">单位名称</th>
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">现有总数</th>
                  <th colSpan={2} className="py-2 px-6 font-semibold border-b border-gray-200 text-center border-l border-r border-gray-200">人均配备数量</th>
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">报废总数</th>
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">缺口数量</th>
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">执法人员数</th>
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">主要执法岗人数</th>
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">备注</th>
                  <th rowSpan={2} className="py-4 px-6 font-semibold border-b border-gray-200 align-middle">操作</th>
                </tr>
                <tr className="bg-gray-50 text-sm text-gray-600">
                  <th className="py-2 px-4 font-medium border-b border-r border-gray-200 text-center text-xs">按执法人数</th>
                  <th className="py-2 px-4 font-medium border-b border-r border-gray-200 text-center text-xs">按主要执法岗</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {MOCK_DATA.map((row, index) => {
                  // Calculate per capita values
                  const perCapitaTotal = row.lawEnforcementPersonnel > 0 
                    ? (row.currentTotal / row.lawEnforcementPersonnel).toFixed(2) 
                    : '0.00';
                  const perCapitaMain = row.mainPostPersonnel > 0 
                    ? (row.currentTotal / row.mainPostPersonnel).toFixed(2) 
                    : '0.00';

                  // Handle unit name display based on view mode
                  const displayName = viewMode === 'summary' 
                    ? row.name.replace('本级', '') 
                    : row.name;

                  return (
                    <tr 
                      key={row.id} 
                      className={cn(
                        "border-b border-gray-100 hover:bg-blue-50/30 transition-colors",
                        index === 0 && "bg-gray-50/50 font-medium"
                      )}
                    >
                      <td className="py-4 px-6">{displayName}</td>
                      <td className="py-4 px-6">{row.currentTotal}</td>
                      <td className="py-4 px-6 text-center border-r border-gray-100 bg-gray-50/30">{perCapitaTotal}</td>
                      <td className="py-4 px-6 text-center border-r border-gray-100 bg-gray-50/30">{perCapitaMain}</td>
                      <td className="py-4 px-6">{row.scrappedTotal}</td>
                      <td className="py-4 px-6">{row.gapQuantity}</td>
                      <td className="py-4 px-6">{row.lawEnforcementPersonnel}</td>
                      <td className="py-4 px-6">{row.mainPostPersonnel}</td>
                      <td className="py-4 px-6">
                        {row.remarks === '请输入备注' ? (
                          <div className="bg-gray-100 text-gray-400 px-2 py-1 rounded text-xs inline-flex items-center gap-2 w-full max-w-[120px] justify-between">
                            <span>请输入备注</span>
                            <span>0 / 100</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">{row.remarks}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {row.id !== 'total' && (
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            查看
                          </button>
                        )}
                        {row.id === 'total' && <span className="text-gray-400">--</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="p-4 border-t border-gray-100 flex justify-end gap-2 text-sm text-gray-500">
             <span>共 {MOCK_DATA.length} 条</span>
          </div>
        </div>
      </div>
    </div>
  );
}
