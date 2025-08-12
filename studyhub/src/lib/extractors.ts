import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import Tesseract from 'tesseract.js'

// @ts-ignore - runtime global assignment for pdf.js worker
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.4/pdf.worker.min.js`

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (ext === 'pdf') return extractFromPdf(file)
  if (ext === 'docx') return extractFromDocx(file)
  if (['png','jpg','jpeg','gif','bmp','tiff','webp'].includes(ext)) return extractFromImage(file)
  if (['txt','md','csv'].includes(ext)) return file.text()
  // Unsupported formats (pptx, doc, etc.)
  return ''
}

async function extractFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const strings = content.items.map((item: any) => item.str)
    text += strings.join(' ') + '\n'
  }
  return text
}

async function extractFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const { value } = await mammoth.extractRawText({ arrayBuffer })
  return value
}

async function extractFromImage(file: File): Promise<string> {
  const { data } = await Tesseract.recognize(file, 'eng+fra')
  return data.text
}