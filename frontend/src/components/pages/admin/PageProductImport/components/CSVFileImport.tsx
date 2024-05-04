import React from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Alert, Snackbar } from "@mui/material";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [msg, setMsg] = React.useState<Record<string, any>>({
    isOpen: false,
    severity: "",
    data: "",
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) {
      return null;
    }

    console.log("uploadFile to", url);

    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data.data);

      const result = await fetch(response.data.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      onSuccess("Uploaded!");
      setFile(undefined);
    } catch (err) {
      onError((err as any)?.message);
    }
  };

  const onSuccess = (data: string) => {
    setMsg({
      isOpen: true,
      severity: "success",
      data,
    });
  };

  const onError = (data: string) => {
    setMsg({
      isOpen: true,
      severity: "error",
      data,
    });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setMsg({
      isOpen: false,
      severity: "",
      data: "",
    });
  };

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {!file ? (
          <input type="file" onChange={onFileChange} />
        ) : (
          <div>
            <button onClick={removeFile}>Remove file</button>
            <button onClick={uploadFile}>Upload file</button>
          </div>
        )}
      </Box>
      <Snackbar
        open={msg.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={msg.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {msg.data}
        </Alert>
      </Snackbar>
    </>
  );
}
