
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdPhotos } from "react-icons/io";
import { LuAtom } from "react-icons/lu";
import { MdError } from "react-icons/md";
import { TbFileReport, TbPhotoScan } from "react-icons/tb";
import { Slide, toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import Dialog from './components/Dialog';
import DiseaseDetails from './components/DiseaseDetails';
import ProgressBar from './components/ProgressBar';
import ResultList from './components/ResultList';
import SliderRange from './components/SliderRange';
import Switch from './components/Switch';
import { diseasesInfo } from './utils/diseasesHelper';
import { Camera, Home, ImageUp, Settings } from "lucide-react";
import { supabase } from "./Supabase";
import axios from "axios";
import logo from "./assets/Icon.svg";
import React from "react";
import Webcam from "react-webcam";

function App() {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [tensorData, setTensorData] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [confidence, setConfidence] = useState(40);
  const [showAnnotations, setAnnotations] = useState(true);
  const [showConfindence, setShowConfidence] = useState(true);
  const [translate, setTranslate] = useState(false);
  const [inferencing, setInferencing] = useState(false);
  const [results, setResults] = useState([])
  const [inference, setInference] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState();
  const [diseasesResult, setDiseases] = useState([]);
  const imageCaptureRef = useRef(null);
  const [showCameraOptions, setCameraOptions] = useState(false);


  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input click
  };

  const handleCameraClick = () => {
    imageCaptureRef.current?.click(); // Trigger file input click
  };

  const toggleCameraOptions = () => {
    setCameraOptions(value => !value);
  }

  const handleCaptureChange = (event) => {
    setResults([]);
    const file = event.target.files?.[0];
    if (file) {
      // Set metadata
      setMetadata({
        name: file.name,
        type: file.type,
        size: (file.size / (1024 * 1024)).toFixed(2)
      });

      // Read and display original image
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 640;
          const ctx = canvas.getContext('2d');

          // Store resized dimensions instead of original
          const dimensions = { width: canvas.width, height: canvas.height };

          // Fill with black background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 640, 640);

          // Calculate scaling to maintain aspect ratio
          const scale = Math.min(640 / img.width, 640 / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Calculate centering position
          const x = (640 - scaledWidth) / 2;
          const y = (640 - scaledHeight) / 2;

          // Draw the image centered with maintained aspect ratio
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

          // Get image data for tensor processing
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Create tensor array
          const tensorArray = new Float32Array(3 * canvas.width * canvas.height);

          // Convert image data to tensor format
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const pixelIndex = (y * canvas.width + x) * 4;
              const tensorIndex = y * canvas.width + x;

              tensorArray[tensorIndex] = data[pixelIndex] / 255.0;
              tensorArray[tensorIndex + canvas.width * canvas.height] =
                data[pixelIndex + 1] / 255.0;
              tensorArray[tensorIndex + 2 * canvas.width * canvas.height] =
                data[pixelIndex + 2] / 255.0;
            }
          }

          const tensorData = {
            data: tensorArray,
            shape: [1, 3, canvas.height, canvas.width]
          };

          // Store tensorData and resized dimensions
          setTensorData(tensorData);
          setImageDimensions(dimensions);

          console.log('tensorData', tensorData);
          console.log('dimensions', dimensions);

          // Set the image preview
          const resizedDataUrl = canvas.toDataURL('image/jpeg');
          setSelectedImage(resizedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setCameraOptions(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional: adds smooth scrolling
      });
    }
  };

  const handleFileChange = (event) => {
    setResults([]);
    const file = event.target.files?.[0];
    if (file) {

      // Set metadata
      setMetadata({
        name: file.name,
        type: file.type,
        size: (file.size / (1024 * 1024)).toFixed(2)
      });

      // Read and display original image
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 640;
          const ctx = canvas.getContext('2d');

          // Store resized dimensions instead of original
          const dimensions = { width: canvas.width, height: canvas.height };

          // Fill with black background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 640, 640);

          // Calculate scaling to maintain aspect ratio
          const scale = Math.min(640 / img.width, 640 / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Calculate centering position
          const x = (640 - scaledWidth) / 2;
          const y = (640 - scaledHeight) / 2;

          // Draw the image centered with maintained aspect ratio
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

          // Get image data for tensor processing
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Create tensor array
          const tensorArray = new Float32Array(3 * canvas.width * canvas.height);

          // Convert image data to tensor format
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const pixelIndex = (y * canvas.width + x) * 4;
              const tensorIndex = y * canvas.width + x;

              tensorArray[tensorIndex] = data[pixelIndex] / 255.0;
              tensorArray[tensorIndex + canvas.width * canvas.height] =
                data[pixelIndex + 1] / 255.0;
              tensorArray[tensorIndex + 2 * canvas.width * canvas.height] =
                data[pixelIndex + 2] / 255.0;
            }
          }

          const tensorData = {
            data: tensorArray,
            shape: [1, 3, canvas.height, canvas.width]
          };

          // Store tensorData and resized dimensions
          setTensorData(tensorData);
          setImageDimensions(dimensions);

          console.log('tensorData', tensorData);
          console.log('dimensions', dimensions);

          // Set the image preview
          const resizedDataUrl = canvas.toDataURL('image/jpeg');
          setSelectedImage(resizedDataUrl);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
      setCameraOptions(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional: adds smooth scrolling
      });
    }
  };


  const uploadImageToSupabase = async () => {
    setInferencing(true);
    if (!selectedImage) {
      setInferencing(false);
      toast.error('Upload an Image', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
      console.log(error)
      return;
    }

    try {
      const blob = dataURLtoBlob(selectedImage);

      const fileName = `image_${Date.now()}.jpg`; // Generate unique filename

      const { data, error } = await supabase.storage
        .from("detections") // Replace with your actual bucket name
        .upload(`uploads/${fileName}`, blob, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from("detections")
        .getPublicUrl(`uploads/${fileName}`);

      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/maize-detection-ojwjw/7", // Replace with your actual model endpoint
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          image: urlData.publicUrl,
          confidence: 10,
        },
        headers: {
          "Content-Type": "application/json", // Example of setting content type
        },

      });

      const labelMap = {
        'healthy': 'Healthy',
        'corn_rust': 'Common Corn Rust (Fungal)',
        'leaf_blight': 'Northern Leaf Blight (Fungal)',
        'leaf_spot': 'Gray Leaf Spot (Fungal)'
      }

      setResults(response.data.predictions)
      const diseases = response.data.predictions.map(value => ({
        label: labelMap[value.class],
        confidence: value.confidence
      }));

      setDiseases(diseases);
      console.log(diseases);

      console.log('response', response.data.predictions);
      setInferencing(false);
    } catch (error) {
      setInferencing(false);
      toast.error('Something Went Wrong!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
      console.log(error)
    }

  };

  // Helper: Convert base64 to Blob
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };


  const handleConfidenceChange = (value) => {
    setConfidence(value);
  };

  const handleHome = () => {
    setSelectedImage(null)
    setDiseases([])
    setResults([])
  }

  const toggleAnnotations = (value) => {
    setAnnotations(value)
  }

  const toggleTranslation = (value) => {
    setTranslate(value)
  }


  const toggleConfidence = (value) => {
    setShowConfidence(value)
  }

  const drawAnnotations = (results) => {
    if (!showAnnotations || !imageDimensions) return;

    const colorMap = {
      'Healthy': '#22c55e',
      'Common Corn Rust': '#f59e0b',
      'Northern Leaf Blight': '#ef4444',
      'Gray Leaf Spot': '#3b82f6'
    };
    const labelMap = {
      'healthy': 'Healthy',
      'corn_rust': 'Common Corn Rust (Fungal)',
      'leaf_blight': 'Northern Leaf Blight (Fungal)',
      'leaf_spot': 'Gray Leaf Spot (Fungal)'
    }


    console.log('results', results);
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');


    results.forEach(result => {
      const { x, y, width, height, class: className, confidence: detectionConf } = result;

      console.log();
      const x1 = x - (width / 2);
      const y1 = y - (height / 2);
      const x2 = x + (width / 2);
      const y2 = y + (height / 2);

      const percentage = Math.round(detectionConf * 100);
      if (percentage >= confidence) {
        // Calculate width and height of the box
        const boxWidth = x2 - x1;
        const boxHeight = y2 - y1;

        // Set styling for the box and text
        ctx.strokeStyle = colorMap[labelMap[className]] || '#000000'; // Default to black if no color map match
        ctx.lineWidth = 5;
        ctx.fillStyle = '#FFFFFF'; // White for the text
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';

        // Draw the bounding box using calculated coordinates
        ctx.strokeRect(x1, y1, boxWidth, boxHeight);

        // Optionally, draw label text above the bounding box
        if (showAnnotations) {
          ctx.fillStyle = '#FFFFFF'; // White color for the text
          ctx.fillText(labelMap[className], x1 + 5, y1 + 17);   // Adjust text position above the box
        }

      }

    });

    return canvas.toDataURL();
  };


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setSettings] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const openSettings = () => setSettings(true);
  const closeSettings = () => setSettings(false);

  // Add this new useEffect specifically for handling scroll position
  useEffect(() => {
    // Force scroll to top on component mount
    window.scrollTo(0, 0);

    // Add event listener for resize to handle orientation changes
    const handleResize = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const initializeModel = async () => {
      try {
        setInitializing(true);

        console.log('model initialized');
        window.scrollTo(0, 0);
      } catch (error) {
        console.log('model not initialized', error);
        setError(error)
      } finally {
        setInitializing(false);

      }
    }

    let interval;
    if (initializing && progress < 100) {
      interval = setInterval(() => {
        setProgress(prevProgress =>
          Math.min(prevProgress + 10, 100)
        );
      }, 500);
    }

    initializeModel();
    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <ToastContainer />
      <Dialog isOpen={isSettingsOpen} onClose={closeSettings} title="Settings">
        <div className="flex flex-col w-full justify-center items-center  gap-5">
          <Switch
            label={'Translate to bisaya'}
            initialState={false}
            onChange={toggleTranslation}
          />
          <Switch
            label={'Show Annotations'}
            initialState={true}
            onChange={toggleAnnotations}
          />
          <Switch
            label={'Show Confidence Level'}
            initialState={true}
            onChange={toggleConfidence}
          />
          <SliderRange
            label={'Confidence'}
            initialValue={25}
            onChange={handleConfidenceChange}
          />
        </div>
      </Dialog>
      <Dialog isOpen={isDialogOpen} onClose={closeDialog} title="Detailed Report">
        <DiseaseDetails results={diseasesInfo(diseasesResult.filter((item) => item.confidence * 100 >= confidence), translate)} />
      </Dialog>

      <Dialog isOpen={showCameraOptions} onClose={toggleCameraOptions} title="">
        <div className='flex flex-row gap-12 justify-center items-center'>
          <div className='flex flex-col items-center justify-center'>
            <button
              onClick={handleCameraClick}
              className=" transition-all hover:scale-95 bg-green-600 hover:bg-green-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
            >
              <Camera color="white" size={24} />
            </button>
            <span className='text-sm font-semibold'>
              Capture Image
            </span>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <button
              onClick={handleButtonClick}
              className=" transition-all hover:scale-95 bg-green-600 hover:bg-green-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
            >
              <ImageUp color="white" size={24} />
            </button>
            <span className='text-sm font-semibold'>
              Upload Image
            </span>
          </div>
        </div>
      </Dialog>
      <div className="relative w-full min-h-screen h-full flex bg-[#081509] flex-col overflow-hidden md:hidden">

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-3 w-full flex justify-center z-10">
          <div className="bg-white rounded-full h-16 w-[90%] shadow-lg flex justify-around items-center px-4 relative">
            <button
              onClick={toggleCameraOptions}
              className="absolute transition-all hover:scale-95 top-[-30px] left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
            >
              <Camera color="white" size={24} />
            </button>
            <button onClick={handleHome} className="text-gray-500 hover:text-black">
              <Home size={24} />
            </button>
            <div className="w-8"></div> {/* Spacer for center button */}
            <button onClick={openSettings} className="text-gray-500 hover:text-black">
              <Settings size={24} />
            </button>
          </div>
        </div>

        <div className="h-full flex flex-col items-center">
          {!selectedImage && (
            <div className="text-center h-full text-white flex flex-col justify-center gap-5 items-center p-4">
              <img src={logo} className="h-12 w-12 text-white" />
              <h2 className="font-bold text-3xl">Welcome!</h2>
              <p className="text-md">Click the camera button to start analyzing your maize leaf.</p>
            </div>
          )}

          {selectedImage && (
            <>
              <div
                id="main-canvas"
                className="relative flex justify-center items-center bg-white rounded-xl w-[90%] h-[24rem] mt-4 overflow-hidden"
              >
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Resized"
                  className="absolute h-full w-full object-contain"
                />

                {results.length > 0 && showAnnotations && (
                  <img
                    src={drawAnnotations(results) || "/placeholder.svg"}
                    alt="Annotations"
                    className="absolute h-[82%]"
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </div>
            </>
          )}

          {results.length > 0 && showConfindence && (
            <div className="max-h-24 w-[90%] p-2 rounded-lg mt-4 bg-white flex flex-col overflow-y-auto">
              <ResultList results={results.filter((result) => result.confidence * 100 >= confidence)} />
            </div>
          )}

          <div className="px-6 sm:px-24 mt-5 flex flex-col gap-2 w-full mb-32">
            {selectedImage && (
              <button
                disabled={inferencing}
                onClick={() => uploadImageToSupabase()}
                className="bg-green-600 font-bold hover:scale-95 transition-all h-12 flex items-center justify-center gap-2 text-white w-full rounded-full disabled:opacity-70"
              >
                {inferencing ? (
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
                ) : (
                  <TbPhotoScan className="h-6 w-6" />
                )}
                <span className="text-sm">Analyze Image</span>
              </button>
            )}

            {results.filter((result) => result.confidence * 100 >= confidence).length > 0 && (
              <button
                onClick={openDialog}
                className="bg-blue-600 font-bold hover:scale-95 transition-all h-12 flex items-center justify-center gap-2 text-white w-full rounded-full"
              >
                <TbFileReport className="h-6 w-6" />
                <span className="text-sm">Detailed Report</span>
              </button>
            )}
          </div>
        </div>
      </div>



      <div className='hidden bg-[#081509] md:flex md:h-screen items-center justify-center '>

        {error && !initializing && (
          <div className='flex flex-col h-full justify-center items-center'>
            <MdError className='h-24 w-24 text-red-600' />
            <span className='text-white text-lg md:text-base font-semibold'>
              Something went wrong, refresh page
            </span>
            <span className='text-gray-500 md:text-xs'>( Model isnt initialized, check model if its built )</span>
          </div>
        )}
        {initializing && (
          <div className='h-full w-full flex flex-col justify-center items-center gap-2'>
            <div className='text-white flex flex-col items-center justify-center gap-2'>
              <LuAtom className='h-7 w-7 animate-spin ' />
              <span >
                Initializing model...
              </span>
            </div>
            <div className='w-[30%]'>
              <ProgressBar progress={progress} />
            </div>
          </div>
        )}

        {!initializing && !error && (
          <>
            <div className='hidden rounded-md md:flex flex-col-reverse md:flex-row w-full h-full md:w-[90%] md:h-[80%] overflow-y-auto overflow-x-hidden bg-slate-50'>
              <div id='sidebar' className='md:grow-0 w-full md:w-[18%] gap-2 p-2 flex flex-col items-center'>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className=' hidden'

                />
                <input
                  type="file"
                  accept="image/*"
                  ref={imageCaptureRef}
                  onChange={handleCaptureChange}
                  className=' hidden'
                  capture="environment"
                />
                <button onClick={handleButtonClick} className='grow-0 p-2 font-bold text-white transition-all hover:scale-95 hover:bg-green-600 flex items-center justify-center gap-2 bg-green-800 rounded-md w-full h-10 md:h-16'>
                  <IoMdPhotos className='h-5 w-5' />
                  <span className='text-sm'>
                    Add Photo
                  </span>
                </button>
                <div className='grow-0 w-full text-sm flex flex-col items-start rounded-md justify-evenly p-2 bg-slate-300 border-2 h-[10%] md:h-[20%]'>
                  <span className='line-clamp-1'>
                    <b>Name:</b> {metadata.name}
                  </span>
                  <span>
                    <b>FileType:</b> {metadata.type}
                  </span>
                  <span>
                    <b>Size:</b> {metadata.size} mb
                  </span>
                </div>
                <button disabled={inferencing} onClick={() => uploadImageToSupabase()} className='grow-0 p-2 font-bold text-white transition-all hover:scale-95 hover:bg-green-600 flex items-center justify-center gap-2 bg-green-800 rounded-md w-full h-10 md:h-16'>
                  {inferencing ?
                    <AiOutlineLoading3Quarters className='h-5 w-5 animate-spin' />
                    : <TbPhotoScan className='h-5 w-5' />
                  }
                  <span className='text-sm'>
                    Analyze
                  </span>
                </button>
                <div className='w-full flex flex-col gap-2'>
                  <Switch
                    label={'Translate to Bisaya'}
                    initialState={false}
                    onChange={toggleTranslation}
                  />
                  <Switch
                    label={'Show Annotations'}
                    initialState={true}
                    onChange={toggleAnnotations}
                  />
                  <SliderRange
                    label={'Confidence'}
                    initialValue={25}
                    onChange={handleConfidenceChange}
                  />
                </div>
                <div className=' h-40 grow-0 md:grow-[1] w-full flex flex-col py-2 px-1 rounded-md md:h-screen min-h-0 bg-green-300'>
                  <div className='grow-0 text-center h-7'>
                    <span className='text-sm font-semibold'>
                      Results ({results.filter(result => result.confidence * 100 >= confidence).length})
                    </span>
                  </div>
                  {inference && (
                    <div className='grow-0 text-center h-7'>
                      <span className='text-xs'>
                        <b>Inference Time:</b> {inference} secs
                      </span>
                    </div>

                  )}
                  <div className='grow-[1] scrollbar scrollbar-thumb-green-800 scrollbar-track-transparent flex flex-col overflow-y-scroll'>
                    <ResultList results={results.filter(result => result.confidence * 100 >= confidence)} />
                  </div>
                </div>
                {results.filter((result) => result.confidence * 100 >= confidence).length > 0 && (
                  <>
                    <button onClick={openDialog} className='grow-0 p-2 text-sm font-bold text-white transition-all hover:scale-95 hover:bg-blue-600 flex items-center justify-center gap-2 bg-blue-800 rounded-md w-full h-10 md:h-16'>
                      <TbFileReport className='h-5 w-5' />
                      Detailed Report
                    </button>

                  </>
                )}
              </div>
              <div id='main-canvas' className='md:grow-[1] relative flex justify-center items-center bg-white'>
                {selectedImage && (
                  <>
                    {/* Background image */}
                    <img
                      src={selectedImage}
                      alt="Resized"
                      className="absolute h-full w-full object-contain"
                    />

                    {/* Annotations (foreground) */}
                    {results.length > 0 && showAnnotations && (
                      <img
                        src={drawAnnotations(results)}
                        alt="Annotations"
                        className="absolute h-[97%]"
                        style={{ pointerEvents: 'none' }} // Ensure it doesn't block clicks
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}



      </div >
    </>
  )
}

export default App
