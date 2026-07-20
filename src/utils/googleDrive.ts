/**
 * Google Drive API REST Client Helpers
 */

/**
 * Searches for a folder by name. If found, returns its ID. Otherwise returns null.
 */
export async function findDriveFolder(accessToken: string, folderName: string): Promise<string | null> {
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Google Drive API search failed with status ${res.status}`);
    }
    
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error finding Google Drive folder:", error);
    return null;
  }
}

/**
 * Creates a new folder in Google Drive and returns its ID.
 */
export async function createDriveFolder(accessToken: string, folderName: string): Promise<string> {
  // Check if it already exists first to avoid duplicates
  const existingId = await findDriveFolder(accessToken, folderName);
  if (existingId) {
    return existingId;
  }

  const url = "https://www.googleapis.com/drive/v3/files";
  const body = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Folder creation failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error("Error creating Google Drive folder:", error);
    throw error;
  }
}

/**
 * Uploads a text file containing inquiry details and auto-reply backup into a specific folder in Google Drive.
 */
export async function uploadInquiryBackup(
  accessToken: string,
  folderId: string,
  fileName: string,
  content: string
): Promise<string> {
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: "text/plain",
  };

  // We use a multipart upload to send both file metadata and file content in a single request
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/plain\r\n\r\n" +
    content +
    closeDelimiter;

  const url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error("Error uploading inquiry backup to Google Drive:", error);
    throw error;
  }
}

/**
 * Lists the user's documents and PDF files so they can select them as attachments.
 */
export async function listPotentialAttachments(accessToken: string): Promise<any[]> {
  const query = encodeURIComponent(
    "(mimeType = 'application/pdf' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain') and trashed = false"
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&pageSize=15&fields=files(id,name,mimeType,webViewLink)&orderBy=modifiedTime desc`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Listing files failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error("Error listing potential attachments from Google Drive:", error);
    return [];
  }
}
