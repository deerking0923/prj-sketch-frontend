'use client';

export default function StyleSelector({
  styles,
  selectedStyle,
  parameters,
  onParameterChange,
}) {
  const currentStyle = styles[selectedStyle];

  const renderParameter = (param) => {
    const value = parameters[param.name] ?? param.default;

    if (param.type === 'int' || param.type === 'float') {
      return (
        <div key={param.name} className="mb-4 sm:mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              {param.description}
            </label>
            <span className="text-xs sm:text-sm font-bold text-purple-600 bg-purple-50 px-2 sm:px-3 py-1 rounded-full">
              {value}
            </span>
          </div>
          <input
            type="range"
            min={param.min ?? 0}
            max={param.max ?? 100}
            step={param.step ?? 1}
            value={value}
            onChange={(e) => {
              const newValue = param.type === 'int' 
                ? parseInt(e.target.value)
                : parseFloat(e.target.value);
              onParameterChange(param.name, newValue);
            }}
            className="w-full h-2 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{param.min}</span>
            <span>{param.max}</span>
          </div>
        </div>
      );
    }

    if (param.type === 'bool') {
      return (
        <div key={param.name} className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onParameterChange(param.name, e.target.checked)}
              className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-sm sm:text-base font-medium text-gray-700">{param.description}</span>
          </label>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">⚙️ 세부 조정</h2>
      
      {/* 파라미터 조정 */}
      {currentStyle && currentStyle.parameters.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {currentStyle.parameters.map(renderParameter)}
        </div>
      ) : (
        <p className="text-sm sm:text-base text-gray-500 text-center py-8">
          이 스타일은 추가 조정이 필요 없습니다
        </p>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
          transition: all 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </div>
  );
}