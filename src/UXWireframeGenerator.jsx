import React, { useState } from 'react';
import { Upload, FileText, Info, Edit, Download, Eye } from 'lucide-react';
import EmailPopup from './EmailPopup';
import { CLOUDINARY_CONFIG } from './config/cloudinary';



const UXWireframeGenerator = () => {
  const [selectedWireframe, setSelectedWireframe] = useState('Motiff');
  const [uploadType, setUploadType] = useState('motiffPath');
  const [motiffPath, setMotiffPath] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
const [generatedInstructions, setGeneratedInstructions] = useState('');
  
  

  const handleFileUpload = async (section, event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
  
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('folder', `uxwireframe/${section}`);
  
        const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
          method: 'POST',
          body: formData
        });
  
        if (!response.ok) {
          throw new Error('Upload failed');
        }
  
        const data = await response.json();
  
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          url: data.secure_url,
          path: data.public_id,
          uploadDate: new Date().toISOString()
        };
      });
  
      const uploadedFiles = await Promise.all(uploadPromises);
  
      setUploads(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          files: [...prev[section].files, ...uploadedFiles]
        }
      }));
  
      // Store paths for ML team
      const filePaths = uploadedFiles.map(file => ({
        name: file.name,
        cloudinaryUrl: file.url,
        publicId: file.path
      }));
  
      console.log('File paths for ML team:', filePaths);
  
    } catch (error) {
      console.error('Upload failed:', error);
      // Add error handling UI here
    }
  };
  
  // Add a function to get all file paths
  const getAllFilePaths = () => {
    const paths = {};
    Object.keys(uploads).forEach(section => {
      paths[section] = uploads[section].files.map(file => ({
        name: file.name,
        cloudinaryUrl: file.url,
        publicId: file.path
      }));
    });
    return paths;
  };
  
  // Add export paths button handler
  const handleExportPaths = () => {
    const paths = getAllFilePaths();
    const blob = new Blob([JSON.stringify(paths, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloudinary-paths.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  const handleGenerateClick = async () => {
    if (!isVerified) {
      setShowEmailPopup(true);
      return;
    }
  
    setIsGenerating(true);
    try {
      const response = await fetch('https://featurebackend.onrender.com/fetchfile/generate');
      
      if (!response.ok) {
        throw new Error('Failed to generate instructions');
      }
  
      const data = await response.json();
      setGeneratedInstructions(data.instructions);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate instructions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async (email) => {
    setEmail(email);
    setIsVerified(true);
    setShowEmailPopup(false);
    
    // Automatically trigger generate instructions
    setIsGenerating(true);
    try {
      const response = await fetch('https://featurebackend.onrender.com/fetchfile/generate');
      
      if (!response.ok) {
        throw new Error('Failed to generate instructions');
      }
  
      const data = await response.json();
      setGeneratedInstructions(data.instructions);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate instructions. Please try again.');
    } finally {
      setIsGenerating(false);
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

  const [uploads, setUploads] = useState({
    uxSpecs: { text: '', pendingFiles: [], files: [] },
    userResearch: { text: '', pendingFiles: [], files: [] },
    requirements: { text: '', pendingFiles: [], files: [] },
    meetingNotes: { text: '', pendingFiles: [], files: [] }
  });

  const handleLocalFileUpload = (section, event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length === 0) return;
    setUploads(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        pendingFiles: [...prev[section].pendingFiles, ...newFiles]
      }
    }));
  };
  
  const handleTextChange = (section, value) => {
    setUploads(prev => ({
      ...prev,
      [section]: { ...prev[section], text: value }
    }));
    // Save to localStorage
    localStorage.setItem('wireframeUploads', JSON.stringify({
      ...uploads,
      [section]: { ...uploads[section], text: value }
    }));
  };

  const handleSaveFiles = async () => {
    const sections = ['uxSpecs', 'userResearch', 'requirements', 'meetingNotes'];
    const missing = sections.filter(section => uploads[section].pendingFiles.length === 0);
    if (missing.length > 0) {
      alert(`You must select files for: ${missing.join(', ')}`);
      return;
    }
  
    try {
      for (const section of sections) {
        const pending = uploads[section].pendingFiles;
        const uploadPromises = pending.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'frontend_uploads');
          formData.append('folder', `uxwireframe/${section}`);
          // Add filename as public_id prefix (allowed parameter)
          formData.append('filename_override', file.name);
  
          const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
            method: 'POST',
            body: formData
          });
  
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
          }
  
          const data = await response.json();
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            url: data.secure_url,
            path: data.public_id,
            uploadDate: new Date().toISOString()
          };
        });
  
        const uploadedFiles = await Promise.all(uploadPromises);
        setUploads(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            files: [...prev[section].files, ...uploadedFiles],
            pendingFiles: []
          }
        }));
      }
      fetchLatestFourFiles();
      alert('All files have been uploaded successfully.');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(`Error uploading files: ${error.message}`);
    }
  };

  const fetchLatestFourFiles = async () => {
    try {
        const response = await fetch('https://featurebackend.onrender.com/fetchfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        console.log("Latest Four Files:", data);
        return data;

    } catch (error) {
        console.error("Error fetching latest four files:", error);
        return [];
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
      {/* <button 
    className="ml-auto bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
    onClick={handleExportPaths}
  >
    Export File Paths
  </button> */}
      
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
       
        {/* <div className="border rounded-lg p-4">
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
        </div> */}

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
    value={uploads.uxSpecs.text}
    onChange={(e) => handleTextChange('uxSpecs', e.target.value)}
  />
  <div className="flex flex-col space-y-2">
    <input
      type="file"
      id="uxSpecs-upload"
      className="hidden"
      multiple
      onChange={(e) => handleLocalFileUpload('uxSpecs', e)}
    />
    <label 
      htmlFor="uxSpecs-upload"
      className="flex items-center text-indigo-600 text-sm font-medium cursor-pointer"
    >
      <Upload size={16} className="mr-1" />
      Upload file
    </label>
    {(uploads.uxSpecs.pendingFiles.length > 0 || uploads.uxSpecs.files.length > 0) && (
      <div className="mt-2">
        <p className="text-xs text-gray-600 mb-1">Selected files:</p>
        <ul className="text-xs text-gray-600">
          {uploads.uxSpecs.pendingFiles.map((file, index) => (
            <li key={`pending-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
          {uploads.uxSpecs.files.map((file, index) => (
            <li key={`uploaded-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

  {/* User Research */}
  <div className="border rounded-lg p-4">
    <div className="flex items-start mb-2">
      <Info size={18} className="mr-2 text-gray-600 mt-1" />
      <div>
        <h3 className="font-semibold text-gray-800">User Research</h3>
        <p className="text-xs text-gray-600">Add insights from user interviews, surveys, and analytics</p>
      </div>
    </div>
    <textarea 
      className="w-full h-32 border rounded p-2 text-sm mb-2"
      placeholder="Paste your user research data here..."
      value={uploads.userResearch.text}
      onChange={(e) => handleTextChange('userResearch', e.target.value)}
    />
    <div className="flex flex-col space-y-2">
      <input
        type="file"
        id="userResearch-upload"
        className="hidden"
        multiple
        onChange={(e) => handleLocalFileUpload('userResearch', e)}
      />
      <label 
        htmlFor="userResearch-upload"
        className="flex items-center text-indigo-600 text-sm font-medium cursor-pointer"
      >
        <Upload size={16} className="mr-1" />
        Upload file
      </label>
      {(uploads.userResearch.pendingFiles.length > 0 || uploads.userResearch.files.length > 0) && (
      <div className="mt-2">
        <p className="text-xs text-gray-600 mb-1">Selected files:</p>
        <ul className="text-xs text-gray-600">
          {uploads.userResearch.pendingFiles.map((file, index) => (
            <li key={`pending-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
          {uploads.userResearch.files.map((file, index) => (
            <li key={`uploaded-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  </div>

  {/* Requirements Documentation */}
  <div className="border rounded-lg p-4">
    <div className="flex items-start mb-2">
      <FileText size={18} className="mr-2 text-gray-600 mt-1" />
      <div>
        <h3 className="font-semibold text-gray-800">Requirements Doc</h3>
        <p className="text-xs text-gray-600">Include functional and technical requirements</p>
      </div>
    </div>
    <textarea 
      className="w-full h-32 border rounded p-2 text-sm mb-2"
      placeholder="Paste your requirements here..."
      value={uploads.requirements.text}
      onChange={(e) => handleTextChange('requirements', e.target.value)}
    />
    <div className="flex flex-col space-y-2">
      <input
        type="file"
        id="requirements-upload"
        className="hidden"
        multiple
        onChange={(e) => handleLocalFileUpload('requirements', e)}
      />
      <label 
        htmlFor="requirements-upload"
        className="flex items-center text-indigo-600 text-sm font-medium cursor-pointer"
      >
        <Upload size={16} className="mr-1" />
        Upload file
      </label>

{(uploads.requirements.pendingFiles.length > 0 || uploads.requirements.files.length > 0) && (
      <div className="mt-2">
        <p className="text-xs text-gray-600 mb-1">Selected files:</p>
        <ul className="text-xs text-gray-600">
          {uploads.requirements.pendingFiles.map((file, index) => (
            <li key={`pending-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
          {uploads.requirements.files.map((file, index) => (
            <li key={`uploaded-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    )}

    </div>
  </div>

  {/* Meeting Notes */}
  <div className="border rounded-lg p-4">
    <div className="flex items-start mb-2">
      <FileText size={18} className="mr-2 text-gray-600 mt-1" />
      <div>
        <h3 className="font-semibold text-gray-800">Meeting Notes</h3>
        <p className="text-xs text-gray-600">Include discussion points and decisions</p>
      </div>
    </div>
    <textarea 
      className="w-full h-32 border rounded p-2 text-sm mb-2"
      placeholder="Paste your meeting notes here..."
      value={uploads.meetingNotes.text}
      onChange={(e) => handleTextChange('meetingNotes', e.target.value)}
    />
    <div className="flex flex-col space-y-2">
      <input
        type="file"
        id="meetingNotes-upload"
        className="hidden"
        multiple
        onChange={(e) => handleLocalFileUpload('meetingNotes', e)}
      />
      <label 
        htmlFor="meetingNotes-upload"
        className="flex items-center text-indigo-600 text-sm font-medium cursor-pointer"
      >
        <Upload size={16} className="mr-1" />
        Upload file
      </label>
      {(uploads.meetingNotes.pendingFiles.length > 0 || uploads.meetingNotes.files.length > 0) && (
      <div className="mt-2">
        <p className="text-xs text-gray-600 mb-1">Selected files:</p>
        <ul className="text-xs text-gray-600">
          {uploads.meetingNotes.pendingFiles.map((file, index) => (
            <li key={`pending-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
          {uploads.meetingNotes.files.map((file, index) => (
            <li key={`uploaded-${index}`} className="flex items-center">
              <FileText size={12} className="mr-1" />
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>

    
  </div>
  <div className="flex justify-start">
  <button 
    className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
    onClick={handleSaveFiles}
  >
    Upload Files
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
        
        <button 
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
          onClick={handleGenerateClick}
        >
          Generate Wireframe Instructions
        </button>
      </div>

      



{isVerified && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... existing instructions and wireframes boxes ... */}
        
      
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
    {isGenerating ? (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Generating Instructions</p>
          <p className="text-sm text-gray-500">Please wait while we process your files...</p>
        </div>
      </div>
    ) : generatedInstructions ? (
      <div className="prose prose-sm max-w-none">
        {generatedInstructions.split('\n').map((line, index) => {
          if (line.startsWith('**')) {
            return <h3 key={index} className="font-bold text-lg mt-4">{line.replace(/\*\*/g, '')}</h3>;
          } else if (line.startsWith('---')) {
            return <hr key={index} className="my-4" />;
          } else if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
            return <li key={index} className="ml-4">{line}</li>;
          } else {
            return <p key={index} className="mb-2">{line}</p>;
          }
        })}
      </div>
    ) : (
      <div className="text-center py-12 text-gray-500">
        <p>Click "Generate Wireframe Instructions" to start</p>
      </div>
    )}
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
                    
              
            </div>
          </div>
        </div>
      </div>
      )}


      {showEmailPopup && (
        <EmailPopup
          onSubmit={handleEmailSubmit}
          onClose={() => setShowEmailPopup(false)}
        />
      )}
    </div>
  );
};

export default UXWireframeGenerator;