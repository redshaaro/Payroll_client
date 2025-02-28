import React, { useState, useEffect } from "react";
import UploadStep from "./UploadStep";
import MappingStep from "./MappingStep";
import { Toaster } from "react-hot-toast";

const ExcelUploadFlow = () => {
    const [step, setStep] = useState(() => Number(localStorage.getItem("upload_step")) || 1);
    const [period, setPeriod] = useState(() => localStorage.getItem("selected_period") || "");
    const [payroll, setPayRoll] = useState(() => localStorage.getItem("selected_payroll") || "");
    
    const [fileData, setFileData] = useState(() => {
        const savedFileData = localStorage.getItem("file_data");
        return savedFileData ? JSON.parse(savedFileData) : null;
    });

    // Update localStorage when states change
    useEffect(() => localStorage.setItem("upload_step", step), [step]);
    useEffect(() => localStorage.setItem("selected_period", period), [period]);
    useEffect(() => localStorage.setItem("selected_payroll", payroll), [payroll]);
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
        <div className="rounded-lg shadow-md w-full mx-auto">
            <Toaster position="top-right" />
            {step === 1 && (
                <UploadStep 
                    period={period} 
                    setPeriod={setPeriod} 
                    payroll={payroll} 
                    setPayRoll={setPayRoll} 
                    onUploadSuccess={handleUploadSuccess} 
                />
            )}
            {step === 2 && fileData && (
                <MappingStep 
                    fileData={fileData} 
                    period={period} 
                    payroll={payroll} 
                    onPrev={handlePrev} 
                />
            )}
        </div>
    );
};

export default ExcelUploadFlow;
