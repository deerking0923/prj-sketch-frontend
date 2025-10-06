'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import StyleSelector from '@/components/StyleSelector';
import { fetchStyles, convertImage } from '@/lib/api';

// 8개 스타일 정의
const STYLES = {
  ink_drawing: { label: '잉크 드로잉', icon: '🖊️' },
  detailed_sketch: { label: '디테일 스케치', icon: '✏️' },
  oil_painting: { label: '유화', icon: '🖌️' },
  cartoon: { label: '카툰', icon: '😊' },
  watercolor: { label: '수채화', icon: '🖼️' },
  mosaic: { label: '모자이크', icon: '🔲' },
  cel_shading: { label: '셀 쉐이딩', icon: '💫' },
  pointillism: { label: '점묘화', icon: '🎭' }
};

export default function Home() {
  const [styles, setStyles] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('ink_drawing');
  const [parameters, setParameters] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStyles()
      .then((data) => setStyles(data.styles))
      .catch((err) => {
        console.error('Failed to load styles:', err);
        setError('스타일 목록을 불러오는데 실패했습니다.');
      });
  }, []);

  useEffect(() => {
    if (styles && selectedStyle && styles[selectedStyle]) {
      const defaultParams = {};
      styles[selectedStyle].parameters.forEach((param) => {
        defaultParams[param.name] = param.default;
      });
      setParameters(defaultParams);
    }
  }, [selectedStyle, styles]);

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    setSelectedImageUrl(URL.createObjectURL(file));
    setConvertedImage(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('이미지를 먼저 선택해주세요.');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const result = await convertImage(selectedFile, selectedStyle, parameters);
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setConvertedImage(`data:image/png;base64,${result.sketch_image_base64}`);
        setLoading(false);
        setProgress(0);
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || '변환에 실패했습니다.');
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = `converted_${selectedStyle}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!styles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-gray-700">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-6 sm:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            이미지 변환기
          </h1>
          <p className="text-sm sm:text-lg text-gray-600">사진을 예술작품으로 변환하세요</p>
        </div>

        {/* 스타일 선택 (8개) */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/50">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 text-center">🎨 스타일 선택</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
              {Object.entries(STYLES).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStyle(key)}
                  className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                    selectedStyle === key
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-1">{style.icon}</div>
                  <div className="text-xs sm:text-sm font-semibold">{style.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 파라미터 조정 & 이미지 업로드 (모바일: 파라미터 먼저, 데스크톱: 이미지 먼저) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* 모바일: 파라미터가 먼저 / 데스크톱: 이미지가 먼저 */}
          <div className="order-2 lg:order-1">
            <ImageUploader onImageSelect={handleImageSelect} selectedImage={selectedImageUrl} />
          </div>
          <div className="order-1 lg:order-2">
            <StyleSelector
              styles={styles}
              selectedStyle={selectedStyle}
              parameters={parameters}
              onParameterChange={(name, value) => setParameters(prev => ({ ...prev, [name]: value }))}
            />
          </div>
        </div>

        {/* 변환 버튼 */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={handleConvert}
            disabled={!selectedFile || loading}
            className="px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
          >
            {loading ? '✨ 변환 중...' : '🚀 변환하기'}
          </button>

          {loading && (
            <div className="mt-4 sm:mt-6 max-w-md mx-auto px-4">
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600">
                {Math.round(progress)}% 완료
              </p>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl mb-6 sm:mb-8 text-sm sm:text-base">
            ❌ {error}
          </div>
        )}

        {/* 변환 결과 */}
        {convertedImage && (
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800">✨ 변환 결과</h2>
              <button 
                onClick={handleDownload} 
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                💾 다운로드
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-center text-sm sm:text-base font-semibold text-gray-600 mb-2 sm:mb-3">원본</h3>
                <img src={selectedImageUrl} alt="Original" className="w-full rounded-xl shadow-lg" />
              </div>
              <div>
                <h3 className="text-center text-sm sm:text-base font-semibold text-gray-600 mb-2 sm:mb-3">
                  {STYLES[selectedStyle].label}
                </h3>
                <img src={convertedImage} alt="Converted" className="w-full rounded-xl shadow-lg" />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}