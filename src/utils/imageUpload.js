/**
 * Image upload utility
 * Converts images to base64 for local storage
 * In production, integrate with cloud storage (Cloudinary, AWS S3, etc.)
 */

export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export async function handleImageUpload(file) {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file')
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB')
  }

  try {
    const base64 = await convertFileToBase64(file)
    return base64
  } catch (error) {
    throw new Error('Failed to process image: ' + error.message)
  }
}

export function getImagePreview(base64String) {
  return base64String
}
