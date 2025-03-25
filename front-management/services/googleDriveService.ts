// services/googleDriveService.ts
import googleAuthService from './googleAuthService';

/**
 * Types for Google Drive API
 */
interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
}

/**
 * Interface for folder contents with separated files and folders
 */
interface FolderContents {
  folders: GoogleDriveFile[];
  files: GoogleDriveFile[];
}

interface ListFilesOptions {
  pageSize?: number;
  query?: string;
  fields?: string;
}

interface FileUploadOptions {
  name?: string;
  mimeType?: string;
  folderId?: string;
  onProgress?: (progress: number) => void;
}

export const googleDriveService = {
  apiKey: '',

  /**
   * Initialize Google Drive API
   */
  initialize(apiKey: string) {
    this.apiKey = apiKey;

    // Load Google API client library if not already loaded
    return new Promise<void>((resolve, reject) => {
      // Check if already loaded
      if (window.gapi) {
        this.initDriveAPI().then(resolve).catch(reject);
        return;
      }

      // Load gapi script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.initDriveAPI().then(resolve).catch(reject);
      };
      script.onerror = (error) => {
        console.error('Error loading Google API script:', error);
        reject(new Error('Failed to load Google API script'));
      };
      document.body.appendChild(script);
    });
  },

  /**
   * Initialize Google Drive API
   */
  async initDriveAPI() {
    return new Promise<void>((resolve, reject) => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: this.apiKey,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
          });

          console.log('Google Drive API initialized successfully');
          resolve();
        } catch (error) {
          console.error('Error initializing Google Drive API:', error);
          reject(error);
        }
      });
    });
  },

  /**
   * Check if user is signed in
   */
  isSignedIn() {
    return googleAuthService.isSignedIn.value;
  },

  /**
   * Get access token
   */
  getAccessToken() {
    return googleAuthService.accessToken.value;
  },

  /**
   * List files and folders in Google Drive
   */
  async listFiles(options: ListFilesOptions = {}): Promise<GoogleDriveFile[]> {
    if (!this.isSignedIn()) {
      throw new Error('User not signed in to Google Drive');
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const defaultOptions: ListFilesOptions = {
      pageSize: 100,
      query: "trashed=false",
      fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, parents)'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      // Set auth header
      window.gapi.client.setToken({ access_token: accessToken });

      const response = await window.gapi.client.drive.files.list({
        'pageSize': mergedOptions.pageSize,
        'fields': mergedOptions.fields,
        'q': mergedOptions.query
      });

      return response.result.files || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },


  /**
   * Get folders in Google Drive
   */
  async getFolders(): Promise<GoogleDriveFile[]> {
    return this.listFiles({
      query: "mimeType='application/vnd.google-apps.folder' and trashed=false"
    });
  },

  /**
   * Create a folder in Google Drive
   */
  async createFolder(name: string, parentId: string | null = null): Promise<GoogleDriveFile> {
    if (!this.isSignedIn()) {
      throw new Error('User not signed in to Google Drive');
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const metadata: any = {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    };

    if (parentId) {
      metadata.parents = [parentId];
    }

    try {
      // Set auth header
      window.gapi.client.setToken({ access_token: accessToken });

      const response = await window.gapi.client.drive.files.create({
        resource: metadata,
        fields: 'id, name, mimeType'
      });

      return response.result;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(file: File, options: FileUploadOptions = {}): Promise<GoogleDriveFile> {
    if (!this.isSignedIn()) {
      throw new Error('User not signed in to Google Drive');
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const metadata: any = {
      name: options.name || file.name,
      mimeType: options.mimeType || file.type
    };

    if (options.folderId) {
      metadata.parents = [options.folderId];
    }

    try {
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      // Use XHR to track upload progress
      const uploadPromise = new Promise<GoogleDriveFile>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Set up progress tracking
        if (options.onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              options.onProgress!(progress);
            }
          });
        }

        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 201) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };

        xhr.send(form);
      });

      return await uploadPromise;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Download a file from Google Drive
   */
  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.isSignedIn()) {
      throw new Error('User not signed in to Google Drive');
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      // Set auth header
      window.gapi.client.setToken({ access_token: accessToken });

      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId: string): Promise<void> {
    if (!this.isSignedIn()) {
      throw new Error('User not signed in to Google Drive');
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      // Set auth header
      window.gapi.client.setToken({ access_token: accessToken });

      await window.gapi.client.drive.files.delete({
        fileId
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Add this method to your googleDriveService object, right after listFiles method:

  /**
   * List contents (files and folders) of a specific folder
   * @param folderId The ID of the folder to list contents from, or null for root
   * @returns Object containing separated files and folders arrays
   */
  async listContents(folderId) {
    if (!this.isSignedIn()) {
      throw new Error('User not signed in to Google Drive');
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Build query to get folder contents
    let query = "trashed=false";

    if (folderId === null) {
      // List files in root if no folder ID provided
      query += " and 'root' in parents";
    } else {
      // List files in the specified folder
      query += ` and '${folderId}' in parents`;
    }

    try {
      // Set auth header
      window.gapi.client.setToken({ access_token: accessToken });

      const response = await window.gapi.client.drive.files.list({
        'pageSize': 100,
        'fields': 'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink)',
        'q': query
      });

      const items = response.result.files || [];

      // Separate folders from files
      const folders = items.filter(item =>
        item.mimeType === 'application/vnd.google-apps.folder'
      );

      const files = items.filter(item =>
        item.mimeType !== 'application/vnd.google-apps.folder'
      );

      return {
        folders: folders,
        files: files
      };
    } catch (error) {
      console.error('Error listing folder contents:', error);
      throw error;
    }
  }

};

// Add type declarations for Google API
declare global {
  interface Window {
    gapi: any;
  }
}

export default googleDriveService;