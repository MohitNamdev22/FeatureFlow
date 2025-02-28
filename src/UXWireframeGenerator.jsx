import React, { useState } from 'react';
import { Upload, FileText, Info, Edit, Download, Eye } from 'lucide-react';

const UXWireframeGenerator = () => {
  const [selectedWireframe, setSelectedWireframe] = useState('Motiff');
  const [uploadType, setUploadType] = useState('motiffPath');
  const [motiffPath, setMotiffPath] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Define the renderUploadSection function that was missing
  const renderUploadSection = () => {
    if (uploadType === 'fileUpload') {
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            className="hidden"
            id="wireframeUpload"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="wireframeUpload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : 'Click to upload wireframe'}
            </span>
            <span className="text-xs text-gray-400 mt-1">Supports: PNG, JPG, SVG</span>
          </label>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Enter Motiff Path</label>
          <input
            type="text"
            className="w-full border rounded-md py-2 px-3 text-sm"
            placeholder="e.g., /designs/wireframes/motiff"
            value={motiffPath}
            onChange={(e) => setMotiffPath(e.target.value)}
          />
          <button 
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
            onClick={() => console.log('Using Motiff path:', motiffPath)}
          >
            Use Path
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center mb-8 border-b pb-4">
        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
          <FileText className="text-indigo-600" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">AI-Powered UX Wireframe Generator</h1>
          <p className="text-gray-600 text-sm">Paste your UX inputs and generate a structured wireframe.</p>
        </div>
      </div>
      
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* UX Specs */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start mb-2">
            <FileText size={18} className="mr-2 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">UX Specs (BA)</h3>
              <p className="text-xs text-gray-600">Include layout requirements, component specs, and design guidelines.</p>
            </div>
          </div>
          <textarea 
            className="w-full h-32 border rounded p-2 text-sm mb-2"
            placeholder="Paste your UX specifications here..."
          />
          <button className="flex items-center text-indigo-600 text-sm font-medium">
            <Upload size={16} className="mr-1" />
            Upload file
          </button>
        </div>
        
        {/* User Research */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start mb-2">
            <Info size={18} className="mr-2 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">User Research (from dovetail)</h3>
              <p className="text-xs text-gray-600">Add insights from user interviews, surveys, and analytics</p>
            </div>
          </div>
          <textarea 
            className="w-full h-32 border rounded p-2 text-sm mb-2"
            placeholder="Paste your user research data here..."
          />
          <button className="flex items-center text-indigo-600 text-sm font-medium">
            <Upload size={16} className="mr-1" />
            Upload file
          </button>
        </div>
        
        {/* Requirement Documentation */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start mb-2">
            <FileText size={18} className="mr-2 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Requirement Documentation (BA)</h3>
              <p className="text-xs text-gray-600">Include functional and technical requirements</p>
            </div>
          </div>
          <textarea 
            className="w-full h-32 border rounded p-2 text-sm mb-2"
            placeholder="Paste your requirements here..."
          />
          <button className="flex items-center text-indigo-600 text-sm font-medium">
            <Upload size={16} className="mr-1" />
            Upload file
          </button>
        </div>
        
        {/* Meeting Notes */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start mb-2">
            <FileText size={18} className="mr-2 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Meeting Notes</h3>
              <p className="text-xs text-gray-600">Include functional and technical requirements</p>
            </div>
          </div>
          <textarea 
            className="w-full h-32 border rounded p-2 text-sm mb-2"
            placeholder="Paste your requirements here..."
          />
          <button className="flex items-center text-indigo-600 text-sm font-medium">
            <Upload size={16} className="mr-1" />
            Upload file
          </button>
        </div>
      </div>
      
      {/* Wireframe Selection & Generate Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4">
            <span className="text-sm text-gray-600 block mb-2">Wireframe</span>
            <div className="relative">
              <select 
                className="appearance-none bg-white border rounded-md py-2 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                value={selectedWireframe}
                onChange={(e) => setSelectedWireframe(e.target.value)}
              >
                <option>Motiff</option>
                <option>Uizard Autodesigner</option>
                <option>MockFlow's</option>
                <option>Jeda.ai</option>
                <option>WireGen</option>
                <option>Krisspy</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <button className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
          Generate Wireframe Instructions
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instructions Box */}
        <div className="border rounded-lg">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-medium">Generated Instructions</h3>
            <div className="flex items-center">
              <button className="flex items-center text-gray-600 mr-3">
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button className="flex items-center text-gray-600">
                <Download size={16} className="mr-1" />
                Export
              </button>
            </div>
          </div>
                
          {/* Added max-height and overflow-y-auto for scrolling */}
          <div className="p-4 relative max-h-[600px] overflow-y-auto">
            <div className="pr-12">
              <p className="mb-3">Here are the Motiff design instructions for the Brainstorming Canvas model screen in Idea360.</p>
              
              <p className="text-red-600 font-semibold mb-3">📌 Motiff Instructions – Brainstorming Canvas</p>
              
              <p className="font-semibold mb-1">Component Type: Full-Screen Modal / Workspace Layout</p>
              <p className="mb-3">Purpose: Provides an interactive canvas where users can capture, organize, and refine ideas visually during brainstorming sessions.</p>
              
              <p className="text-indigo-600 font-semibold mb-3">🖌 UI Design Guidelines</p>
              
              <p className="font-semibold mb-2">1️⃣ Layout & Structure</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Screen Type: Full-screen workspace</li>
                <li>Background Color: Light gray (#F5F5F5)</li>
                <li>Padding: 24px</li>
                <li>Grid System: Flexible, supports free-form idea placement</li>
                <li>Primary Sections:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Header Bar – Controls & Session Info</li>
                    <li>Canvas Area – Free-form idea organization</li>
                    <li>Sidebar (Optional) – Idea categories, templates, or suggested prompts</li>
                  </ul>
                </li>
              </ul>
            </div>
                
            <button className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
              Upload Lofi Design
            </button>
          </div>
        </div>

        {/* Wireframes Box - Right Column */}
        <div className="border rounded-lg">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-medium">Final Wireframes</h3>
            <div className="flex items-center space-x-2">
              <select
                className="border rounded-md py-1 px-3 text-sm"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
              >
                <option value="motiffPath">Motiff Path</option>
                <option value="fileUpload">Upload File</option>
              </select>
              <button className="flex items-center text-gray-600">
                <Eye size={16} className="mr-1" />
                Preview
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {renderUploadSection()}
            
            {/* Preview Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-2">Preview</h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="border rounded bg-gray-50">
                  <img src="/api/placeholder/120/100" alt="Wireframe preview" className="w-full h-full object-cover" />
                </div>
                <div className="border rounded bg-gray-50">
                  <img src="/api/placeholder/120/100" alt="Wireframe preview" className="w-full h-full object-cover" />
                </div>
                <div className="border rounded bg-gray-50">
                  <img src="/api/placeholder/120/100" alt="Wireframe preview" className="w-full h-full object-cover" />
                </div>
              </div>
                    
              <div className="border rounded-lg overflow-hidden mb-4">
                <table className="w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left text-xs font-medium text-gray-600">Section</th>
                      <th className="p-2 text-left text-xs font-medium text-gray-600">Type</th>
                      <th className="p-2 text-left text-xs font-medium text-gray-600">Description</th>
                      <th className="p-2 text-left text-xs font-medium text-gray-600">Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2 text-xs">Header</td>
                      <td className="p-2 text-xs">Fixed</td>
                      <td className="p-2 text-xs">Contains page title</td>
                      <td className="p-2 text-xs">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 text-xs flex items-center">
                            <Edit size={12} className="mr-1" />
                            Edit
                          </button>
                          <button className="text-indigo-600 text-xs flex items-center">
                            <Eye size={12} className="mr-1" />
                            Preview
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 text-xs">Footer</td>
                      <td className="p-2 text-xs">Fixed</td>
                      <td className="p-2 text-xs">Contains actions</td>
                      <td className="p-2 text-xs">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 text-xs flex items-center">
                            <Edit size={12} className="mr-1" />
                            Edit
                          </button>
                          <button className="text-indigo-600 text-xs flex items-center">
                            <Eye size={12} className="mr-1" />
                            Preview
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 text-xs">Content</td>
                      <td className="p-2 text-xs">Dynamic</td>
                      <td className="p-2 text-xs">Main content area</td>
                      <td className="p-2 text-xs">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 text-xs flex items-center">
                            <Edit size={12} className="mr-1" />
                            Edit
                          </button>
                          <button className="text-indigo-600 text-xs flex items-center">
                            <Eye size={12} className="mr-1" />
                            Preview
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UXWireframeGenerator;