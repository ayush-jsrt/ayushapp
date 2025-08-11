import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [filenameInput, setFilenameInput] = useState("");
  const [content, setContent] = useState("");

  // Load file list
  const loadFileList = async (selected = "") => {
    const res = await axios.get("/files");
    setFiles(res.data);
    if (selected) setSelectedFile(selected);
  };

  // Load file content
  const loadFile = async () => {
    const filename = filenameInput || selectedFile;
    if (!filename) return alert("No file selected");

    try {
      const res = await axios.get(`/files/${filename}`);
      setContent(res.data.content || "");
    } catch {
      alert("File not found");
    }
  };

  // Save file (new or existing)
  const saveFile = async () => {
    let filename = filenameInput.trim() || selectedFile;
    if (!filename) return alert("Please enter a filename");
    if (!filename.endsWith(".txt")) filename += ".txt";

    await axios.post("/files", { filename, content });
    alert("File saved");
    await loadFileList(filename);
  };

  // Delete file
  const deleteFile = async () => {
    const filename = filenameInput || selectedFile;
    if (!filename) return alert("No file selected");
    if (!window.confirm(`Delete ${filename}?`)) return;

    await axios.delete(`/files/${filename}`);
    alert("File deleted");
    setContent("");
    setFilenameInput("");
    await loadFileList();
  };

  useEffect(() => {
    loadFileList();
  }, []);

  return (
    <div className="container">
      <h1>Text File Editor</h1>

      <div className="controls">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option value="">-- Select file --</option>
          {files.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="New or existing filename"
          value={filenameInput}
          onChange={(e) => setFilenameInput(e.target.value)}
        />

        <button onClick={loadFile}>Load</button>
        <button onClick={deleteFile}>Delete</button>
      </div>

      <textarea
        placeholder="File content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="actions">
        <button onClick={saveFile}>Save</button>
      </div>
    </div>
  );
}

export default App;
