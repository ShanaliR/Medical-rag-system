import React, { useState, useRef } from "react";
import { FileUp, X, CheckCircle, AlertCircle } from "lucide-react";
import authAxios from "../utils/authAxios";

//const API_BASE_URL = "http://localhost:8000/api";

const DocumentManager = ({ patientId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Medical Report");
  const fileInputRef = useRef(null);

  const documentTypes = [
    // "X-Ray",
    "Test Result",
    // "MRI",
    // "CT Scan",
    "Prescription",
    "Medical Record",
    "Other",
  ];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !patientId || !documentName.trim() || !documentType) {
      showNotification(
        "Please select a patient, fill in all details, and choose a file",
        "error"
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    formData.append("documentName", documentName);
    formData.append("documentType", documentType);

    try {
      // const response = await fetch(`${API_BASE_URL}/documents/add`, {
      //   method: "POST",
      //   body: formData,
      // });

    //   const response = await authAxios.post(
    //   "/documents/add",
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );

    //   //const data = await response.json();
    //   const data = response.data;

    //   if (response.ok) {
    //     showNotification("Document uploaded successfully!", "success");
    //     await fetchPatientDocuments();
    //     // Reset form
    //     setDocumentName("");
    //     setDocumentType("Medical Report");
    //     if (fileInputRef.current) {
    //       fileInputRef.current.value = "";
    //     }



    const response = await authAxios.post("/documents/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Axios doesn't have response.ok
      if (response.status >= 200 && response.status < 300) {
        showNotification("Document uploaded successfully!", "success");
        setDocumentName("");
        setDocumentType("Medical Report");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchPatientDocuments();
      } else {
        showNotification(response.data.message || "Upload failed", "error");
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      showNotification(
        err.response?.data?.message || "Error uploading document",
        "error"
      );
    //   } else {
    //     showNotification(data.message || "Upload failed", "error");
    //   }
    // } catch (error) {
    //   console.error("Error uploading document:", error);
    //   showNotification("Error uploading document", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDocuments = async () => {
    if (!patientId) return;

    // try {
    //   // const response = await fetch(
    //   //   `${API_BASE_URL}/documents/patient/${patientId}`
    //   // );
    //   // const data = await response.json();
    //   const response = await authAxios.get(`/documents/patient/${patientId}`);

    //   const data = response.data;

    //   if (response.ok && Array.isArray(data.documents)) {
    //     setDocuments(data.documents);
    //   } else {
    //     setDocuments([]);
    //   }
    // } catch (error) {
    //   console.error("Error fetching documents:", error);
    //   setDocuments([]);
    // }

    try {
      const response = await authAxios.get(`/documents/patient/${patientId}`);
      if (Array.isArray(response.data.documents)) {
        setDocuments(response.data.documents);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setDocuments([]);
    }
  };

  React.useEffect(() => {
    fetchPatientDocuments();
  }, [patientId]);

  const handleDownload = async (documentId) => {
    try {
      //const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);
      const response = await authAxios.get(
      `/documents/${documentId}`,
      { responseType: "blob" }
    );
      if (response.ok) {
        //const blob = await response.blob();
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `document-${documentId}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      showNotification("Error downloading document", "error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileUp className="w-6 h-6 text-blue-600" />
        Medical Documents
      </h3>

      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {!patientId ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-yellow-800">
          <p>Please select or search for a patient to manage documents</p>
        </div>
      ) : (
        <>
          {/* Upload Section */}
          <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
            {/* Form Fields */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  disabled={loading}
                  placeholder="e.g., Blood Test Report, X-Ray Scan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div className="flex flex-col items-center justify-center">
              <FileUp className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium mb-2">
                Upload Medical Document
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PDF, DOCX, JPG, PNG supported
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                disabled={loading}
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || !documentName.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? "Uploading..." : "Choose File"}
              </button>
            </div>
          </div>

          {/* Documents List */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              Uploaded Documents ({documents.length})
            </h4>
            {documents.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {doc.documentName ||
                          `Document-${doc._id.substring(0, 8)}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doc.documentType || "Medical Record"} •{" "}
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString()
                          : "Date not available"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(doc._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentManager;
