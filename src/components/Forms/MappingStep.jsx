import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CircularProgress, Typography, Button, Select, MenuItem, Checkbox, FormControlLabel, Stack } from "@mui/material";

const MappingStep = ({ fileData, onPrev, period, payroll }) => {
    const [mappings, setMappings] = useState({});
    const [retro, setRetro] = useState(false);
    const [isOffCycle, setIsOffCycle] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [submitting, setSubmitting] = useState(false);

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
        setSubmitting(true);
        const payload = {
            file_id: fileData.file_id,
            period_id: period,
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
            setSubmitting(false);
        }
    };

    return (
        <div className="max-h-[600px] overflow-y-auto p-5">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Step 2: Mapping
            </Typography>

            <Stack direction="row" spacing={2} mt={2}>
                <FormControlLabel
                    control={<Checkbox checked={retro} onChange={() => setRetro(!retro)} />}
                    label="Retro"
                />
                <FormControlLabel
                    control={<Checkbox checked={isOffCycle} onChange={() => setIsOffCycle(!isOffCycle)} />}
                    label="Off Cycle"
                />
            </Stack>

            <Typography variant="subtitle1" fontWeight="bold" mt={3}>
                Map Headers:
            </Typography>

            {fileData.headers.map((header) => (
                <Stack key={header} direction="row" spacing={2} alignItems="center" mt={2}>
                    <Typography
                        variant="body2"
                        sx={{ width: "30%", wordWrap: "break-word", whiteSpace: "normal" }}
                    >
                        {header}:
                    </Typography>
                    <Select
                        fullWidth
                        onChange={(e) => handleMappingChange(header, Number(e.target.value))}
                        sx={{ flexGrow: 1 }}
                    >
                        <MenuItem value="">Select Input</MenuItem>
                        {inputs.map((input) => (
                            <MenuItem key={input.id} value={input.id}>
                                {input.slug}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            ))}

            <Stack direction="row" justifyContent="space-between" mt={4}>
                <Button onClick={onPrev} variant="contained" color="secondary">
                    Back
                </Button>
                <Button
                sx={{background:"#202020" ,color:"White"}}
                    onClick={handleSubmit}
                    variant="contained"
                    
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </Button>
            </Stack>
        </div>
    );
};

export default MappingStep;
