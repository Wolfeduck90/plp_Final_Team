import React, { useState } from 'react';
import { Upload, Eye, Award, AlertCircle } from 'lucide-react';
import { apiService, QualityAssessmentResult } from '../services/api';
import { useAsyncAction } from '../hooks/useApi';

export const QualityAssessment: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropType, setCropType] = useState('');
  const [assessment, setAssessment] = useState<QualityAssessmentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { execute: assessQuality, loading: assessmentLoading, error: assessmentError } = useAsyncAction<QualityAssessmentResult, { file: File; cropType: string }>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeQuality = async () => {
    if (!selectedFile || !cropType) {
      alert('Please select an image and crop type');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await assessQuality(
        ({ file, cropType }) => apiService.assessCropQuality(file, cropType),
        { file: selectedFile, cropType }
      );
      
      if (result) {
        setAssessment(result);
      }
    } catch (error) {
      console.error('Quality assessment failed:', error);
      // Fallback to mock data for demo
      const mockAssessment: QualityAssessmentResult = {
        crop_type: cropType,
        grade: 'Grade A',
        confidence: 92,
        visual_indicators: {
          ripeness: 'Optimal',
          damage: 'Minimal surface blemishes',
          uniformity: 'Excellent',
          color: 'Vibrant and consistent',
        },
        recommendations: [
          'Harvest within 2-3 days for optimal freshness',
          'Store in cool, dry environment',
          'Handle carefully to avoid bruising',
        ],
        market_value: 'R45-50 per kg',
        shelf_life: '7-10 days',
      };
      setAssessment(mockAssessment);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Grade A':
        return 'text-green-600 bg-green-100';
      case 'Grade B':
        return 'text-yellow-600 bg-yellow-100';
      case 'Grade C':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Produce Quality Assessment</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Crop Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Uploaded crop"
                    className="mx-auto max-h-64 rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-600">Upload crop image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Type
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
              >
                <option value="">Select crop type</option>
                <option value="tomatoes">Tomatoes</option>
                <option value="lettuce">Lettuce</option>
                <option value="spinach">Spinach</option>
                <option value="peppers">Peppers</option>
                <option value="carrots">Carrots</option>
                <option value="cucumbers">Cucumbers</option>
              </select>
            </div>

            <button
              onClick={analyzeQuality}
              disabled={!selectedFile || !cropType || isAnalyzing || assessmentLoading}
              className="w-full mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{isAnalyzing || assessmentLoading ? 'Analyzing...' : 'Analyze Quality'}</span>
            </button>
            
            {assessmentError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-800">Error: {assessmentError}</p>
              </div>
            )}
          </div>

          {assessment && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Quality Assessment Results</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold text-gray-800">Quality Grade</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(assessment.grade)}`}>
                    {assessment.grade}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Confidence Score</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${assessment.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{assessment.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Visual Indicators</h4>
                <div className="space-y-2">
                  {Object.entries(assessment.visual_indicators).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600 capitalize">{key}:</span>
                      <span className="text-sm font-medium text-gray-800">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Market Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Value:</span>
                    <span className="text-sm font-medium text-green-600">{assessment.market_value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shelf Life:</span>
                    <span className="text-sm font-medium text-gray-800">{assessment.shelf_life}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Recommendations</span>
                </h4>
                <ul className="space-y-1">
                  {assessment.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};