import { Upload, ArrowRight, Shield, Zap, Image as ImageIcon } from "lucide-react";
import Section from "@/components/Section";
import { useState, useCallback, useMemo, useEffect } from "react";
import { EditView } from "@/components/EditView";
import { DropZone } from "@/components/DropZone";


const Index = () => {
    const [files, setFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('compress');
    const [objectUrls, setObjectUrls] = useState(new Set());

    const getImageDimensions = useCallback((file) => {
        return new Promise((resolve, reject) => {  // Add reject
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          setObjectUrls(prev => new Set(prev).add(objectUrl));
    
          // Add error handling for the image
          img.onerror = () => {
            console.error('Error loading image');
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image'));
          };
    
          img.onload = () => {
            console.log('Image loaded successfully:', file.name); // Debug log
            resolve({
              width: img.width,
              height: img.height,
              preview: objectUrl
            });
          };
    
          // Set src after setting up handlers
          img.src = objectUrl;
          
          // Add debug log
          console.log('Started loading image:', file.name);
        });
      }, []);
    
    const handleFilesAccepted = useCallback((acceptedFiles) => {
        console.log('Accepted files:', acceptedFiles); // Debug log
    
        const initialFiles = acceptedFiles.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          preview: null,
          width: 0,
          height: 0,
          status: 'loading'
        }));
    
        setFiles(prev => [...prev, ...initialFiles]);
        setActiveTab('edit');
    
        // Process each file independently without waiting for others
        initialFiles.forEach((fileObj) => {
          console.log('Processing file:', fileObj.name); // Debug log
          
          getImageDimensions(fileObj.file)
            .then(({ width, height, preview }) => {
              console.log('Got dimensions for:', fileObj.name, { width, height }); // Debug log
              
              setFiles(prev => {
                console.log('Updating files state for:', fileObj.name);
                const fileIndex = prev.findIndex(f => f.id === fileObj.id);
                if (fileIndex === -1) {
                  console.log('File not found in state:', fileObj.id);
                  return prev;
                }
    
                const newFiles = [...prev];
                newFiles[fileIndex] = {
                  ...newFiles[fileIndex],
                  preview,
                  width,
                  height,
                  status: 'pending'
                };
                console.log('Updated files state:', newFiles);
                return newFiles;
              });
            })
            .catch((error) => {
              console.error('Error processing file:', fileObj.name, error);
              
              setFiles(prev => {
                const fileIndex = prev.findIndex(f => f.id === fileObj.id);
                if (fileIndex === -1) return prev;
    
                const newFiles = [...prev];
                newFiles[fileIndex] = {
                  ...newFiles[fileIndex],
                  status: 'error',
                  error: 'Failed to load image'
                };
                return newFiles;
              });
            });
        });
      }, [getImageDimensions]);

    const dropZoneProps = useMemo(() => ({
        onFileAccepted: handleFilesAccepted,
        maxFiles: 10
    }), [handleFilesAccepted]);



      // Cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      objectUrls.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [objectUrls]);

    // If files are selected, show EditView
    if (activeTab === 'edit') {
        return <EditView files={files} setFiles={setFiles} onBack={() => setActiveTab('compress')} />;
    }

    return (

        activeTab === 'compress' ? (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
                {/* Hero Section */}
                <Section className="flex flex-col items-center justify-center min-h-[90vh] text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50 opacity-70"></div>
                    <div className="relative z-10">
                        <span className="text-sm font-semibold text-primary/60 mb-4 animate-fade-in">
                            SIMPLE • FAST • SECURE
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                            Compress Images
                            <br />
                            Without Losing Quality
                        </h1>
                        <p className="text-xl text-primary-light max-w-2xl mb-12 animate-fade-in">
                            Reduce file sizes instantly while maintaining crystal-clear quality.
                            No signup required.
                        </p>

                        {files.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mb-4 p-4 bg-blue-50 rounded-t-lg">
                                <p className="text-blue-600">
                                    You have {files.length} image{files.length > 1 ? 's' : ''} ready for editing
                                </p>
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className="text-blue-700 font-semibold hover:text-blue-800 transition-colors"
                                >
                                    Continue Editing →
                                </button>
                            </div>
                        )}

                        <div className="w-full max-w-[45rem] glass-card mb-8 animate-fade-in bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm">

                            <DropZone {...dropZoneProps} />
                        </div>
                    </div>
                </Section>

                {/* How It Works */}
                <Section className="relative">
                    <div className="absolute inset-0 opacity-70"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                            <p className="text-lg text-primary-light">
                                Three simple steps to optimize your images
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Upload className="w-8 h-8" />,
                                    title: "Upload",
                                    description: "Drag & drop or select your images",
                                },
                                {
                                    icon: <Zap className="w-8 h-8" />,
                                    title: "Compress",
                                    description: "We'll optimize your images instantly",
                                },
                                {
                                    icon: <ArrowRight className="w-8 h-8" />,
                                    title: "Download",
                                    description: "Save your compressed images",
                                },
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300"
                                >
                                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-primary-light">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Features */}
                <Section className="relative">
                    <div className="absolute inset-0 opacity-70"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
                            <p className="text-lg text-primary-light">
                                Powerful features for perfect compression
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    icon: <ImageIcon className="w-6 h-6" />,
                                    title: "Multiple Formats",
                                    description: "Support for PNG, JPEG, WebP and more",
                                },
                                {
                                    icon: <Zap className="w-6 h-6" />,
                                    title: "Lightning Fast",
                                    description: "Process multiple images in seconds",
                                },
                                {
                                    icon: <Shield className="w-6 h-6" />,
                                    title: "100% Secure",
                                    description: "Your images are never stored on our servers",
                                },
                                {
                                    icon: <Upload className="w-6 h-6" />,
                                    title: "Bulk Processing",
                                    description: "Compress multiple images at once",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="glass-card p-8 flex items-start hover:scale-[1.02] transition-transform duration-300"
                                >
                                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mr-6">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-primary-light">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>


                {/* Footer */}
                <footer className="section-padding text-center relative">
                    <div className="absolute inset-0 opacity-70"></div>
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <p className="text-primary-light">
                            © {new Date().getFullYear()} ImageCompressor. All rights reserved.
                        </p>
                    </div>
                </footer>
            </main>) : (

<main className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">

            <EditView
                files={files}
                setFiles={setFiles}
                onBack={() => setActiveTab('compress')}
            />
            </main>
        )
    )
}
    export default Index;