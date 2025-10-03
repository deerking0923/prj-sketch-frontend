'use client';

export default function StyleSelector({
  styles,
  selectedStyle,
  onStyleChange,
  parameters,
  onParameterChange,
}) {
  const currentStyle = styles[selectedStyle];

  const renderParameter = (param) => {
    const value = parameters[param.name] ?? param.default;

    if (param.type === 'int' || param.type === 'float') {
      return (
        <div key={param.name} className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {param.description}
            <span className="text-gray-500 ml-2">(현재: {value})</span>
          </label>
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{param.min}</span>
            <span>{param.max}</span>
          </div>
        </div>
      );
    }

    if (param.type === 'bool') {
      return (
        <div key={param.name} className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onParameterChange(param.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded mr-2"
            />
            <span className="text-sm font-medium">{param.description}</span>
          </label>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">스타일 선택</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">변환 스타일</label>
        <select
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(styles).map((key) => (
            <option key={key} value={key}>
              {key.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </option>
          ))}
        </select>
      </div>

      {currentStyle && currentStyle.parameters.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">파라미터 조정</h3>
          {currentStyle.parameters.map(renderParameter)}
        </div>
      )}
    </div>
  );
}