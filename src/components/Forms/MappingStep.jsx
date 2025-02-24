import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const MappingStep = ({ fileData, onPrev }) => {
    const [mappings, setMappings] = useState({});
    const [periodId, setPeriodId] = useState("");
    const [retro, setRetro] = useState(false);
    const [isOffCycle, setIsOffCycle] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [submitting, setSubmitting] = useState(false); // Track submission state

    useEffect(() => {
        fetchInputs();
    }, []);

    const fetchInputs = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/inputs/getInputs");
            setInputs(response.data);
        } catch (err) {
            toast.error("Error fetching inputs.");
        }
    };

    const handleMappingChange = (header, inputId) => {
        setMappings((prev) => ({ ...prev, [header]: inputId }));
    };

    const handleSubmit = async () => {
        setSubmitting(true); // Start spinner
        const payload = {
            file_id: fileData.file_id,
            period_id: periodId,
            retro,
            is_off_cycle: isOffCycle,
            mapping: mappings,
        };
    
        try {
            const response = await axios.post("http://localhost:3000/api/entery/submit", payload);
    
            if (response.data.errors && response.data.errors.length > 0) {
                response.data.errors.forEach(err => {
                    toast.error(`Person ${err.person_number}: ${err.error}`);
                });
            } else {
                toast.success("Mapping submitted successfully!");
            }
        } catch (error) {
            toast.error("Mapping failed. " + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false); // Stop spinner
        }
    };

    return (
        <div className="max-h-[600px] overflow-y-auto p-5">
            <h2 className="text-lg font-bold mb-4">Step 2: Map Headers</h2>
            <p className="mb-2">File: {fileData.file_id}</p>

            <div className="mt-4">
                <label className="block mb-1 font-semibold">Period ID:</label>
                <input
                    type="text"
                    value={periodId}
                    onChange={(e) => setPeriodId(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="flex gap-4 mt-4">
                <label>
                    <input type="checkbox" checked={retro} onChange={() => setRetro(!retro)} /> Retro
                </label>
                <label>
                    <input type="checkbox" checked={isOffCycle} onChange={() => setIsOffCycle(!isOffCycle)} /> Off Cycle
                </label>
            </div>

            <div className="mt-4">
                <h3 className="font-bold">Map Headers:</h3>
                {fileData.headers.map((header) => (
                    <div key={header} className="mt-2">
                        <label className="block">{header}:</label>
                        <select
                            onChange={(e) => handleMappingChange(header, Number(e.target.value))}
                            className="border p-2 w-full rounded"
                        >
                            <option value="">Select Input</option>
                            {inputs.map((input) => (
                                <option key={input.id} value={input.id}>
                                    {input.slug}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4">
                <button 
                    onClick={onPrev} 
                    className="m-3 px-4 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
                >
                    Back
                </button>

                <button 
                    onClick={handleSubmit} 
                    disabled={submitting} 
                    className={`m-3 px-4 py-2 rounded-lg flex items-center gap-2 text-white ${submitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    {submitting ? <ClipLoader size={20} color="#ffffff" /> : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default MappingStep;
