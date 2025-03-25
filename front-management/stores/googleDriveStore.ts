// stores/googleDriveStore.ts
import { defineStore } from 'pinia';
import googleDriveService from '../services/googleDriveService';

// Define types
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

interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

interface PathItem {
  id: string | null;
  name: string;
}

interface GoogleDriveState {
  isInitialized: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  userInfo: GoogleUserProfile | null;
  documents: GoogleDriveFile[];
  folders: GoogleDriveFile[];
  currentPath: PathItem[];
  uploadProgress: number;
  isUploading: boolean;
}

// Options for file upload
interface FileUploadOptions {
  name?: string;
  mimeType?: string;
  folderId?: string;
  onProgress?: (progress: number) => void;
}

export const useGoogleDriveStore = defineStore('googleDrive', {
  state: (): GoogleDriveState => ({
    isInitialized: false,
    isConnected: false,
    isLoading: false,
    error: null,
    userInfo: null,
    documents: [],
    folders: [],
    currentPath: [],
    uploadProgress: 0,
    isUploading: false
  }),
  
  getters: {
    currentFolderId: (state): string | null => {
      if (state.currentPath.length === 0) return null;
      return state.currentPath[state.currentPath.length - 1].id;
    },
    
    rootFolders: (state): GoogleDriveFile[] => {
      return state.folders.filter(folder => {
        // Root folders either have no parents or have parents outside the user's Drive
        return !folder.parents || folder.parents.length === 0;
      });
    },
    
    currentFolderName: (state): string => {
      if (state.currentPath.length === 0) return 'My Drive';
      return state.currentPath[state.currentPath.length - 1].name;
    },
    
    currentDocuments: (state): GoogleDriveFile[] => {
      const currentFolderId = state.currentPath.length === 0 ? null : state.currentPath[state.currentPath.length - 1].id;
      
      if (!currentFolderId) {
        // Return root files and folders
        return state.documents.filter(doc => {
          return !doc.parents || doc.parents.length === 0;
        });
      }
      
      // Return files and folders in the current folder
      return state.documents.filter(doc => {
        return doc.parents && doc.parents.includes(currentFolderId);
      });
    },
    
    breadcrumbs: (state): PathItem[] => {
      return [
        { id: null, name: 'My Drive' },
        ...state.currentPath
      ];
    }
  },
  
  actions: {
    async initialize(): Promise<void> {
      if (this.isInitialized) return;
      
      try {
        this.isLoading = true;
        await googleDriveService.loadGapiClient();
        await googleDriveService.initClient();
        
        // Check if already signed in
        const isSignedIn = await googleDriveService.isSignedIn();
        this.isConnected = isSignedIn;
        
        if (isSignedIn) {
          await this.loadUserInfo();
          await this.fetchDocuments();
        }
        
        this.isInitialized = true;
      } catch (error: any) {
        console.error('Failed to initialize Google Drive', error);
        this.error = error.message || 'Failed to initialize Google Drive';
      } finally {
        this.isLoading = false;
      }
    },
    
    async connect(): Promise<void> {
      try {
        this.isLoading = true;
        await googleDriveService.signIn();
        this.isConnected = true;
        await this.loadUserInfo();
        await this.fetchDocuments();
      } catch (error: any) {
        console.error('Failed to connect to Google Drive', error);
        this.error = error.message || 'Failed to connect to Google Drive';
      } finally {
        this.isLoading = false;
      }
    },
    
    async disconnect(): Promise<void> {
      try {
        this.isLoading = true;
        await googleDriveService.signOut();
        this.isConnected = false;
        this.userInfo = null;
        this.documents = [];
        this.folders = [];
        this.currentPath = [];
      } catch (error: any) {
        console.error('Failed to disconnect from Google Drive', error);
        this.error = error.message || 'Failed to disconnect from Google Drive';
      } finally {
        this.isLoading = false;
      }
    },
    
    async loadUserInfo(): Promise<void> {
      try {
        const userInfo = await googleDriveService.getUserInfo();
        this.userInfo = userInfo;
      } catch (error: any) {
        console.error('Failed to load user info', error);
        this.error = error.message || 'Failed to load user info';
      }
    },
    
    async fetchDocuments(): Promise<void> {
      try {
        this.isLoading = true;
        const files = await googleDriveService.listFiles();
        this.documents = files;
        this.folders = files.filter(file => file.mimeType === 'application/vnd.google-apps.folder');
      } catch (error: any) {
        console.error('Failed to fetch documents', error);
        this.error = error.message || 'Failed to fetch documents';
      } finally {
        this.isLoading = false;
      }
    },
    
    async navigateToFolder(folder: PathItem | null): Promise<void> {
      try {
        this.isLoading = true;
        
        // Update current path
        if (!folder) {
          // Navigate to root
          this.currentPath = [];
        } else {
          // Navigate to specific folder
          const index = this.currentPath.findIndex(f => f.id === folder.id);
          
          if (index >= 0) {
            // If folder is already in the path, truncate to that point
            this.currentPath = this.currentPath.slice(0, index + 1);
          } else {
            // Add folder to path
            this.currentPath.push(folder);
          }
        }
        
      } catch (error: any) {
        console.error('Failed to navigate to folder', error);
        this.error = error.message || 'Failed to navigate to folder';
      } finally {
        this.isLoading = false;
      }
    },
    
    async createFolder(name: string, parentId: string | null = null): Promise<GoogleDriveFile> {
      try {
        this.isLoading = true;
        const folder = await googleDriveService.createFolder(name, parentId || this.currentFolderId);
        
        // Add new folder to state
        this.documents.push(folder);
        this.folders.push(folder);
        
        return folder;
      } catch (error: any) {
        console.error('Failed to create folder', error);
        this.error = error.message || 'Failed to create folder';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async uploadFile(file: File, options: FileUploadOptions = {}): Promise<GoogleDriveFile> {
      try {
        this.isUploading = true;
        this.uploadProgress = 0;
        
        // If no folder specified, use current folder
        const folderId = options.folderId || this.currentFolderId;
        
        const uploadOptions: FileUploadOptions = {
          ...options,
          folderId,
          onProgress: (progress: number) => {
            this.uploadProgress = progress;
          }
        };
        
        const uploadedFile = await googleDriveService.uploadFile(file, uploadOptions);
        
        // Add uploaded file to state
        this.documents.push(uploadedFile);
        
        this.uploadProgress = 100;
        return uploadedFile;
      } catch (error: any) {
        console.error('Failed to upload file', error);
        this.error = error.message || 'Failed to upload file';
        throw error;
      } finally {
        this.isUploading = false;
      }
    },
    
    async deleteDocument(fileId: string): Promise<void> {
      try {
        this.isLoading = true;
        await googleDriveService.deleteFile(fileId);
        
        // Remove file from state
        this.documents = this.documents.filter(doc => doc.id !== fileId);
        this.folders = this.folders.filter(folder => folder.id !== fileId);
        
        // If current folder was deleted, navigate to parent
        if (this.currentPath.length > 0 && this.currentPath[this.currentPath.length - 1].id === fileId) {
          this.currentPath.pop();
        }
      } catch (error: any) {
        console.error('Failed to delete document', error);
        this.error = error.message || 'Failed to delete document';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async refreshDocuments(): Promise<void> {
      await this.fetchDocuments();
    },
    
    clearError(): void {
      this.error = null;
    }
  }
});