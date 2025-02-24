import React, { useState, useEffect } from "react";
import UploadStep from "./UploadStep";
import MappingStep from "./MappingStep";
import { Toaster } from "react-hot-toast";

const ExcelUploadFlow = () => {
    const [step, setStep] = useState(() => {
        return Number(localStorage.getItem("upload_step")) || 1;
    });

    const [fileData, setFileData] = useState(() => {
        const savedFileData = localStorage.getItem("file_data");
        return savedFileData ? JSON.parse(savedFileData) : null;
    });

    useEffect(() => {
        localStorage.setItem("upload_step", step);
    }, [step]);

    useEffect(() => {
        if (fileData) {
            localStorage.setItem("file_data", JSON.stringify(fileData));
        }
    }, [fileData]);

    const handleUploadSuccess = (data) => {
        setFileData(data);
        setStep(2);
    };

    const handlePrev = () => {
        setStep(1);
        setFileData(null);
        localStorage.setItem("upload_step", 1);
        localStorage.removeItem("file_data");
    };

    return (
        <div className="p-[20px] border rounded-lg shadow-md w-full max-w-lg mx-auto">
            <Toaster position="top-right" />
            {step === 1 && <UploadStep onUploadSuccess={handleUploadSuccess} />}
            {step === 2 && fileData && <MappingStep fileData={fileData} onPrev={handlePrev} />}
        </div>
    );
};

export default ExcelUploadFlow;
