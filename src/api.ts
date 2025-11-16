import type { AnalyzeResponse, MultiFileAnalyzeResponse } from './types'

const BASE_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:8000'

export async function analyze(file: File): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('files', file)
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg)
  }
  const data: MultiFileAnalyzeResponse = await res.json()
  return data.files[0]
}

export async function analyzeAnnotated(file: File): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('files', file)
  const res = await fetch(`${BASE_URL}/api/analyze/annotated`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg)
  }
  const data: MultiFileAnalyzeResponse = await res.json()
  return data.files[0]
}

export async function analyzeMultiple(files: File[]): Promise<MultiFileAnalyzeResponse> {
  const form = new FormData()
  files.forEach(file => form.append('files', file))
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg)
  }
  return res.json()
}

export async function analyzeAnnotatedMultiple(files: File[]): Promise<MultiFileAnalyzeResponse> {
  const form = new FormData()
  files.forEach(file => form.append('files', file))
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 120000)

  try {
    const res = await fetch(`${BASE_URL}/api/analyze/annotated`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg)
    }
    return res.json()
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - try with fewer files')
    }
    throw error
  }
}
