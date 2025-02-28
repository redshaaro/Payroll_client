import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CircularProgress, Typography, Button, Select, MenuItem, Stack } from "@mui/material";

const UploadStep = ({ onUploadSuccess, period, setPeriod }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [payrolls, setPayrolls] = useState([]);
    const [selectedPayroll, setSelectedPayroll] = useState("");
    const [periods, setPeriods] = useState([]);
    const [loadingPayrolls, setLoadingPayrolls] = useState(true);
    const [loadingPeriods, setLoadingPeriods] = useState(false);

    useEffect(() => {
        const fetchPayrolls = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/payroll/getPayrollNames");
                setPayrolls(response.data);
            } catch (error) {
                toast.error("Failed to load payrolls.");
            } finally {
                setLoadingPayrolls(false);
            }
        };
        fetchPayrolls();
    }, []);

    useEffect(() => {
        if (!selectedPayroll) return;

        setLoadingPeriods(true);
        const fetchPeriods = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/period/getPeriod", {
                    params: { payrollName: selectedPayroll }
                });
                setPeriods(response.data);
            } catch (error) {
                toast.error("Failed to load periods.");
                setPeriods([]);
            } finally {
                setLoadingPeriods(false);
            }
        };
        fetchPeriods();
    }, [selectedPayroll]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !selectedPayroll || !period) {
            toast.error("Please select payroll, period, and a file.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("payroll", selectedPayroll);
        formData.append("period", period);

        try {
            const response = await axios.post("http://localhost:3000/api/excel/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Upload successful!");
            onUploadSuccess({ ...response.data, selectedPayroll, period });
        } catch (error) {
            toast.error("Upload failed. " + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-h-[600px] overflow-y-auto p-5">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Upload Excel File
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                <Select
                    value={selectedPayroll}
                    onChange={(e) => setSelectedPayroll(e.target.value)}
                    displayEmpty
                    fullWidth
                    disabled={loadingPayrolls}
                    sx={{ flexGrow: 1, minWidth: 200, backgroundColor: "#f5f5f5" }}
                >
                    <MenuItem value="">Select Payroll</MenuItem>
                    {loadingPayrolls ? (
                        <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                    ) : (
                        payrolls.map((p) => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))
                    )}
                </Select>

                <Select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    displayEmpty
                    fullWidth
                    disabled={!selectedPayroll || loadingPeriods}
                    sx={{ flexGrow: 1, minWidth: 200, backgroundColor: "#f5f5f5" }}
                >
                    <MenuItem value="">Select Period</MenuItem>
                    {loadingPeriods ? (
                        <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                    ) : (
                        periods.map((p) => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))
                    )}
                </Select>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mt={3}>
                <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="file-upload" />
                <label htmlFor="file-upload">
                    <Button variant="contained" color="secondary" component="span">
                        Choose File
                    </Button>
                </label>
                <Typography variant="body2">{file ? file.name : "No file chosen"}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" mt={4}>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    sx={{ backgroundColor: "#202020", color: "white" }}
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            </Stack>
        </div>
    );
};

export default UploadStep;