export type Detection = {
  class: 'signature' | 'stamp' | 'qr' | string
  confidence: number
  bbox: [number, number, number, number]
}

export type PageResult = {
  page_index: number
  width: number
  height: number
  objects: Detection[]
  image_base64?: string
}

export type FileAnalysisResult = {
  file_name: string
  pages: PageResult[]
}

export type MultiFileAnalyzeResponse = {
  files: FileAnalysisResult[]
}

export type AnalyzeResponse = FileAnalysisResult
