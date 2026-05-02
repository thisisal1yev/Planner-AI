const IMGBB_UPLOAD_URL = import.meta.env.VITE_IMGBB_UPLOAD_URL as string
const IMGBB_API_KEY    = import.meta.env.VITE_IMGBB_API_KEY    as string

export interface ImgbbUploadResult {
  url: string
  displayUrl: string
  deleteUrl: string
}

export async function uploadToImgbb(file: File): Promise<ImgbbUploadResult> {
  if (!IMGBB_UPLOAD_URL || !IMGBB_API_KEY) {
    throw new Error('imgbb env vars not set: VITE_IMGBB_UPLOAD_URL and VITE_IMGBB_API_KEY required')
  }

  const form = new FormData()
  form.append('image', file)

  const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    throw new Error(`imgbb upload failed: HTTP ${response.status}`)
  }

  const json = (await response.json()) as {
    success: boolean
    data: { url: string; display_url: string; delete_url: string }
  }

  if (!json.success) {
    throw new Error('imgbb upload failed: API returned success=false')
  }

  return {
    url: json.data.url,
    displayUrl: json.data.display_url,
    deleteUrl: json.data.delete_url,
  }
}
