<template>
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 shadow-lg">
          <h1 class="text-3xl font-bold text-white">My Profile</h1>
          <p class="mt-2 text-indigo-100">Manage your account information</p>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
  
        <div v-else class="space-y-8">
          <!-- Profile Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="md:flex">
              <!-- Profile Image Section -->
              <div class="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                <div v-if="profileImage" class="relative group">
                  <img 
                    :src="profileImage" 
                    alt="Profile" 
                    class="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                  />
                  <div 
                    @click="triggerImageUpload"
                    class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div 
                  v-else 
                  @click="triggerImageUpload"
                  class="w-40 h-40 rounded-full bg-indigo-100 dark:bg-gray-600 flex items-center justify-center text-indigo-500 dark:text-indigo-300 text-6xl font-semibold border-4 border-white dark:border-gray-700 shadow-md cursor-pointer"
                >
                  {{ getInitials(profile.first_name, profile.last_name) }}
                </div>
                
                <button 
                  @click="triggerImageUpload"
                  class="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Change Photo
                </button>
                <input 
                  ref="fileInput" 
                  type="file" 
                  accept="image/*" 
                  class="hidden"
                  @change="handleImageUpload" 
                />
                
                <div class="mt-6 w-full">
                  <div class="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Role</div>
                  <div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200">
                    {{ profile.role === 'admin' ? 'Administrator' : 'User' }}
                  </div>
                </div>
              </div>
              
              <!-- Profile Form Section -->
              <div class="md:w-2/3 p-6">
                <form @submit.prevent="updateProfile">
                  <div class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                        <input 
                          id="firstName" 
                          v-model="profileForm.first_name" 
                          type="text" 
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          :class="{'border-red-500 dark:border-red-500': errors.first_name}"
                        />
                        <p v-if="errors.first_name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.first_name }}</p>
                      </div>
                      
                      <div>
                        <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                        <input 
                          id="lastName" 
                          v-model="profileForm.last_name" 
                          type="text" 
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          :class="{'border-red-500 dark:border-red-500': errors.last_name}"
                        />
                        <p v-if="errors.last_name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.last_name }}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input 
                        id="email" 
                        v-model="profileForm.email" 
                        type="email" 
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        :class="{'border-red-500 dark:border-red-500': errors.email}"
                      />
                      <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
                    </div>
                    
                    <div class="pt-4">
                      <button 
                        type="submit" 
                        class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                        :disabled="updating"
                      >
                        <svg v-if="updating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ updating ? 'Saving...' : 'Save Changes' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <!-- Security Settings Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Security Settings
              </h2>
            </div>
            
            <div class="p-6">
              <form @submit.prevent="changePassword">
                <div class="space-y-5">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input 
                      id="currentPassword" 
                      v-model="passwordForm.current_password" 
                      type="password" 
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      :class="{'border-red-500 dark:border-red-500': passwordErrors.current_password}"
                    />
                    <p v-if="passwordErrors.current_password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ passwordErrors.current_password }}</p>
                  </div>
                  
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input 
                      id="newPassword" 
                      v-model="passwordForm.new_password" 
                      type="password" 
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      :class="{'border-red-500 dark:border-red-500': passwordErrors.new_password}"
                    />
                    <p v-if="passwordErrors.new_password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ passwordErrors.new_password }}</p>
                  </div>
                  
                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input 
                      id="confirmPassword" 
                      v-model="passwordForm.confirm_password" 
                      type="password" 
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      :class="{'border-red-500 dark:border-red-500': passwordErrors.confirm_password}"
                    />
                    <p v-if="passwordErrors.confirm_password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ passwordErrors.confirm_password }}</p>
                  </div>
                  
                  <div class="pt-4">
                    <button 
                      type="submit" 
                      class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                      :disabled="changingPassword"
                    >
                      <svg v-if="changingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ changingPassword ? 'Changing Password...' : 'Change Password' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { userAPI } from '~/services/api/user';
  
  definePageMeta({
    layout: 'dashboard',
  });
  
  // Remove the toast import and use console.log for notifications instead
  const profile = ref({});
  const loading = ref(true);
  const updating = ref(false);
  const changingPassword = ref(false);
  const errors = ref({});
  const passwordErrors = ref({});
  const fileInput = ref(null);
  
  const profileForm = ref({
    first_name: '',
    last_name: '',
    email: '',
  });
  
  const passwordForm = ref({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const profileImage = computed(() => {
    return profile.value.profile_image ? profile.value.profile_image : null;
  });
  
  onMounted(async () => {
    await fetchProfile();
  });
  
  // Fetch user profile data using the API service
  async function fetchProfile() {
    try {
      loading.value = true;
      const response = await userAPI.getProfile();
      
      profile.value = response.data.data;
      
      // Initialize form with profile data
      profileForm.value = {
        first_name: profile.value.first_name,
        last_name: profile.value.last_name,
        email: profile.value.email,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use alert instead of toast for simple notification
      alert('Failed to load profile data');
    } finally {
      loading.value = false;
    }
  }
  
  // Update profile using the API service
  async function updateProfile() {
    try {
      errors.value = {};
      
      // Validate form
      if (!profileForm.value.first_name) {
        errors.value.first_name = 'First name is required';
      }
      
      if (!profileForm.value.last_name) {
        errors.value.last_name = 'Last name is required';
      }
      
      if (!profileForm.value.email) {
        errors.value.email = 'Email is required';
      } else if (!isValidEmail(profileForm.value.email)) {
        errors.value.email = 'Please enter a valid email address';
      }
      
      if (Object.keys(errors.value).length > 0) {
        return;
      }
      
      updating.value = true;
      
      const response = await userAPI.updateProfile({
        first_name: profileForm.value.first_name,
        last_name: profileForm.value.last_name,
        email: profileForm.value.email
      });
      
      profile.value = response.data.data;
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      updating.value = false;
    }
  }
  
  // Change password using the API service
  async function changePassword() {
    try {
      passwordErrors.value = {};
      
      // Validate form
      if (!passwordForm.value.current_password) {
        passwordErrors.value.current_password = 'Current password is required';
      }
      
      if (!passwordForm.value.new_password) {
        passwordErrors.value.new_password = 'New password is required';
      } else if (passwordForm.value.new_password.length < 8) {
        passwordErrors.value.new_password = 'Password must be at least 8 characters long';
      }
      
      if (!passwordForm.value.confirm_password) {
        passwordErrors.value.confirm_password = 'Please confirm your new password';
      } else if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
        passwordErrors.value.confirm_password = 'Passwords do not match';
      }
      
      if (Object.keys(passwordErrors.value).length > 0) {
        return;
      }
      
      changingPassword.value = true;
      
      await userAPI.changePassword({
        current_password: passwordForm.value.current_password,
        new_password: passwordForm.value.new_password
      });
      
      // Reset password form
      passwordForm.value = {
        current_password: '',
        new_password: '',
        confirm_password: ''
      };
      
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.data?.error?.includes('incorrect')) {
        passwordErrors.value.current_password = 'Current password is incorrect';
      } else {
        alert(error.message || 'Failed to change password');
      }
    } finally {
      changingPassword.value = false;
    }
  }
  
  // Handle image upload using the API service
  function triggerImageUpload() {
    fileInput.value.click();
  }
  
  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    try {
      alert('Uploading profile image...');
      
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('profile_image', file);
      
      // Upload image using the API service
      const response = await userAPI.uploadProfileImage(formData);
      
      // Update the profile with the new image URL
      profile.value = {
        ...profile.value,
        profile_image: response.data.data.profile_image
      };
      
      alert('Profile image updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload profile image');
      
      // For demo/fallback, you can still show the local preview
      if (process.env.NODE_ENV !== 'production') {
        const reader = new FileReader();
        reader.onload = (e) => {
          profile.value = {
            ...profile.value,
            profile_image: e.target.result
          };
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  // Helper functions
  function getInitials(firstName, lastName) {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  </script>