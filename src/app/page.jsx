'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import StyleSelector from '@/components/StyleSelector';
import { fetchStyles, convertImage } from '@/lib/api';

export default function Home() {
  const [styles, setStyles] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('pencil_sketch');
  const [parameters, setParameters] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setError(null);

    try {
      const result = await convertImage(selectedFile, selectedStyle, parameters);
      setConvertedImage(`data:image/png;base64,${result.sketch_image_base64}`);
    } catch (err) {
      setError(err.message || '변환에 실패했습니다.');
    } finally {
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8">Image to Drawing Converter</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ImageUploader onImageSelect={handleImageSelect} selectedImage={selectedImageUrl} />
          <StyleSelector
            styles={styles}
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            parameters={parameters}
            onParameterChange={(name, value) => setParameters(prev => ({ ...prev, [name]: value }))}
          />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleConvert}
            disabled={!selectedFile || loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? '변환 중...' : '변환하기'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {convertedImage && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">변환 결과</h2>
              <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded">
                다운로드
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-center mb-2">원본</h3>
                <img src={selectedImageUrl} alt="Original" className="w-full rounded border" />
              </div>
              <div>
                <h3 className="text-center mb-2">변환 ({selectedStyle})</h3>
                <img src={convertedImage} alt="Converted" className="w-full rounded border" />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}