import React, { useState } from "react";
import axios from "axios";
import GenerateExcel from "../Buttons/GenerateExcel";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const UploadStep = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/api/excel/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Upload successful!");
            onUploadSuccess(response.data);
        } catch (error) {
            toast.error("Upload failed. " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 border rounded-lg shadow-md w-full max-w-lg mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center"> Upload Excel File</h2>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                    <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300">
                        Choose File
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
                    </label>

                    <span className="text-gray-500">{file ? file.name : "No file chosen"}</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg cursor-pointer text-white 
                        ${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"}
                    `}
                    >
                        {loading ? <ClipLoader size={20} color="#fff" /> : "Upload"}
                    </button>
                    <span>OR</span>
                    <GenerateExcel />
                </div>
            </div>
        </div>
    );
};

export default UploadStep;
