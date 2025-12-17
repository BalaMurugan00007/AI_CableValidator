"use client";

import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  Typography,
  CircularProgress,
} from "@mui/material";

type ValidationRow = {
  id: number;
  field: string;
  provided: string;
  expected: string;
  status: "PASS" | "WARN" | "FAIL";
  comment: string;
};

export default function DesignValidatorPage() {
  const [inputText, setInputText] = useState("");
  const [rows, setRows] = useState<ValidationRow[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!inputText.trim()) {
      alert("Please enter cable design details");
      return;
    }

    setLoading(true);
    setRows([]);
    setConfidence(null);
    setReasoning(null);

    try {
      const res = await fetch(
        "http://localhost:3000/design/validate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: inputText }),
        }
      );

      if (!res.ok) {
        throw new Error("Backend returned an error");
      }

      const data = await res.json();

      if (!data.validation || !Array.isArray(data.validation)) {
        throw new Error("Invalid response format");
      }

      const mappedRows: ValidationRow[] = data.validation.map(
        (item: any, index: number) => ({
          id: index,
          field: item.field,
          provided: item.provided ?? "—",
          expected: item.expected,
          status: item.status,
          comment: item.comment,
        })
      );

      setRows(mappedRows);
      setConfidence(data.confidence?.overall ?? null);
      setReasoning(data.reasoning ?? null);
    } catch (err) {
      console.error("Validation failed:", err);
      alert("Validation failed. AI quota or backend issue.");
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "field", headerName: "Attribute", flex: 1 },
    { field: "provided", headerName: "Provided", flex: 1 },
    { field: "expected", headerName: "Expected", flex: 1.4 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value as "PASS" | "WARN" | "FAIL";
        const color =
          value === "PASS"
            ? "success"
            : value === "WARN"
            ? "warning"
            : "error";
        return <Chip label={value} color={color} size="small" />;
      },
    },
    { field: "comment", headerName: "Comment", flex: 2 },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background:
          "radial-gradient(circle at top left, #1e293b, #020617 65%)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 4,
          borderRadius: 4,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
          AI-Driven Cable Design Validator
        </Typography>

        <Typography color="rgba(255,255,255,0.65)" mb={3}>
          Validate cable designs using AI-based IEC engineering reasoning.
        </Typography>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(2,6,23,0.95)",
            color: "white",
            outline: "none",
          }}
          placeholder="IEC 60502-1 cable, 0.6/1 kV, 16 sqmm Cu Class 2, PVC insulation thickness 0.9 mm"
        />

        <Button
          onClick={handleValidate}
          disabled={loading}
          sx={{
            mt: 3,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            background:
              "linear-gradient(135deg, #22d3ee, #6366f1)",
            color: "black",
            "&:hover": {
              background:
                "linear-gradient(135deg, #38bdf8, #818cf8)",
            },
          }}
        >
          {loading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} />
              AI is reasoning…
            </Box>
          ) : (
            "Validate Design"
          )}
        </Button>

        {confidence !== null && (
          <Typography mt={3} color="#7dd3fc" fontWeight="bold">
            AI Confidence: {(confidence * 100).toFixed(0)}%
          </Typography>
        )}

        <Box
          sx={{
            height: 420,
            mt: 4,
            borderRadius: 3,
            background: "rgba(2,6,23,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            p: 1,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5]}
          />
        </Box>

        {/* 🔍 AI REASONING PANEL */}
        {reasoning && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Typography
              fontWeight="bold"
              color="#7dd3fc"
              gutterBottom
            >
              AI Reasoning
            </Typography>

            <Typography
              fontSize="14px"
              lineHeight={1.7}
              color="rgba(255,255,255,0.85)"
            >
              {reasoning}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
